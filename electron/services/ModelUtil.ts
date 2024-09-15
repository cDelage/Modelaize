import { Edge, Node } from "reactflow";
import {
  EntityParser,
  ModelParser,
  RelationParser,
} from "../types/ModelParser";
import { generateUUID } from "./generateUUIDService";
import {
  Cardinality,
  DataEntity,
  DataRelation,
  Field,
  Model,
} from "../types/Model.type";

export const entityParserToEntity = (
  entity: EntityParser
): Node<DataEntity> => {
  return {
    id: generateUUID(),
    type: "entity",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      entityName: entity.entityName,
      fields: entity.fields.map((field) => {
        return {
          ...field,
          fieldId: generateUUID(),
        };
      }),
    },
  } as Node<DataEntity>;
};

export const relationsToEdge = (
  relations: RelationParser[],
  entities: Node<DataEntity>[]
): Edge<DataRelation>[] => {
  return relations
    .map((relation) => {
      const source = entities.find(
        (entity) =>
          entity.data.entityName === relation.parentEntity.parentEntityName
      );
      const target = entities.find(
        (entity) =>
          entity.data.entityName === relation.childrenEntity.childEntityName
      );
      const sourceHandle = source?.data.fields.find(
        (field) => field.primaryKey
      );
      const targetHandle =
        relation.relationType === "one-to-many"
          ? target?.data.fields.find(
              (field) => field.name === getForeignKeyName(relation)
            )
          : target?.data.fields.find((field) => field.primaryKey);

      if (source && target && sourceHandle && targetHandle) {
        const uuid = generateUUID();
        return {
          id: uuid,
          type: "relation",
          source: source.id,
          target: target.id,
          sourceHandle: `${sourceHandle.fieldId}-${uuid}`,
          targetHandle: targetHandle.fieldId,
          data: {
            relationName: relation.relationName,
            relationDescriptionVerb: relation.relationDescriptionVerb,
            fields: relation.relationsFields.map((field) => {
              return {
                ...field,
                fieldId: generateUUID(),
                primaryKey: false,
                unique: false,
              } as Field;
            }),
            type: relation.relationType,
            source: {
              cardinalitySource: "0,N",
              parentEntityName: relation.parentEntity.parentEntityName,
            },
            target: {
              cardinalityTarget: getCardinalityTarget(relation),
              childrenEntityName: relation.childrenEntity.childEntityName,
            },
          },
        } as Edge<DataRelation>;
      }
      return undefined;
    })
    .filter((relation) => relation !== undefined) as Edge<DataRelation>[];
};

export const getCardinalityTarget = (relation: RelationParser): Cardinality => {
  if (relation.relationType === "one-to-many") {
    return relation.childrenEntity.isFkNullable ? "0,1" : "1,1";
  }
  return "0,N";
};

export const generateForeignKeys = (
  modelToParse: ModelParser,
  relations: RelationParser[]
): ModelParser => {
  return {
    ...modelToParse,
    entities: modelToParse.entities.map((entity) => {
      const foreignKeys = relations.filter(
        (relation) =>
          relation.childrenEntity.childEntityName === entity.entityName &&
          relation.relationType === "one-to-many"
      );
      const fields = foreignKeys.map((relation) => {
        return {
          fieldId: generateUUID(),
          name: getForeignKeyName(relation),
          nullable: false,
          primaryKey: false,
          foreignKey: true,
          type: "number",
          unique: false,
        } as Field;
      });
      return {
        ...entity,
        fields: [...entity.fields, ...fields],
      } as EntityParser;
    }),
  };
};

export function getForeignKeyName(relation: RelationParser): string {
  return `fk_${relation.parentEntity.parentEntityName.toLowerCase()}_${relation.relationDescriptionVerb.toLowerCase()}`;
}

export function applyNewEntitiesToModel(
  exitingEntities: Node<DataEntity>[],
  updatedEntities: EntityParser[],
  isCreatingFk: boolean
): Node<DataEntity>[] {
  return exitingEntities.map((existingEntity) => {
    const newEntity = updatedEntities.find(
      (entity) => entity.entityName === existingEntity.data.entityName
    );

    if (!newEntity) {
      return existingEntity;
    } else {
      const existingFieldsName = existingEntity.data.fields.map(
        (field) => field.name
      );
      //Remove field foreign key, it will be added with relations.
      newEntity.fields = newEntity.fields.filter(
        (field) =>
          isCreatingFk ||
          !field.foreignKey ||
          existingFieldsName.includes(field.name)
      );
      return {
        ...existingEntity,
        data: {
          ...existingEntity.data,
          entityName: newEntity.entityName,
          fields: newEntity.fields.map((field) => {
            const existingField = existingEntity.data.fields.find(
              (existingField) => existingField.name === field.name
            );
            return {
              ...field,
              fieldId: existingField ? existingField.fieldId : generateUUID(),
            };
          }),
        },
      } as Node<DataEntity>;
    }
  });
}

export function getModelParser(model: Model): ModelParser {
  return {
    entities: model.entities.map((entity) => {
      return {
        entityName: entity.data.entityName,
        fields: entity.data.fields.map((field) => {
          return {
            ...field,
            fieldId: undefined,
          };
        }),
      };
    }),
    relations: model.relations
      .map(edgeToRelationParser)
      .filter((x) => x != undefined),
  } as ModelParser;
}
export const mapUpdatedRelation = (
  relation: Edge<DataRelation>,
  updatedRelations: { relationName: string; relation: RelationParser }[]
) => {
  const updatedRelation = updatedRelations.find(
    (updatedRelation) =>
      updatedRelation.relationName === relation.data?.relationName
  )?.relation;

  if (!updatedRelation || !relation.data) {
    return relation;
  }
  return {
    ...relation,
    data: {
      ...relation.data,
      relationDescriptionVerb: updatedRelation.relationDescriptionVerb,
      fields: updatedRelation.relationsFields,
      target: {
        ...relation.data.target,
        cardinalityTarget: getCardinalityTarget(updatedRelation),
      },
    },
  } as Edge<DataRelation>;
};

export const filterUnusedForeignKeysAndRelations = (model: Model): Model => {
  //Filter unusable FK
  const modelWithFields = {
    ...model,
    entities: model.entities.map((entity) => {
      return {
        ...entity,
        data: {
          ...entity.data,
          fields: entity.data.fields.filter((field) => {
            return !field.foreignKey ||
              model.relations.find(
                (relation) =>
                  relation.targetHandle?.startsWith(field.fieldId as string) ||
                  relation.sourceHandle?.startsWith(field.fieldId as string)
              );
          }),
        },
      };
    }),
  } as Model;

  //Filter unusable relations
  return {
    ...modelWithFields,
    relations: model.relations.filter((relation) => {
      const { entities } = model;
      const source = entities.find(
        (entity) =>
          entity.data.entityName === relation.data?.source.parentEntityName
      );
      const target = entities.find(
        (entity) =>
          entity.data.entityName === relation.data?.target.childrenEntityName
      );
      const sourceHandle = source?.data.fields.find(
        (field) => field.primaryKey
      );

      const relationParser = edgeToRelationParser(relation);
      const targetHandle =
        relation.data?.type === "one-to-many"
          ? target?.data.fields.find(
              (field) =>
                field.name ===
                getForeignKeyName(relationParser as RelationParser)
            )
          : target?.data.fields.find((field) => field.primaryKey);

      return source && sourceHandle && target && targetHandle;
    }),
  };
};

export const edgeToRelationParser = (
  relation: Edge<DataRelation>
): RelationParser | undefined => {
  if (!relation.data) return undefined;
  const {
    data: {
      relationName,
      relationDescriptionVerb,
      fields,
      source,
      target,
      type,
    },
  } = relation;
  return {
    relationName,
    relationDescriptionVerb,
    relationsFields: fields,
    relationType: type,
    childrenEntity: {
      childEntityName: target.childrenEntityName,
      isFkNullable: target.cardinalityTarget.startsWith("0"),
    },
    parentEntity: {
      parentEntityName: source.parentEntityName,
    },
  } as RelationParser;
};
