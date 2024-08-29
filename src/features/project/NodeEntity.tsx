import styled, { css } from "styled-components";
import { DataEntity } from "../../../electron/types/Model.type";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { Column } from "../../ui/layout/Flexbox";
import { IoKey } from "react-icons/io5";
import { useGetProjectById } from "./ProjectQueries";
import { useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { HandleInfo, NodeHandles } from "../../../electron/types/HandleCustom";

const TableContainer = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: fit-content;
  min-width: 200px;
  box-sizing: border-box;
  background-color: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-solid);

  ${(props) =>
    props.$active &&
    css`
      border: 2px solid var(--stroke-active-dark);
    `}
`;

const TableTitle = styled.div`
  padding: var(--space-2);
  background-color: var(--background-main2);
  color: var(--text-dark);
  border-bottom: 1px solid var(--stroke-main);
`;

const Field = styled.div<{ $primary: boolean }>`
  padding: var(--space-2) var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) =>
    props.$primary &&
    css`
      font-weight: var(--font-weight-bold);
    `}
`;

const CustomHandle = styled(Handle)<{
  position: Position;
  type: "source" | "target";
}>`
  background-color: var(--background-main);
  color: var(--text-light);
  padding: var(--space-1);
  border: 1px solid var(--stroke-main);
  border-radius: var(--radius);
  box-sizing: border-box;
  ${(props) =>
    props.position === "left"
      ? css`
          transform: translate(-100%, -50%);
        `
      : css`
          transform: translate(100%, -50%);
        `};
`;

function NodeEntity({
  data,
  id,
}: {
  data: DataEntity;
  selected: boolean;
  id: string;
}) {
  const { fields, entityName } = data;
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { project } = useGetProjectById(projectId as string);
  const tableHeaderRef = useRef<HTMLDivElement>(null);
  const fieldsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const updateNodeInternals = useUpdateNodeInternals();
  const activeTable = searchParams.get("activeTable");

  const isForeignKey = useCallback(
    (fieldId: string): boolean => {
      if (project) {
        return (
          project.model.relations.find(
            (relation) =>
              relation.target === id && relation.targetHandle === fieldId
          ) !== undefined
        );
      }
      return false;
    },
    [project, id]
  );

  const getHandleTopPosition = useCallback(
    (handle: string): string => {
      if (tableHeaderRef.current && fieldsRefs.current[0]) {
        const headerSize = tableHeaderRef.current.offsetHeight;
        const fieldSize = fieldsRefs.current[0].offsetHeight;
        const index =
          fields.findIndex((field) => handle.startsWith(field.fieldId)) + 0.5;
        return `${fieldSize * index + headerSize}px`;
      }
      return "50%";
    },
    [tableHeaderRef.current, fieldsRefs.current, fields]
  );

  const { sourceHandlesList, targetHandlesList } = useMemo((): NodeHandles => {
    if (project) {
      const sourceHandlesList: HandleInfo[] = project.model.relations
        .filter((relation) => relation.source === id && relation.sourceHandle)
        .map((relation) => {
          return {
            id: relation.sourceHandle as string,
            top: getHandleTopPosition(relation.sourceHandle as string),
            position: relation.data?.source.positionSource,
            cardinality: relation.data?.source.cardinalitySource,
          };
        });
      const targetHandlesList: HandleInfo[] = project.model.relations
        .filter((relation) => relation.target === id && relation.targetHandle)
        .map((relation) => {
          return {
            id: relation.targetHandle as string,
            top: getHandleTopPosition(relation.targetHandle as string),
            position: relation.data?.target.positionTarget,
            cardinality: relation.data?.target.cardinalityTarget,
          };
        });

      return { sourceHandlesList, targetHandlesList };
    }

    return {
      sourceHandlesList: [],
      targetHandlesList: [],
    };
  }, [project?.model.relations, getHandleTopPosition]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [sourceHandlesList, targetHandlesList, updateNodeInternals, id]);

  return (
    <TableContainer
      $active={activeTable === id}
      onClick={() => setSearchParams({ activeTable: id })}
    >
      <TableTitle ref={tableHeaderRef}>{entityName}</TableTitle>
      <Column>
        {fields.map((field, index) => (
          <Field
            $primary={field.primaryKey}
            key={field.fieldId}
            ref={(el) => (fieldsRefs.current[index] = el)}
          >
            <div>{field.name}</div>
            <div>
              {field.primaryKey && <IoKey color="var(--color-secondary-500)" />}
              {!field.primaryKey && isForeignKey(field.fieldId) && (
                <IoKey color="var(--color-gray-500)" />
              )}
            </div>
          </Field>
        ))}
      </Column>
      {sourceHandlesList.map(({ id, top, position, cardinality }, index) => (
        <CustomHandle
          type="source"
          key={`${id}${index}`}
          position={position ? position : Position.Left}
          id={id}
          isConnectable={true}
          style={{ top }}
        >
          {cardinality}
        </CustomHandle>
      ))}
      {targetHandlesList.map(({ id, top, position, cardinality }, index) => (
        <CustomHandle
          type="target"
          key={`${id}${index}`}
          position={position ? position : Position.Right}
          id={id}
          isConnectable={true}
          style={{ top }}
        >
          {cardinality}
        </CustomHandle>
      ))}
    </TableContainer>
  );
}

export default NodeEntity;
