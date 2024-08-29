import styled, { css } from "styled-components";
import { ProjectIndex } from "../../../electron/types/Project.type";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonIconTertiary } from "../../ui/buttons/ButtonIconTertiary";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useCallback, useState } from "react";
import { ICON_FIT } from "../../ui/UiConstants";
import Menu from "../../ui/layout/Menu";
import { useUpdateProjectIndex } from "../project/ProjectQueries";

const ProjectTabStyled = styled.div<{
  $active: boolean;
}>`
  padding: var(--space-1) var(--space-2);
  margin: 0px var(--space-1);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-main);
  display: flex;
  justify-content: space-around;
  align-items: center;
  user-select: none;

  &:hover {
    background-color: var(--background-hover);
    color: var(--text-hover);
  }

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--background-active);
      color: var(--text-active);

      &:hover {
        background-color: var(--background-active);
      }
    `}
`;

const TextContainer = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

function ProjectTab({ projectIndex }: { projectIndex: ProjectIndex }) {
  const { projectId } = useParams();
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();
  const { updateProjectIndex } = useUpdateProjectIndex();

  const handleDeleteProjectIndex = useCallback(() => {
    updateProjectIndex({
      ...projectIndex,
      isRemoved: true,
    });
  }, [projectIndex, updateProjectIndex]);

  const isActive = projectId === projectIndex._id;

  return (
    <ProjectTabStyled
      $active={isActive}
      onClick={() => navigate(`/${projectIndex._id}`)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <TextContainer>{projectIndex.name}</TextContainer>
      <ButtonIconTertiary
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Menu>
          <Menu.Toggle id="workspace">
            <ButtonIconTertiary>
              {isHover && <IoEllipsisHorizontal size={ICON_FIT} />}
            </ButtonIconTertiary>
          </Menu.Toggle>
          <Menu.ListTabs>
            <Menu.Tab onClick={() => navigate(`/${projectIndex._id}`)}>
              Open project
            </Menu.Tab>
            <Menu.Tab onClick={handleDeleteProjectIndex}>
              Delete project
            </Menu.Tab>
          </Menu.ListTabs>
        </Menu>
      </ButtonIconTertiary>
    </ProjectTabStyled>
  );
}

export default ProjectTab;
