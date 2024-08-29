import { Column } from "../../ui/layout/Flexbox";
import { PageColumn } from "../../ui/layout/Page";
import { useActiveWorkspace, useSettings } from "../settings/SettingsQueries";
import PromptEmptyProject from "./PromptEmptyProject";
import { useGenerateApplicationDescription } from "./ProjectQueries";
import EmptySettingsPlaceholder from "./EmptySettingsPlaceholder";
import { useCallback, useEffect, useState } from "react";
import { ApplicationDescriptionSheet } from "../../../electron/types/ApplicationDescriptionSheet.type";
import { useLocation } from "react-router-dom";
import ValidateAppDescriptionSheet from "../application-description-sheet/ValidateAppDescriptionSheet";

function EmptyProject() {
  const { settings } = useSettings();
  const activeWorkspace = useActiveWorkspace();
  const [promptValue, setPromptValue] = useState("");
  const [applicationDescriptionSheet, setApplicationDescriptionSheet] =
    useState<ApplicationDescriptionSheet | undefined>(undefined);
  const { generateApplicationDescription, isGenerateApplicationDescription } =
    useGenerateApplicationDescription();
  const location = useLocation();

  const handleGenerateApplicationDescription = useCallback(
    async (prompt: string) => {
      await generateApplicationDescription(prompt, {
        onSuccess: (result) => {
          setApplicationDescriptionSheet(result);
        },
      });
    },
    []
  );

  useEffect(() => {
    setPromptValue("");
    setApplicationDescriptionSheet(undefined);
  }, [location]);

  const settingsToComplete =
    !settings ||
    !settings.token ||
    !activeWorkspace ||
    (settings.platform === "WATSONX" && !settings.projectId);

  const isPrompted =
    applicationDescriptionSheet || isGenerateApplicationDescription;

  return (
    <PageColumn $disablePadding={true} $backgroundColor="var(--background-main2)">
      <Column $padding="var(--space-5)" $height="76px">
        <h1>ModelAIze</h1>
      </Column>
      {settingsToComplete && <EmptySettingsPlaceholder />}
      {!settingsToComplete && !isPrompted && (
        <PromptEmptyProject
          generateApplicationDescription={handleGenerateApplicationDescription}
          isGeneratingApplicationDescription={isGenerateApplicationDescription}
          promptValue={promptValue}
          setPromptValue={setPromptValue}
        />
      )}
      {!settingsToComplete && isPrompted && (
        <ValidateAppDescriptionSheet
          applicationDescriptionSheet={applicationDescriptionSheet}
          prompt={promptValue}
          isGenerateApplicationDescription={isGenerateApplicationDescription}
          setApplicationDescriptionSheet={setApplicationDescriptionSheet}
        />
      )}
    </PageColumn>
  );
}

export default EmptyProject;
