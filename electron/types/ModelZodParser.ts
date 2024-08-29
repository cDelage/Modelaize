import { z } from "zod";

const FieldType = z.enum(["string", "number", "date", "double"]);

const FieldSchema = z.object({
  name: z.string().describe("Example : pk_book, library_name..."), // Example : pk_book, library_name...
  type: FieldType,
  primaryKey: z.boolean(),
  foreignKey: z.boolean(),
  nullable: z.boolean(),
  unique: z.boolean(),
});

const FieldRelationSchema = z.object({
  name: z.string().describe("Example : quantity..."), // Example : pk_book, library_name...
  type: FieldType,
  nullable: z
    .boolean()
    .describe("true if the object can be null. Primary key can't be null."),
});

const EntitySchema = z.object({
  entityName: z.string().describe("Example : Library, Book..."),
  fields: z.array(FieldSchema),
});

const RelationSchema = z.object({
  relationName: z.string().describe("Unique name of relation, example: BOOK_LIBRARY_BELONGS_1"),
  relationDescriptionVerb: z
    .string()
    .describe(
      "Use a single verb, example: Possess, Represent, Sell..."
    ),
  relationType: z
    .enum(["one-to-many", "many-to-many"])
    .describe("one-to-many or many-to-many"),
  relationsFields: z
    .array(FieldRelationSchema)
    .describe(
      "the relation contains fields only when it is many-to-many, otherwise it is an empty array."
    ),
  parentEntity: z.object({
    parentEntityName: z
      .string()
      .describe("Name of the entity parent to which the association refers"),
  }),
  childrenEntity: z.object({
    childEntityName: z
      .string()
      .describe("Name of the entity children to which the association refers"),
    isFkNullable: z
      .boolean()
      .describe(
        "On the children entity, is the foreign key nullable ?"
      ),
  }),
});

const ModelSchema = z.object({
  entities: z.array(EntitySchema).describe("Entities of the model"),
  relations: z.array(RelationSchema).describe("Associations of the model"),
});

export { ModelSchema, EntitySchema, RelationSchema };
