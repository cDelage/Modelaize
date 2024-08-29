import styled, { CSSProperties } from "styled-components";
import { DataRelation } from "../../../electron/types/Model.type";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Position,
} from "reactflow";
import { Column } from "../../ui/layout/Flexbox";

const Label = styled.div<{ $labelX: number; $labelY: number }>`
  position: absolute;
  transform: ${(props) =>
    `translate(-50%, -50%) translate(${props.$labelX}px,${props.$labelY}px)`};
  background: var(--background-main);
  border-radius: var(--radius-large);
  color: var(--text-light);
  min-width: 100px;
  border: 1px solid var(--stroke-main);
  display: flex;
  flex-direction: column;
`;

const LabelHeader = styled.div`
  color: var(--text-main);
  font-weight: var(--font-weight-bold);
  width: 100%;
  border-bottom: 1px solid var(--stroke-main);
  padding: var(--space-3);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`;

function EdgeRelation({
  sourceX,
  sourceY,
  targetX,
  targetY,
  id,
  sourcePosition,
  targetPosition,
  data: { relationDescriptionVerb: relationDescription, fields },
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  selected: boolean;
  id: string;
  markerEnd: string | undefined;
  sourcePosition: Position;
  targetPosition: Position;
  source: string;
  sourceHandleId: string;
  target: string;
  targetHandleId: string;
  style: CSSProperties;
  data: DataRelation;
}) {
  const edgeParams = {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  };

  const [edgePath, labelX, labelY] = getSmoothStepPath(edgeParams);

  return (
    <>
      <BaseEdge
        path={edgePath}
        id={id}
        style={{
          strokeWidth: 1,
          stroke: "black",
        }}
      ></BaseEdge>
      <EdgeLabelRenderer>
        <Label $labelX={labelX} $labelY={labelY} className="nodrag nopan">
          <LabelHeader>{relationDescription}</LabelHeader>
          <Column $padding="var(--space-3)">
            {fields.map((field) => (
              <div id={field.fieldId}>{field.name}</div>
            ))}
          </Column>
        </Label>
      </EdgeLabelRenderer>
    </>
  );
}

export default EdgeRelation;
