import styled from "styled-components";
import { ApplicationDescriptionSheet } from "../../../electron/types/ApplicationDescriptionSheet.type";
import { Column, Row } from "../../ui/layout/Flexbox";
import InputField from "../../ui/forms/InputField";
import { InputText } from "../../ui/forms/InputText";
import { TextArea } from "../../ui/forms/TextArea";
import { H2Bold } from "../../ui/titles/H2Bold";
import { Checkbox } from "../../ui/forms/Checkbox";
import BoxLabel from "../../ui/forms/BoxLabel";
import { ButtonPrimary } from "../../ui/buttons/ButtonPrimary";
import { IoAdd, IoClose, IoSend } from "react-icons/io5";
import { ButtonTertiary } from "../../ui/buttons/ButtonTertiary";
import { ICON_SIZE_MEDIUM, ICON_SIZE_SHORT } from "../../ui/UiConstants";
import { useCallback, useEffect, useRef, useState } from "react";
import { FeatureCheckable } from "../../../electron/types/FeatureCheckable.type";
import { ButtonIconPrimary } from "../../ui/buttons/ButtonIconPrimary";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../project/ProjectQueries";
import IconModelaize from "../../ui/icons/IconModelaize";
import LoaderCircle from "../../ui/layout/LoaderCircle";
import IconModelaizeGray from "../../ui/icons/IconModelaizeGray";
import PromptErrorMessage from "../../ui/error/PromptErrorMessage";

const UserPromptStyled = styled.div`
  border-radius: var(--radius);
  background-color: var(--background-main);
  padding: var(--space-4);
  width: 400px;
  resize: none;
`;

const ApplicationDescriptionSheetStyled = styled.div`
  border-radius: var(--radius);
  box-shadow: var(--shadow-solid);
  background-color: white;
  border: 1px solid var(--stroke-light);
  padding: var(--space-4);
  resize: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
  margin-bottom: var(--space-8);
`;

function ValidateAppDescriptionSheet({
  applicationDescriptionSheet,
  prompt,
  isGenerateApplicationDescription,
  setApplicationDescriptionSheet,
}: {
  applicationDescriptionSheet: ApplicationDescriptionSheet | undefined;
  prompt: string;
  isGenerateApplicationDescription: boolean;
  setApplicationDescriptionSheet: (
    applicationDescriptionSheet: ApplicationDescriptionSheet
  ) => void;
}) {
  const [featuresCheckables, setFeaturesCheckables] = useState<
    FeatureCheckable[] | undefined
  >(undefined);

  const [newFeature, setNewFeature] = useState("");
  const [newActor, setNewActor] = useState("");
  const navigate = useNavigate();
  const { createProject, isCreatingProject } = useCreateProject();
  const bottom = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  const setAppName = useCallback(
    (name: string) => {
      if (applicationDescriptionSheet) {
        setApplicationDescriptionSheet({
          ...applicationDescriptionSheet,
          name,
        });
      }
    },
    [setApplicationDescriptionSheet, applicationDescriptionSheet]
  );

  const setAppDesc = useCallback(
    (description: string) => {
      if (applicationDescriptionSheet) {
        setApplicationDescriptionSheet({
          ...applicationDescriptionSheet,
          description,
        });
      }
    },
    [setApplicationDescriptionSheet, applicationDescriptionSheet]
  );

  const handleCheckFeature = useCallback(
    (indexFeature: number) => {
      if (featuresCheckables) {
        setFeaturesCheckables(
          featuresCheckables.map((feature, index) => {
            return {
              ...feature,
              isChecked:
                index === indexFeature ? !feature.isChecked : feature.isChecked,
            };
          })
        );
      }
    },
    [featuresCheckables, setFeaturesCheckables]
  );

  const handleUpdateFeature = useCallback(
    (indexFeature: number, value: string) => {
      if (featuresCheckables) {
        setFeaturesCheckables(
          featuresCheckables.map((feature, index) => {
            return {
              ...feature,
              feature: index === indexFeature ? value : feature.feature,
            };
          })
        );
      }
    },
    [featuresCheckables, setFeaturesCheckables]
  );

  const handleAddNewFeature = useCallback(() => {
    if (newFeature && featuresCheckables) {
      setFeaturesCheckables([
        ...featuresCheckables,
        { feature: newFeature, isChecked: true },
      ]);
      setNewFeature("");
    }
  }, [newFeature, setNewFeature, featuresCheckables, setFeaturesCheckables]);

  const handleAddNewActor = useCallback(() => {
    if (applicationDescriptionSheet) {
      setApplicationDescriptionSheet({
        ...applicationDescriptionSheet,
        actors: [...applicationDescriptionSheet.actors, newActor],
      });
      setNewActor("");
    }
  }, [
    applicationDescriptionSheet,
    setApplicationDescriptionSheet,
    newActor,
    setNewActor,
  ]);

  const handleRemoveActor = useCallback(
    (indexActor: number) => {
      if (applicationDescriptionSheet) {
        setApplicationDescriptionSheet({
          ...applicationDescriptionSheet,
          actors: applicationDescriptionSheet.actors.filter(
            (_actor, index) => index !== indexActor
          ),
        });
      }
    },
    [applicationDescriptionSheet, setApplicationDescriptionSheet]
  );

  const handleCreateProject = useCallback(() => {
    if (featuresCheckables && applicationDescriptionSheet) {
      const appDescriptionSheet: ApplicationDescriptionSheet = {
        ...applicationDescriptionSheet,
        features: featuresCheckables.map((feature) => feature.feature),
      };
      createProject(
        {
          applicationDescription: appDescriptionSheet,
          prompt,
        },
        {
          onError: (err) => {
            setError(err.message);
          },
        }
      );
    }
  }, [
    applicationDescriptionSheet,
    featuresCheckables,
    createProject,
    setError,
  ]);

  useEffect(() => {
    if (applicationDescriptionSheet && !featuresCheckables) {
      setFeaturesCheckables(
        applicationDescriptionSheet.features.map((feature) => {
          return {
            feature,
            isChecked: true,
          };
        })
      );
    }
  }, [applicationDescriptionSheet, setFeaturesCheckables, featuresCheckables]);

  useEffect(() => {
    if (bottom.current) {
      bottom.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isCreatingProject, bottom]);

  return (
    <Row $justify="center" $overflow="auto">
      <Column $width="800px" $gap="var(--space-7)">
        <Row $justify="end">
          <UserPromptStyled>{prompt}</UserPromptStyled>
        </Row>
        <Row $gap="var(--space-3)">
          {isGenerateApplicationDescription && (
            <Row $padding="0px 0px var(--space-7) 0px" $gap={"var(--space-3)"}>
              <div>
                <IconModelaize
                  height={ICON_SIZE_MEDIUM}
                  width={ICON_SIZE_MEDIUM}
                />
              </div>
              <LoaderCircle />
            </Row>
          )}
          {!isGenerateApplicationDescription && applicationDescriptionSheet && (
            <>
              <Row>
                {!isCreatingProject && !error && (
                  <IconModelaize
                    height={ICON_SIZE_MEDIUM}
                    width={ICON_SIZE_MEDIUM}
                  />
                )}
                {(isCreatingProject || error) && (
                  <IconModelaizeGray
                    width={ICON_SIZE_MEDIUM}
                    height={ICON_SIZE_MEDIUM}
                  />
                )}
              </Row>
              <ApplicationDescriptionSheetStyled>
                <H2Bold>Application Description Sheet</H2Bold>
                <InputField label="Name">
                  <InputText
                    type="text"
                    value={applicationDescriptionSheet.name}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Give a name to your application"
                    disabled={isCreatingProject}
                  />
                </InputField>
                <InputField label="Description">
                  <TextArea
                    value={applicationDescriptionSheet.description}
                    onChange={(e) => setAppDesc(e.target.value)}
                    disabled={isCreatingProject}
                  />
                </InputField>
                <InputField label="Features">
                  <Row $gap="var(--space-2)" $align="center">
                    <InputText
                      placeholder="Add a feature"
                      $grow={true}
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      disabled={isCreatingProject}
                    />
                    <ButtonIconPrimary
                      onClick={handleAddNewFeature}
                      disabled={isCreatingProject}
                    >
                      <IoAdd size={ICON_SIZE_MEDIUM} />
                    </ButtonIconPrimary>
                  </Row>
                  {featuresCheckables?.map((feature, index) => (
                    <Row key={index} $gap="var(--space-2)">
                      <Checkbox
                        type="checkbox"
                        checked={feature.isChecked}
                        onChange={() => handleCheckFeature(index)}
                        disabled={isCreatingProject}
                      />
                      <InputText
                        value={feature.feature}
                        $grow={true}
                        disabled={!feature.isChecked || isCreatingProject}
                        onChange={(e) =>
                          handleUpdateFeature(index, e.target.value)
                        }
                      />
                    </Row>
                  ))}
                </InputField>
                <InputField label="Actors">
                  <Row $gap="var(--space-2)" $align="center">
                    <InputText
                      placeholder="Add an actor"
                      $grow={true}
                      value={newActor}
                      onChange={(e) => setNewActor(e.target.value)}
                      disabled={isCreatingProject}
                    />
                    <ButtonIconPrimary
                      onClick={handleAddNewActor}
                      disabled={isCreatingProject}
                    >
                      <IoAdd size={ICON_SIZE_MEDIUM} />
                    </ButtonIconPrimary>
                  </Row>
                  <Row $gap="var(--space-2)" $flexWrap="wrap">
                    {applicationDescriptionSheet.actors.map((actor, index) => (
                      <BoxLabel
                        key={`${actor}-${index}`}
                        deletable={!isCreatingProject}
                        onDelete={() => {
                          handleRemoveActor(index);
                        }}
                      >
                        {actor}
                      </BoxLabel>
                    ))}
                  </Row>
                </InputField>
                <Column $width="100%" $align="end" $gap="var(--space-2)">
                  <ButtonPrimary
                    $width="100%"
                    onClick={handleCreateProject}
                    disabled={isCreatingProject}
                  >
                    <IoSend size={ICON_SIZE_SHORT} /> Generate the modeling
                  </ButtonPrimary>
                  <ButtonTertiary
                    $width="100%"
                    onClick={() => navigate("/")}
                    disabled={isCreatingProject}
                  >
                    <IoClose size={ICON_SIZE_SHORT} />
                    Cancel application description sheet
                  </ButtonTertiary>
                </Column>
              </ApplicationDescriptionSheetStyled>
            </>
          )}
        </Row>
        {isCreatingProject && (
          <Row>
            <Row $padding="0px 0px var(--space-7) 0px" $gap={"var(--space-3)"}>
              <div>
                <IconModelaize
                  height={ICON_SIZE_MEDIUM}
                  width={ICON_SIZE_MEDIUM}
                />
              </div>
              <LoaderCircle />
            </Row>
          </Row>
        )}
        {error && (
          <Row $padding="0px 0px var(--space-7) 0px" $gap={"var(--space-3)"}>
            <div>
              <IconModelaize
                height={ICON_SIZE_MEDIUM}
                width={ICON_SIZE_MEDIUM}
              />
            </div>
            <PromptErrorMessage
              error={error}
              regenarate={handleCreateProject}
            />
          </Row>
        )}
        <div ref={bottom} />
      </Column>
    </Row>
  );
}

export default ValidateAppDescriptionSheet;
