import styled from "styled-components";
import { ChatEntry, ManualReapplyPayload } from "../../../electron/types/Project.type";
import { TextBold, TextSmall } from "../../ui/text/Text";
import { ButtonText } from "../../ui/buttons/ButtonText";
import { Column, Row } from "../../ui/layout/Flexbox";
import { IoDocumentOutline } from "react-icons/io5";
import { ICON_SIZE_MEDIUM, ICON_SIZE_SMALL } from "../../ui/UiConstants";
import IconModelaize from "../../ui/icons/IconModelaize";
import IconModelaizeGray from "../../ui/icons/IconModelaizeGray";
import ApplicationDescriptionSheetReadOnly from "../application-description-sheet/ApplicationDescriptionSheetReadOnly";

const SystemEntryStyled = styled.div`
  border-radius: var(--radius);
  width: fit-content;
  display: flex;
  width: 100%;
`;

const VersionGenerated = styled.div`
  background-color: var(--background-secondary);
  border-radius: var(--radius);
  padding: var(--space-3);
  display: flex;
  width: 200px;
  flex-direction: column;
  gap: var(--space-2);
  border: 1px solid var(--stroke-secondary);
  color: var(--text-secondary);
`;

function HistoricSystemEntry({
  chatEntry,
  isCurrentVersion,
  isLastChatEntry,
  isReapplyingVersion,
  reapplyVersion,
  projectId
}: {
  chatEntry: ChatEntry;
  isCurrentVersion: boolean;
  isLastChatEntry: boolean;
  isReapplyingVersion: boolean;
  reapplyVersion: (manualReapplyPayload: ManualReapplyPayload) => void;
  projectId: string
}) {
  const { applicationDescriptionSheet, agentLogs, isManualReapply, projectVersion, _id: versionId } = chatEntry;

  return (
    <SystemEntryStyled>
      <Row $gap="var(--space-3)" $width="100%">
        {!isManualReapply && <div>
          {isLastChatEntry && (
            <IconModelaize width={ICON_SIZE_MEDIUM} height={ICON_SIZE_MEDIUM} />
          )}
          {!isLastChatEntry && (
            <IconModelaizeGray
              width={ICON_SIZE_MEDIUM}
              height={ICON_SIZE_MEDIUM}
            />
          )}
        </div>}
        <Column $gap="var(--space-2)" $width="100%">
          {applicationDescriptionSheet && (
            <ApplicationDescriptionSheetReadOnly
              applicationDescriptionSheet={
                applicationDescriptionSheet
              }
            />
          )}
          {agentLogs}
          {projectVersion && (
            <Row $justify={isManualReapply ? "end" : ""}>

              <VersionGenerated>
                {isManualReapply && <TextSmall $color="var(--text-main)">Manual reapply from version {projectVersion.fromVersion}</TextSmall>}
                <Row $gap="var(--space-1)" $align="center">
                  <IoDocumentOutline size={ICON_SIZE_SMALL} />
                  <Row $padding="2px 0px 0px 0px">
                    <TextBold $color="var(--text-secondary)">
                      Version {projectVersion.version}
                    </TextBold>
                  </Row>
                </Row>
                {isCurrentVersion ? (
                  <TextSmall $color="var(--text-main)">Current version</TextSmall>
                ) : (
                  <ButtonText $color="var(--text-secondary)" $fontSize="0.8rem" disabled={isReapplyingVersion} onClick={() => reapplyVersion({ projectId, versionId })}>
                    Apply this version
                  </ButtonText>
                )}
              </VersionGenerated>
            </Row>
          )}
        </Column>
      </Row>
    </SystemEntryStyled>
  );
}

export default HistoricSystemEntry;
