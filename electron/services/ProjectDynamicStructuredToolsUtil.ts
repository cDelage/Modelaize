import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { EntitySchema, RelationSchema } from "../types/ModelZodParser";
import { ProjectVersionDataPayload } from "../types/Project.type";
import {
  applyNewEntitiesToModel as applyUpdateEntitiesModel,
  entityParserToEntity,
  generateForeignKeys,
  getModelParser,
  mapUpdatedRelation,
  relationsToEdge,
} from "./ModelUtil";
import { ServiceSchema, ServicesSchema } from "../types/ServiceZodParser";
import { Service } from "../types/Services.type";

type AnswerPayload = {
  action: "create" | "update" | "remove";
  fieldToFind: string;
  objectToUpdate: string;
  successObjects?: string[];
  failToFind?: string[];
  searchInto?: string[];
};

const getUpdateAnwser = ({
  action,
  fieldToFind,
  successObjects,
  objectToUpdate,
  failToFind,
  searchInto,
}: AnswerPayload): string => {
  let result = "";
  if (successObjects?.length) {
    result += `
    Success to ${action} ${fieldToFind} : ${successObjects.toString()}
    `;
  }
  if (failToFind && failToFind.length) {
    result += `
    Fail to find ${fieldToFind} of ${objectToUpdate} : ${failToFind.toString()}
    `;
    if (searchInto && searchInto.length) {
      result += `
      Select ${fieldToFind} into : ${searchInto.toString()}
      `;
    }
  }

  return result ? result : "No actions performeds.";
};

export const getUpdateExistingEntities = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "update-entities-fields",
    description: "Update entities",
    schema: z.object({
      updatedEntities: z
        .array(
          z.object({
            entityName: z
              .string()
              .describe("Existing entityName of the entity."),
            entityNewValues: EntitySchema,
          })
        )
        .describe("Entities with the updated values"),
    }),
    func: async ({ updatedEntities }) => {
      const searchInto = projectVersion.model.entities.map(
        (entity) => entity.data.entityName
      );
      const successObjects = updatedEntities
        .filter((entityToUpdate) =>
          searchInto.includes(entityToUpdate.entityName)
        )
        .map((entity) => entity.entityName);

      const failToFind = updatedEntities
        .filter(
          (entityToUpdate) => !searchInto.includes(entityToUpdate.entityName)
        )
        .map((entity) => entity.entityName);

      if (successObjects.length) {
        projectVersion.isUpdated = true;
      }

      projectVersion.model = {
        ...projectVersion.model,
        entities: applyUpdateEntitiesModel(
          projectVersion.model.entities,
          updatedEntities.map((entity) => entity.entityNewValues),
          false
        ),
      };
      return getUpdateAnwser({
        action: "update",
        fieldToFind: "entityName",
        objectToUpdate: "entity",
        successObjects,
        failToFind,
        searchInto : searchInto as string[],
      });
    },
  });
};

export const getCreateNewEntities = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "create-entities",
    description: "Create new entities",
    schema: z.object({
      newEntities: z.array(EntitySchema).describe("New entities"),
    }),
    func: async ({ newEntities }) => {
      projectVersion.model = {
        ...projectVersion.model,
        entities: [
          ...projectVersion.model.entities,
          ...newEntities.map(entityParserToEntity),
        ],
      };

      projectVersion.isUpdated = true;

      return getUpdateAnwser({
        action: "create",
        fieldToFind: "entityName",
        objectToUpdate: "entities",
        successObjects: newEntities.map((entity) => entity.entityName),
      });
    },
  });
};

export const getRemoveEntity = (projectVersion: ProjectVersionDataPayload) => {
  return new DynamicStructuredTool({
    name: "remove-entities",
    description: "Remove entities by using their entityName",
    schema: z.object({
      removedEntities: z
        .array(z.string().describe("entityName of the removed entity"))
        .describe("Removed entities name"),
    }),
    func: async ({ removedEntities }) => {
      const searchInto = projectVersion.model.entities.map(
        (entity) => entity.data.entityName
      );
      const successObjects = removedEntities.filter((entityToRemove) =>
        searchInto.includes(entityToRemove)
      );
      const failToFind = removedEntities.filter(
        (entityToRemove) => !searchInto.includes(entityToRemove)
      );

      projectVersion.model = {
        ...projectVersion.model,
        entities: projectVersion.model.entities.filter(
          (entity) => !removedEntities.includes(entity.data.entityName)
        ),
      };

      if (successObjects.length) {
        projectVersion.isUpdated = true;
      }

      return getUpdateAnwser({
        action: "remove",
        fieldToFind: "entityName",
        objectToUpdate: "entities",
        successObjects,
        failToFind,
        searchInto : searchInto as string[],
      });
    },
  });
};

export const getCreateNewRelations = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "create-new-relationship",
    description: "Create new relationship between entities of the model",
    schema: z.object({
      relations: z.array(RelationSchema),
    }),
    func: async ({ relations }) => {
      const modelParser = getModelParser(projectVersion.model);
      const modelParserWithKeys = generateForeignKeys(modelParser, relations);

      projectVersion.model.entities = applyUpdateEntitiesModel(
        projectVersion.model.entities,
        modelParserWithKeys.entities,
        true
      );

      projectVersion.model.relations = [
        ...projectVersion.model.relations,
        ...relationsToEdge(relations, projectVersion.model.entities),
      ];

      projectVersion.isUpdated = true;

      return getUpdateAnwser({
        action: "create",
        fieldToFind: "relationName",
        objectToUpdate: "relations",
        successObjects: relations.map((relation) => relation.relationName),
      });
    },
  });
};

export const getUpdateRelations = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "update-relationship-fields",
    description: "Update fields of existing relationship.",
    schema: z.object({
      updatedRelations: z.array(
        z.object({
          relationName: z
            .string()
            .describe("relationName of existing relation"),
          relation: RelationSchema.describe("New values of relations"),
        })
      ),
    }),
    func: async ({ updatedRelations }) => {
      const searchInto = projectVersion.model.relations
        .map((relation) => relation.data?.relationName)
        .filter((relation) => relation != undefined);

      const successObjects = updatedRelations
        .filter((relationToUpdate) =>
          searchInto.includes(relationToUpdate.relationName)
        )
        .map((relation) => relation.relationName);

      const failToFind = updatedRelations
        .filter(
          (relationToUpdate) =>
            !searchInto.includes(relationToUpdate.relationName)
        )
        .map((relation) => relation.relationName);

      projectVersion.model.relations = projectVersion.model.relations.map(
        (relation) => mapUpdatedRelation(relation, updatedRelations)
      );

      if (successObjects.length) {
        projectVersion.isUpdated = true;
      }

      return getUpdateAnwser({
        action: "update",
        fieldToFind: "relationName",
        objectToUpdate: "relations",
        successObjects,
        failToFind,
        searchInto : searchInto as string[],
      });
    },
  });
};

export const getRemoveRelation = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "remove-relations",
    description: "Remove existing relations by relationName",
    schema: z.object({
      relationNames: z
        .array(z.string())
        .describe("relationName of relations to remove."),
    }),
    func: async ({ relationNames }) => {
      const searchInto = projectVersion.model.relations
        .map((relation) => relation.data?.relationName)
        .filter((relation) => relation != undefined);
      const successObjects = relationNames.filter((relationToDelete) =>
        searchInto.includes(relationToDelete)
      );
      const failToFind = relationNames.filter(
        (relationToUpdate) => !searchInto.includes(relationToUpdate)
      );

      projectVersion.model.relations = projectVersion.model.relations.filter(
        (relation) => {
          if (!relation.data) return true;
          return !relationNames.includes(relation.data.relationName);
        }
      );

      if (successObjects.length) {
        projectVersion.isUpdated = true;
      }

      return getUpdateAnwser({
        action: "remove",
        fieldToFind: "relationName",
        objectToUpdate: "relations",
        successObjects,
        failToFind,
        searchInto : searchInto as string[],
      });
    },
  });
};

export const getCreateNewServices = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "create-services",
    description: "Create new services",
    schema: z.object({ services: ServicesSchema }),
    func: async ({ services }) => {
      projectVersion.services = [...projectVersion.services, ...services];
      projectVersion.isUpdated = true;
      return getUpdateAnwser({
        action: "create",
        fieldToFind: "serviceName",
        objectToUpdate: "services",
        successObjects: services.map((service) => service.serviceName),
      });
    },
  });
};

export const getRemoveServices = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "remove-services",
    description: "Remove services by serviceName",
    schema: z.object({
      servicesToRemove: z
        .array(z.string())
        .describe("serviceName of services to remove"),
    }),
    func: async ({ servicesToRemove }) => {
      const searchInto = projectVersion.services.map(
        (service) => service.serviceName
      );
      const successObjects = servicesToRemove.filter((service) =>
        searchInto.includes(service)
      );
      const failToFind = servicesToRemove.filter(
        (service) => !searchInto.includes(service)
      );
      projectVersion.services = projectVersion.services.filter(
        (service) => !servicesToRemove.includes(service.serviceName)
      );
      projectVersion.isUpdated = true;
      return getUpdateAnwser({
        action: "remove",
        fieldToFind: "serviceName",
        objectToUpdate: "services",
        successObjects,
        failToFind,
        searchInto : searchInto as string[],
      });
    },
  });
};

export const getUpdateServices = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "update-services",
    description: "Update existing services by serviceName",
    schema: z.object({
      updatedServices: z.array(
        z.object({
          serviceName: z.string().describe("existing serviceName"),
          serviceUpdated: ServiceSchema.describe("New values of service"),
        })
      ),
    }),
    func: async ({ updatedServices }) => {
      const searchInto = projectVersion.services.map(
        (service) => service.serviceName
      );
      const successObjects = updatedServices
        .filter((service) => searchInto.includes(service.serviceName))
        .map((service) => service.serviceName);
      const failToFind = updatedServices
        .filter((service) => !searchInto.includes(service.serviceName))
        .map((service) => service.serviceName);

      projectVersion.services = projectVersion.services.map((service) => {
        const newService = updatedServices.find(
          (updatedService) => updatedService.serviceName === service.serviceName
        )?.serviceUpdated;
        return newService ? (newService as Service) : service;
      });
      projectVersion.isUpdated = true;
      return getUpdateAnwser({
        action: "update",
        fieldToFind: "serviceName",
        objectToUpdate: "services",
        successObjects,
        failToFind,
        searchInto : searchInto as string[],
      });
    },
  });
};

export const getFindRelationsBetweenEntities = (
  projectVersion: ProjectVersionDataPayload
) => {
  return new DynamicStructuredTool({
    name: "find-relation-between-entities",
    description: "Find an array of relationName between 2 entities",
    schema: z.object({
      entity1: z.string().describe(""),
      entity2: z.string().describe(""),
    }),
    func: async ({ entity1, entity2 }) => {
      return (
        "relationName between entities : " +
        projectVersion.model.relations
          .filter(
            (relation) =>
              (relation.data?.target.childrenEntityName.toLowerCase() ===
                entity1.toLowerCase() &&
                relation.data?.source.parentEntityName.toLowerCase() ===
                  entity2.toLowerCase()) ||
              (relation.data?.target.childrenEntityName.toLowerCase() ===
                entity2.toLowerCase() &&
                relation.data?.source.parentEntityName.toLowerCase() ===
                  entity1.toLowerCase())
          )
          .map((relation) => relation.data?.relationName)
          .toString()
      );
    },
  });
};
