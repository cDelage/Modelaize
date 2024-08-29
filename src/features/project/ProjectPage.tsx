import { useParams } from "react-router-dom";
import { useGetProjectById, useRequestUpdate } from "./ProjectQueries";
import { PageColumn } from "../../ui/layout/Page";
import { Column, Row } from "../../ui/layout/Flexbox";
import {
  IoChatbubbleEllipsesOutline,
  IoGridOutline,
  IoSwapVertical,
} from "react-icons/io5";
import { ICON_SIZE_SMALL } from "../../ui/UiConstants";
import Tabs, { Tab } from "../../ui/layout/Tabs";
import Viewport from "./Viewport";
import SidePannel from "../../ui/layout/SidePannel";
import ProjectHistoric from "../historic/ProjectHistoric";
import ServicesTab from "../tab-services/ServicesTab";
import { TextSmall } from "../../ui/text/Text";
import { useCallback, useEffect, useState } from "react";
import LoaderCircle from "../../ui/layout/LoaderCircle";
import { UpdateVersionPayload } from "../../../electron/types/Project.type";
import { ButtonTertiary } from "../../ui/buttons/ButtonTertiary";

const PROJECT_TABS: Tab[] = [
  {
    id: "model",
    children: (
      <>
        <IoGridOutline /> Model
      </>
    ),
  },
  {
    id: "services",
    children: (
      <>
        <IoSwapVertical /> Services
      </>
    ),
  },
];

function ProjectPage() {
  const { projectId } = useParams();
  const { project } = useGetProjectById(projectId as string);
  const [prompt, setPrompt] = useState("");
  const { requestUpdate, isGeneratingNewVersion } = useRequestUpdate();

  const handleRequestUpdate = useCallback(
    (payload: UpdateVersionPayload) => {
      requestUpdate(payload, {
        onSuccess: () => {
          setPrompt("");
        },
      });
    },
    [setPrompt]
  );

  useEffect(() => {
    setPrompt("");
  }, [projectId, setPrompt]);

  if (!project) return null;

  const { name, version, dateCreation } = project;

  return (
    <PageColumn $disablePadding={true} key={projectId}>
      <Column $padding="var(--space-4) var(--space-4) var(--space-2) var(--space-4)">
        <Row $justify="space-between" $align="center">
          <Row $gap={"var(--space-2)"}>
            <h1>{name}</h1>
            {isGeneratingNewVersion && (
              <Row $width="var(--space-4)">
                <LoaderCircle />
              </Row>
            )}
          </Row>
          <div>
            <SidePannel>
              <SidePannel.SidePannelButton>
                <ButtonTertiary>
                  <IoChatbubbleEllipsesOutline size={ICON_SIZE_SMALL} /> Chatbot
                </ButtonTertiary>
              </SidePannel.SidePannelButton>
              <SidePannel.SidePannelBody>
                <ProjectHistoric
                  prompt={prompt}
                  setPrompt={setPrompt}
                  requestUpdate={handleRequestUpdate}
                  isGeneratingNewVersion={isGeneratingNewVersion}
                />
              </SidePannel.SidePannelBody>
            </SidePannel>
          </div>
        </Row>
        <Row>
          <TextSmall $color="var(--text-light)">
            Version {version} - {new Date(dateCreation).toLocaleString()}
          </TextSmall>
        </Row>
      </Column>
      <Tabs tabs={PROJECT_TABS}>
        <Tabs.Window id="model">
          <Viewport />
        </Tabs.Window>
        <Tabs.Window id="services">
          <ServicesTab />
        </Tabs.Window>
      </Tabs>
    </PageColumn>
  );
}

export default ProjectPage;
