import { Model } from "../types/Model.type";

export function getEntitiesList(model : Model) : String[] {
    return model.entities.map(entity => entity.data.entityName);
}
