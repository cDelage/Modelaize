import { RunnableLike } from "@langchain/core/runnables";
import { ApplicationDescriptionSheet } from "../types/ApplicationDescriptionSheet.type";
import { getLlmOpenAI } from "./LLMService";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { Service } from "../types/Services.type";
import { ServicesSchema } from "../types/ServiceZodParser";
import { applicationDescriptionToString } from "../utils/StringifyApplicationDescription";
import { Model } from "../types/Model.type";
import { getEntitiesList } from "../utils/GetEntitiesList";

export async function generateServices(
  prompt: string,
  applicationDescription: ApplicationDescriptionSheet,
  model: Model
): Promise<Service[]> {
  const llmModel =  await getLlmOpenAI(0.7);;
  return (await promptGenerateServices({
    llmModel,
    prompt,
    model,
    applicationDescription,
  })) as Service[];
}

async function promptGenerateServices({
  llmModel,
  prompt,
  applicationDescription,
  model,
}: {
  llmModel: RunnableLike<any, any>;
  prompt: string;
  applicationDescription: ApplicationDescriptionSheet;
  model: Model;
}) {
  const promptTemplate = ChatPromptTemplate.fromTemplate(`
      System : You are an experienced business application designer for 20 years. 
      Generate a list of services based on the user input and the description of application.
      User : {input} 
      Detailed description: {detailed_description}
      Entities list: {entities}
      Follow this rules :
      1. Each feature must have its service(s).
      2. Create business rules into services (examples : Once action complete, an email is send to the user, The user have access only to the book related to his library...).
      3. Get methods take list of inputs with generic objects (string or number) and return an entity.
      4. Post, Put and Patch methods take an entity as input and return a string identifier.
      5. Each relevant entity used by a feature must have get, post, put, findByCriteria endpoints.

      Format instructions: {format_instructions}
    `);

  const parser = StructuredOutputParser.fromZodSchema(ServicesSchema);

  const chain = promptTemplate.pipe(llmModel).pipe(parser);

  const detailedDescription = applicationDescriptionToString(
    applicationDescription
  );

  const entities = getEntitiesList(model);

  return await chain.invoke({
    format_instructions: parser.getFormatInstructions(),
    input: prompt,
    detailed_description: detailedDescription,
    entities: entities.toString(),
  });
}
