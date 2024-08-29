import { Field, FieldType } from "./Model.type";

export type ModelParser = {
  entities: EntityParser[];//Entities of the model
  relations: RelationParser[];//Associations of the model
};

export type EntityParser = {
  entityName: string; //Example : Library, Book...
  fields: Field[];
};

export type FieldRelationParser = {
  name: string; //Example : quantity, date_creation, date_update...
  type: FieldType;
  nullable: boolean;
};

export type RelationParser = {
  relationName: string;
  relationDescriptionVerb: string; //Use a verb, example: Possess, Manage, Represent, Train, Buy, Sell...
  relationType: "one-to-many" | "many-to-many",//the relation contains fields only when it is many-to-many, otherwise it is an empty array.
  relationsFields: FieldRelationParser[] //Association 
  parentEntity: {
    parentEntityName: string;// Name of the entity parent to which the association refers
  };
  childrenEntity: {
    childEntityName: string;// Name of the entity children to which the association refers
    isFkNullable:boolean; //On the children entity, is the foreign key nullable (true when the children not necessarily needf a key)
  };
};


