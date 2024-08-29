import { Edge } from "reactflow"
import { DataEntity, DataRelation, Field } from "./Model.type"

export type RelationInformations = {
    relation: Edge<DataRelation>,
    parentEntity?: DataEntity,
    parentField?: Field,
    childrenEntity?: DataEntity,
    childrenField?: Field
}