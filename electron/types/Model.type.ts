import { Edge, Node, Position } from "reactflow";

export type Model = {
  _id?: string;
  entities: Node<DataEntity>[];
  relations: Edge<DataRelation>[];
};

export type DataEntity = {
  entityName: string; //Example : Library, Book, BookGenre...
  fields: Field[];
};

export type Field = {
  fieldId?: string; //Example : FIELD_01, FIELD_02 (must be unique)
  name: string; //Example : library_name, city, command_id...
  type: FieldType;
  primaryKey: boolean;
  foreignKey: boolean;
  nullable: boolean;
  unique: boolean;
};

export type DataRelation = {
  relationName: string;
  relationDescriptionVerb: string; //Use a verb, example: To understand, Possess, Execute, Manage, Represent
  type: "one-to-many" | "many-to-many"
  fields: Field[];
  source: {
    parentEntityName: string;
    cardinalitySource: Cardinality;
    positionSource?: Position;
  };
  target: {
    childrenEntityName: string;
    cardinalityTarget: Cardinality;
    positionTarget?: Position;
  };
};

export type FieldType = "string" | "number" | "date" | "double";

export type Cardinality = "0,1" | "1,1" | "0,N";

