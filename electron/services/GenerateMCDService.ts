import { DataEntity, DataRelation, Model } from "../types/Model.type";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableLike } from "@langchain/core/runnables";
import { ModelParser } from "../types/ModelParser";
import { generateUUID } from "./generateUUIDService";
import { Edge, Node } from "reactflow";
import { getLlmOpenAI } from "./LLMService";
import { ModelSchema } from "../types/ModelZodParser";
import { ApplicationDescriptionSheet } from "../types/ApplicationDescriptionSheet.type";
import { applicationDescriptionToString } from "../utils/StringifyApplicationDescription";
import { CreateProjectPayload } from "../types/Project.type";
import {
  entityParserToEntity,
  filterUnusedForeignKeysAndRelations,
  generateForeignKeys,
  relationsToEdge,
} from "./ModelUtil";

export async function generateMCD({
  prompt,
  applicationDescription,
}: CreateProjectPayload): Promise<Model> {
  const llmModel = await getLlmOpenAI(0.7);

  const modelToParse = (await promptGenerateMCD({
    model: llmModel,
    prompt,
    applicationDescription,
  })) as ModelParser;

  const model = parseModel(modelToParse);
  const modelClean = filterUnusedForeignKeysAndRelations(model);

  return modelClean;
}

async function promptGenerateMCD({
  model,
  prompt,
  applicationDescription,
}: {
  model: RunnableLike<any, any>;
  prompt: string;
  applicationDescription: ApplicationDescriptionSheet;
}) {
  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    System : You are an experienced business application designer. 
    Generate a conceptual data model statement based on the user input and the detailed description.

    User : {input}  
    Detailed description: {detailed_description}

    Follow this rules:
    1. Follows the rules of the Merise method and normal database forms.
    2. Entity has a primary key formatted like : pk_entity, pk_book.
    3. Each entities and many-to-many relations must have fields date_creation and date_update.
    4. All entities must have relations, and must be linked together in several relationships.
    5. Generates as many entities as necessary to implement all the features and actors.
    
    Format instructions: {format_instructions}
  `);

  const parser = StructuredOutputParser.fromZodSchema(ModelSchema);

  const chain = promptTemplate.pipe(model).pipe(parser);

  const detailedDescription = applicationDescriptionToString(
    applicationDescription
  );
  return await chain.invoke({
    format_instructions: parser.getFormatInstructions(),
    input: prompt,
    detailed_description: detailedDescription,
  });
}

function parseModel(modelToParse: ModelParser): Model {
  //1- Generate foreign keys with associations
  const modelParserWithFk = generateForeignKeys(
    modelToParse,
    modelToParse.relations
  );
  const entities: Node<DataEntity>[] =
    modelParserWithFk.entities.map(entityParserToEntity);
  const relations: Edge<DataRelation>[] = relationsToEdge(
    modelToParse.relations,
    entities
  );

  return {
    _id: generateUUID(),
    entities: entities,
    relations,
  } as Model;
}
