import * as d3 from "d3";
import { DataEntity } from "../../../electron/types/Model.type";
import { Node as ReactFlowNode, Edge } from "reactflow";

// 1. Initialiser les données
interface Node {
  id: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

export type NodePositions = {
    id: string;
    x: number;
    y: number;
}

export function getPositions(
  nodesFlow: ReactFlowNode<DataEntity>[],
  edges: Edge[],
  tickCount: number = 300
): NodePositions[] {
  const nodes: Node[] = nodesFlow.map((node) => ({
    id: node.id,
    width: node.width ? node.width : 400,
    height: node.height ? node.height : 400,
  }));

  const links: Link[] = edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  }));

  const simulation = d3
    .forceSimulation<Node>(nodes)
    .force(
      'link',
      d3.forceLink<Node, Link>(links)
        .id((d) => d.id)
        .distance(600) // Augmenter la distance pour réduire les croisements
    )
    .force(
      'charge',
      d3.forceManyBody().strength(-200) // Augmenter la force de répulsion
    )
    .force('center', d3.forceCenter(0,0))
    .force(
      'collision',
      d3.forceCollide<Node>()
        .radius((d) => Math.max(d.width, d.height) / 2) // Augmenter la distance minimale
    )
    .alphaDecay(0.02) // Contrôler la vitesse de stabilisation
    .alphaTarget(0) // Arrêter la simulation quand stable
    .stop();

  // Avancer manuellement la simulation pour un certain nombre de ticks
  for (let i = 0; i < tickCount; i++) {
    simulation.tick();
  }

  // Récupérer les positions des nœuds
  return nodes.map(node => ({
    id: node.id,
    x: node.x ? Math.round(node.x / 8) * 8 : 0,
    y: node.y ? Math.round(node.y / 8) * 8 : 0,
  }));
}