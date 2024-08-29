import { useCallback } from "react";
import { Edge, Node, Position } from "reactflow";
import { useGetProjectById, useUpdateProjectLocally } from "./ProjectQueries";
import { useParams } from "react-router-dom";
import { DataRelation } from "../../../electron/types/Model.type";

const getRelationHandlePosition = (nodeA: Node, nodeB: Node): Position => {
  return nodeA.position.x < nodeB.position.x &&
    nodeA.position.x < nodeB.position.x + (nodeB.width ? nodeB.width : 0) &&
    nodeB.position.x > nodeA.position.x + (nodeA.width ? nodeA.width : 0)
    ? Position.Right
    : Position.Left;
};

export function useHandlePosition() {
  const { projectId } = useParams();
  const { project } = useGetProjectById(projectId as string);
  const { updateProjectLocally } = useUpdateProjectLocally();
  const computeHandlePosition = useCallback(
    (targetId: string[]) => {
      if (project) {
        const relations = project.model.relations.map((relation) => {
          if (
            targetId.includes(relation.source) ||
            targetId.includes(relation.target)
          ) {
            const sourceEntity = project.model.entities.find(
              (entity) => entity.id === relation.source
            );
            const targetEntity = project.model.entities.find(
              (entity) => entity.id === relation.target
            );

            if (sourceEntity && targetEntity) {
              return {
                ...relation,
                data: {
                  ...relation.data,
                  source: {
                    ...relation.data?.source,
                    positionSource: getRelationHandlePosition(
                      sourceEntity,
                      targetEntity
                    ),
                  },
                  target: {
                    ...relation.data?.target,
                    positionTarget: getRelationHandlePosition(
                      targetEntity,
                      sourceEntity
                    ),
                  },
                },
              } as Edge<DataRelation>;
            }
          }
          return relation;
        });

        return relations;
      }
    },
    [project, updateProjectLocally]
  );

  return { computeHandlePosition };
}
