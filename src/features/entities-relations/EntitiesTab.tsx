import { Node } from "reactflow";
import { DataEntity } from "../../../electron/types/Model.type";
import styled, { css } from "styled-components";
import { useSearchParams } from "react-router-dom";

const EntitiesTabStyled = styled.div<{ $active: boolean }>`
  padding: var(--space-2);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-main);
  display: flex;
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

function EntityTab({ entity }: { entity: Node<DataEntity> }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTable = searchParams.get("activeTable");

  return (
    <EntitiesTabStyled
      $active={activeTable === entity.id}
      onClick={() => setSearchParams({ activeTable: entity.id })}
    >
      {entity.data.entityName}
    </EntitiesTabStyled>
  );
}
export default EntityTab;
