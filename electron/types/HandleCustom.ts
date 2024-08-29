import { Position } from "reactflow";

export type NodeHandles = {
  sourceHandlesList: HandleInfo[];
  targetHandlesList: HandleInfo[];
};


export type HandleInfo = {
    id: string,
    top: string,
    position?: Position;
    cardinality: string | undefined;
}