import { useParams, useSearchParams } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Background,
  BackgroundVariant,
  EdgeTypes,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  applyEdgeChanges,
  NodePositionChange,
  NodeSelectionChange,
  Edge,
} from "reactflow";
import "reactflow/dist/base.css";
import {
  useGetProjectById,
  useUpdateProjectModel,
  useUpdateProjectLocally,
} from "./ProjectQueries";
import Loader from "../../ui/layout/Loader";
import { EDGES_TYPES, NODES_TYPES } from "./ProjectConstants";
import { useCallback, useEffect, useRef } from "react";
import { getPositions, NodePositions } from "./PositionService";
import { useHandlePosition } from "./useHandlePosition";
import { DataRelation } from "../../../electron/types/Model.type";
import styled from "styled-components";
import { ButtonSecondary } from "../../ui/buttons/ButtonSecondary";
import BottomPannel from "../../ui/layout/BottomPanel";
import EntitiesAndRelations from "../entities-relations/EntitiesAndRelations";
import { IoSaveOutline, IoSearchOutline } from "react-icons/io5";
import { ICON_SIZE_SMALL } from "../../ui/UiConstants";

const defaultViewport = { x: 0, y: 0, zoom: 0.5 };

const ViewportContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--background-main2);
  position: relative;
  .react-flow__node {
    z-index: -1 !important;
  }

  .react-flow__attribution {
    color: white;
  }
`;

const ActionButtonContainer = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  gap: var(--space-2);
`;

function Viewport() {
  const { projectId } = useParams();
  const { project, isLoadingProject } = useGetProjectById(projectId as string);
  const { updateProjectModel } = useUpdateProjectModel();
  const { updateProjectLocally } = useUpdateProjectLocally();
  const { computeHandlePosition } = useHandlePosition();
  const [searchParams, setSearchParams] = useSearchParams();

  const viewportRef = useRef(null);

  const handleNodesChange = useCallback(
    (nodeChanges: NodeChange[]) => {
      let needSave: undefined | boolean = undefined;
      let impactedNodes: string[] = [];
      if (
        (nodeChanges[0] as NodeSelectionChange).selected !== undefined &&
        (nodeChanges[0] as NodeSelectionChange).selected === false
      ) {
        searchParams.delete("activeTable");
        setSearchParams(searchParams);
      }
      if (
        nodeChanges.find(
          (change) => change.type === "position" && change.dragging
        )
      ) {
        needSave = true;
        impactedNodes = (nodeChanges as NodePositionChange[]).map((x) => x.id);
      }
      if (project) {
        const relations: Edge<DataRelation>[] = [];
        if (needSave) {
          const computedRelations = computeHandlePosition(impactedNodes);
          if (computedRelations?.length) {
            relations.push(...computedRelations);
          }
        }

        updateProjectLocally({
          ...project,
          needSave: needSave ? needSave : project.needSave,
          model: {
            ...project.model,
            entities: applyNodeChanges(nodeChanges, project.model.entities),
            relations: relations.length ? relations : project.model.relations,
          },
        });
      }
    },
    [updateProjectLocally, project]
  );

  const handleEdgeChange = useCallback(
    (edgeChanges: EdgeChange[]) => {
      if (project) {
        updateProjectLocally({
          ...project,
          model: {
            ...project.model,
            relations: applyEdgeChanges(edgeChanges, project.model.relations),
          },
        });
      }
    },
    [updateProjectLocally, project]
  );

  if (isLoadingProject) return <Loader />;
  if (!project) return null;

  const { model, needSave } = project;

  /**
   * At start, nodes positions are x=0, y=0
   * Need to find positions to separate the nodes,
   * then on succeed, calc the position right or left for all the handles of the node
   */
  useEffect(() => {
    if (
      model.entities &&
      !model.entities.find(
        (node) => node.position.x != 0 && node.position.y != 0
      )
    ) {
      const positions = getPositions(model.entities, model.relations);
      updateProjectModel({
        id: projectId as string,
        model: {
          ...project.model,
          entities: project.model.entities.map((node) => {
            const pos: NodePositions | undefined = positions.find(
              (pos) => pos.id === node.id
            );
            return {
              ...node,
              position: {
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
              },
            };
          }),
        },
      });
    } else if (
      model &&
      model.relations &&
      !model.relations.find(
        (relation) =>
          relation.data?.source.positionSource ||
          relation.data?.target.positionTarget
      )
    ) {
      const newRelations = computeHandlePosition(
        model.entities.map((entity) => entity.id)
      );

      updateProjectModel({
        id: projectId as string,
        model: {
          ...model,
          relations: newRelations?.length ? newRelations : model.relations,
        },
      });
    }
  }, [model.entities, projectId]);

  return (
    <ViewportContainer ref={viewportRef}>
      <ReactFlow
        nodes={model.entities}
        edges={model.relations}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgeChange}
        nodeTypes={NODES_TYPES}
        edgeTypes={EDGES_TYPES as EdgeTypes}
        snapToGrid={true}
        snapGrid={[8, 8]}
        defaultViewport={defaultViewport}
        minZoom={0.5}
        maxZoom={2}
        fitView
        style={{
          width: "100%",
          height: "100%",
        }}
        panOnScroll
      >
        <>
          <MiniMap
            maskColor="rgba(226, 232, 240, 0.6)"
            offsetScale={10}
            pannable={true}
            inversePan={true}
            position={"bottom-right"}
          />
          <Background
            variant={"dots" as BackgroundVariant}
            gap={8}
            color="var(--stroke-main)"
          />
        </>
      </ReactFlow>
      <ActionButtonContainer>
        <BottomPannel>
          <BottomPannel.PannelButton>
            <ButtonSecondary>
              <IoSearchOutline size={ICON_SIZE_SMALL} /> Entities & relations
              detail
            </ButtonSecondary>
          </BottomPannel.PannelButton>
          <BottomPannel.PannelBody parentElement={viewportRef}>
            <BottomPannel.TabCollapse />
            <EntitiesAndRelations />
          </BottomPannel.PannelBody>
        </BottomPannel>
        <ButtonSecondary
          disabled={!needSave}
          onClick={() =>
            updateProjectModel({ id: project._id, model: project.model })
          }
        >
          <IoSaveOutline size={ICON_SIZE_SMALL} /> Save positions
        </ButtonSecondary>
      </ActionButtonContainer>
    </ViewportContainer>
  );
}

export default Viewport;
