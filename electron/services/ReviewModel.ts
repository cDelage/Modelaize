import {
  ProjectVersionData,
  ProjectVersionDataPayload,
} from "../types/Project.type";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { getSettings } from "./SettingsService";
import { ChatOpenAI } from "@langchain/openai";
import { ApplicationDescriptionSheet } from "../types/ApplicationDescriptionSheet.type";
import { getCreateNewEntities, getCreateNewRelations, getCreateNewServices, getRemoveEntity, getRemoveRelation, getRemoveServices, getUpdateExistingEntities, getUpdateRelations, getUpdateServices } from "./ProjectDynamicStructuredToolsUtil";
import { getModelParser } from "./ModelUtil";

export async function reviewNewModel({
  input, newProjectVersion, applicationDescriptionSheet
}: {input: string, newProjectVersion : ProjectVersionDataPayload, applicationDescriptionSheet: ApplicationDescriptionSheet}) {

  if (newProjectVersion && newProjectVersion.model) {
    console.log(`
      ${JSON.stringify(newProjectVersion.model.relations)}

      ----------------------------------------
    `)
    const updateExistingEntities = getUpdateExistingEntities(newProjectVersion);
    const createNewEntities = getCreateNewEntities(newProjectVersion);
    const removeEntity = getRemoveEntity(newProjectVersion);
    const addNewRelation = getCreateNewRelations(newProjectVersion);
    const updateRelation = getUpdateRelations(newProjectVersion);
    const removeRelations = getRemoveRelation(newProjectVersion);
    const createServices = getCreateNewServices(newProjectVersion);
    const removeServices = getRemoveServices(newProjectVersion);
    const updateServices = getUpdateServices(newProjectVersion);
    const tools = [
      createNewEntities,
      updateExistingEntities,
      removeEntity,
      addNewRelation,
      updateRelation,
      removeRelations,
      createServices,
      updateServices,
      removeServices,
    ];

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant."],
      ["placeholder", "{chat_history}"],
      [
        "system",
        `
        User prompt : {input}
        Application description sheet : {application_desc}
        Generated data model : {model},
        Generated services : {services}, 
        Your job is to evaluate if the model and services respect the requirements of Application description sheet and input, and finds prospects for improvement.
        
        Improve the model and services by:
        1. Categorize objects when possible (example User & UserRole or Book & BookGenre).
        2. Services and entities are compatible between them, and allow to do all features.
        3. All entities must be linked together in several relationships.
      
        Final answer: A short sentence to explain that the project have been generated correctly.
        `,
      ],
      ["placeholder", "{agent_scratchpad}"],
    ]);
    const { token } = await getSettings();

    const llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.3,
      apiKey: token,
    });
    const agent = await createOpenAIFunctionsAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
    });

    const result = await agentExecutor.invoke({
      input,
      model: JSON.stringify(getModelParser(newProjectVersion.model)),
      services: JSON.stringify(newProjectVersion.services),
      application_desc: JSON.stringify(applicationDescriptionSheet)
    });

    const agentLogs = result.output;

    return {
      projectVersionData: {
        model:  newProjectVersion.model,
        dateCreation: newProjectVersion.dateCreation,
        services: newProjectVersion.services,
        version: newProjectVersion.version
      } as ProjectVersionData,
      agentLogs: agentLogs
    };
  } else {
    throw new Error("Project not found");
  }
}
