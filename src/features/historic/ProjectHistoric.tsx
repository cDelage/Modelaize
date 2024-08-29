import { useParams } from "react-router-dom";
import { Column, Row } from "../../ui/layout/Flexbox";
import { H2Bold } from "../../ui/titles/H2Bold";
import Prompt from "../../ui/layout/Prompt";
import { ButtonIconPrimary } from "../../ui/buttons/ButtonIconPrimary";
import { IoSend } from "react-icons/io5";
import { ICON_FIT } from "../../ui/UiConstants";
import { UpdateVersionPayload } from "../../../electron/types/Project.type";
import ProjectHistoricMessages from "./ProjectHistoricMessages";

function ProjectHistoric({
  prompt,
  setPrompt,
  requestUpdate,
  isGeneratingNewVersion,
}: {
  prompt: string;
  setPrompt: (prompt: string) => void;
  requestUpdate: (payload: UpdateVersionPayload) => void;
  isGeneratingNewVersion: boolean;
}) {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <Column
      $padding="var(--space-6)"
      $grow={1}
      $overflow="hidden"
      $gap="var(--space-2)"
    >
      <H2Bold $color="var(--text-main)">Prompt History</H2Bold>
      <ProjectHistoricMessages
        isGeneratingNewVersion={isGeneratingNewVersion}
        prompt={prompt}
      />
      <Row
        $height="140px"
        $minHeight="140px"
        $align="end"
        $gap="var(--space-2)"
      >
        <Prompt
          width="100%"
          placeholder="Describe an evolution"
          $backgroundColor="white"
          $boxShadow="var(--shadow-solid)"
          disabled={isGeneratingNewVersion}
          value={!isGeneratingNewVersion ? prompt : ""}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <ButtonIconPrimary
          disabled={!prompt || isGeneratingNewVersion}
          onClick={() => requestUpdate({ prompt, id: projectId as string })}
        >
          <IoSend size={ICON_FIT} />
        </ButtonIconPrimary>
      </Row>
    </Column>
  );
}

export default ProjectHistoric;
