import styled from "styled-components";
import { Column, Row } from "../../ui/layout/Flexbox";
import { IoMenuOutline, IoSettingsOutline } from "react-icons/io5";
import { IoCreateOutline } from "react-icons/io5";
import { ICON_FIT } from "../../ui/UiConstants";
import { useNavigate } from "react-router-dom";
import { ButtonIconTertiary } from "../../ui/buttons/ButtonIconTertiary";
import UserSettingsModal from "../settings/UserSettingsModal";
import { useCallback, useState } from "react";
import SidePannel from "../../ui/layout/SidePannel";
import { useGetAllProjects } from "../project/ProjectQueries";
import ProjectTab from "./ProjectTab";

const SidebarStyled = styled.aside<{ $isExpand: boolean }>`
  border-right: 1px solid var(--stroke-main);
  background-color: var(--background-main);
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$isExpand ? "260px" : "50px")};
  transition: width 200ms;
`;

function Sidebar() {
  const navigate = useNavigate();
  const [isExpand, setIsExpand] = useState(true);
  const { allProjectsIndex, isLoadingProjects } = useGetAllProjects();

  const showTabs = isExpand && !isLoadingProjects && allProjectsIndex;

  const toggleIsExpand = useCallback(() => {
    setIsExpand((isExp) => !isExp);
  }, [setIsExpand]);

  return (
    <SidebarStyled $isExpand={isExpand}>
      <Row $justify="space-between" $padding="var(--space-4) var(--space-2)" $height="108px">
        <ButtonIconTertiary onClick={toggleIsExpand}>
          <IoMenuOutline size={ICON_FIT} />
        </ButtonIconTertiary>
        {isExpand && (
          <Row $gap="8px">
            <SidePannel>
              <SidePannel.SidePannelButton>
                <ButtonIconTertiary>
                  <IoSettingsOutline size={ICON_FIT} />
                </ButtonIconTertiary>
              </SidePannel.SidePannelButton>
              <SidePannel.SidePannelBody>
                <UserSettingsModal />
              </SidePannel.SidePannelBody>
            </SidePannel>
            <ButtonIconTertiary onClick={() => navigate("/")}>
              <IoCreateOutline size={ICON_FIT} />
            </ButtonIconTertiary>
          </Row>
        )}
      </Row>
      {showTabs && (
        <Column $gap="var(--space-1)" $overflow="auto">
          {allProjectsIndex.map((projectIndex) => (
            <ProjectTab key={projectIndex._id} projectIndex={projectIndex} />
          ))}
        </Column>
      )}
    </SidebarStyled>
  );
}

export default Sidebar;
