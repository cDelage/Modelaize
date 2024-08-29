import { useParams } from "react-router-dom";
import { Column, Row } from "../../ui/layout/Flexbox";
import HistoricSystemEntry from "./HistoricSystemEntry";
import HistoricUserEntry from "./HistoricUserEntry";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetChatHistoryByProjectId, useReapplyVersion } from "../project/ProjectQueries";
import LoaderCircle from "../../ui/layout/LoaderCircle";
import IconModelaize from "../../ui/icons/IconModelaize";
import { ICON_SIZE_MEDIUM } from "../../ui/UiConstants";

function ProjectHistoricMessages({
  isGeneratingNewVersion,
  prompt,
}: {
  isGeneratingNewVersion: boolean;
  prompt: string;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const bottom = useRef<HTMLDivElement>(null);
  const parentColumn = useRef<HTMLDivElement>(null);
  const [parentSize, setParentSize] = useState<number | undefined>(undefined);
  const { chatHistoric, isLoadingHistory } = useGetChatHistoryByProjectId(
    projectId as string
  );
  const { isReapplyingVersion, reapplyVersion } = useReapplyVersion();

  const handleGoToBottom = useCallback(
    (behavior: "instant" | "smooth") => {
      if (bottom.current) {
        bottom.current.scrollIntoView({ behavior });
      }
    },
    [bottom.current]
  );

  useEffect(() => {
    const scrollToBottom = () => {
      if (parentColumn.current) {
        parentColumn.current.scrollTop = parentColumn.current.scrollHeight;
      }
    };

    setTimeout(scrollToBottom, 50);
  }, [parentColumn.current]); 

  useEffect(() => {
    if (parentColumn.current) {
      const { scrollHeight } = parentColumn.current;
      if (parentSize != scrollHeight) {
        if (parentSize) {
          handleGoToBottom("smooth");
        }
        setParentSize(scrollHeight);
      }
    }
  }, [parentColumn.current?.scrollHeight, setParentSize, parentSize]);

  useEffect(() => {
    if (isGeneratingNewVersion) {
      handleGoToBottom("smooth");
    }
  }, [isGeneratingNewVersion, handleGoToBottom]);

  const isCurrentVersion = useCallback(
    (chatEntryIndex: number): boolean => {
      if (chatHistoric) {
        return (
          chatEntryIndex ===
          chatHistoric.filter((entry) => entry.projectVersion).length - 1
        );
      }
      return false;
    },
    [chatHistoric]
  );

  if (isLoadingHistory) return <LoaderCircle />;
  if (!chatHistoric) return <div>No project found</div>;

  return (
    <Column
      $gap="var(--space-8)"
      $grow={1}
      $overflow="auto"
      $padding="var(--space-2)"
      ref={parentColumn}
    >
      {chatHistoric.map((chatEntry, index) => (
        <>
          {chatEntry.prompt && <Row $justify="end">
            <HistoricUserEntry prompt={chatEntry.prompt} />
          </Row>}
          <Row $width="100%">
            <HistoricSystemEntry
              chatEntry={chatEntry}
              isCurrentVersion={isCurrentVersion(index)}
              isLastChatEntry={index === chatHistoric.length - 1 && !isGeneratingNewVersion}
              isReapplyingVersion={isReapplyingVersion}
              reapplyVersion={reapplyVersion}
              projectId={projectId as string}
            />
          </Row>
        </>
      ))}
      {isGeneratingNewVersion && (
        <>
          <Row $justify="end">
            <HistoricUserEntry prompt={prompt} />
          </Row>
          <Row $gap={"var(--space-3)"}>
            <IconModelaize height={ICON_SIZE_MEDIUM} width={ICON_SIZE_MEDIUM} />
            <div>
              <LoaderCircle />
            </div>
          </Row>
        </>
      )}
      <div ref={bottom} />
    </Column>
  );
}

export default ProjectHistoricMessages;
