import {
  ProjectVersionData,
  ProjectVersionDataPayload,
  UpdateVersionPayload,
} from "../types/Project.type";
import { saveProjectNewVersion, getProjectById } from "./ProjectService";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { getSettings } from "./SettingsService";
import { ChatOpenAI } from "@langchain/openai";
import {
  getCreateNewEntities,
  getCreateNewRelations,
  getCreateNewServices,
  getRemoveEntity,
  getRemoveRelation,
  getRemoveServices,
  getUpdateExistingEntities,
  getUpdateRelations,
  getUpdateServices,
} from "./ProjectDynamicStructuredToolsUtil";
import { filterUnusedForeignKeysAndRelations, getModelParser } from "./ModelUtil";
import { generateUUID } from "./generateUUIDService";

export async function updateProjectCurrentVersion({
  prompt: input,
  id,
}: UpdateVersionPayload) {
  const project = await getProjectById(id);

  if (project && project.model) {
    const newProjectVersion: ProjectVersionDataPayload = {
      model: project.model,
      services: project.services,
      version: project.version + 1,
      dateCreation: new Date(),
      isUpdated: false,
    };

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
      ["system", "You are a helpful assistant"],
      ["placeholder", "{chat_history}"],
      [
        "system",
        `
        Existing data model : {model},
        Existing services : {services}, 
        
        Follow this rules:
        1. When you create an entity, then try to create relation with existing entities.
        2. Always associate Model and Services.
        
        Proceed like this:
        1. Thought about what actions need to be in Model and Services.
        2. Treat the request.
        3. Reply by a short summary of what action you did. (without display result object). 
        `,
      ],
      ["human", "{input}"],
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
    });

    const agentLogs = result.output;
    const modelClean = filterUnusedForeignKeysAndRelations(newProjectVersion.model)

    await saveProjectNewVersion(
      {
        _id: generateUUID(),
        prompt: input,
        dateCreation: new Date(),
        agentLogs,
        projectVersion: newProjectVersion.isUpdated
          ? ({
            model: modelClean,
            dateCreation: newProjectVersion.dateCreation,
            services: newProjectVersion.services,
            version: newProjectVersion.version,
          } as ProjectVersionData)
          : undefined,
      },
      id
    );

    return id;
  } else {
    throw new Error("Project not found");
  }
}
