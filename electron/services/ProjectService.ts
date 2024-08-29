import path from "path";
import { generateMCD } from "./GenerateMCDService";
import { getActiveWorkspace, getSettings } from "./SettingsService";
import { generateUUID } from "./generateUUIDService";
import fs from "fs";
import {
  Project,
  ProjectVersionData,
  ProjectIndex,
  UpdateModelPayload,
  ChatEntry,
  ManualReapplyPayload,
} from "../types/Project.type";
import { readAndParseJSONSync } from "../utils/ReadAndParseJson";
import { ApplicationDescriptionSheet } from "../types/ApplicationDescriptionSheet.type";
import { generateServices } from "./GenerateServices";

const PROJECT_INDEX_FILENAME = "projectIndex.json";

const PROJECT_CURRENT_VERSION_FILENAME = "projectCurrentVersion.json";

const PROJECT_CHAT_FILENAME = "projectChat.json";

export async function createProject({
  prompt,
  applicationDescription,
}: {
  prompt: string;
  applicationDescription: ApplicationDescriptionSheet;
}): Promise<string> {
  try {
    const { workspaces } = await getSettings();
    const currentWorkspace = getActiveWorkspace(workspaces);
    if (currentWorkspace?.path) {
      //Call the prompt to generate a model
      const model = await generateMCD({
        prompt,
        applicationDescription,
      });
      if (applicationDescription.name && model.entities.length) {
        const services = await generateServices(
          prompt,
          applicationDescription,
          model
        );

        const projectVersionData: ProjectVersionData = {
          model,
          services,
          version: 1,
          dateCreation: new Date(),
        };

        let projectPath = path.join(
          currentWorkspace.path,
          applicationDescription.name.replace(" ", "-")
        );

        if (fs.existsSync(projectPath)) {
          let i = 1;
          while (fs.existsSync(`${projectPath} (${i})`)) {
            i++;
          }
          projectPath = `${projectPath} (${i})`;
        }

        fs.mkdirSync(projectPath);

        //Project active (separate with current model to easy recup all project infos for sidebar)
        const projectIndexPath = path.join(projectPath, PROJECT_INDEX_FILENAME);
        const _id = generateUUID();
        const projectIndexJSON = JSON.stringify({
          _id,
          name: applicationDescription.name,
          createdAt: new Date(),
        });

        fs.writeFileSync(projectIndexPath, projectIndexJSON, "utf8");

        //Current data
        const projectCurrentDataPath = path.join(
          projectPath,
          PROJECT_CURRENT_VERSION_FILENAME
        );
        const projectCurrentVersionJSON = JSON.stringify(projectVersionData);
        fs.writeFileSync(
          projectCurrentDataPath,
          projectCurrentVersionJSON,
          "utf8"
        );

        const chatEntryId: string = generateUUID();
        const chatEntry: ChatEntry = {
          _id: chatEntryId,
          prompt,
          projectVersion: projectVersionData,
          dateCreation: new Date(),
          applicationDescriptionSheet: applicationDescription,
        };

        //Project history
        const projectChatPath = path.join(projectPath, PROJECT_CHAT_FILENAME);
        const projectChatJSON = JSON.stringify([chatEntry]);
        fs.writeFileSync(projectChatPath, projectChatJSON, "utf8");

        return _id;
      } else {
        throw new Error("Generated CDM badly formatted");
      }
    } else {
      throw new Error(
        "Unable to find a current workspace, please define a workspace."
      );
    }
  } catch (err) {
    throw new Error(`Fail to generate a CDM caused by : ${err}`);
  }
}

export async function getAllProjects(): Promise<ProjectIndex[]> {
  const { workspaces } = await getSettings();
  const currentWorkspace = getActiveWorkspace(workspaces);

  if (currentWorkspace) {
    const directories = await getDirectories(currentWorkspace.path);
    if (directories) {
      return directories
        .filter(isFolderProject)
        .map((project) =>
          readAndParseJSONSync<ProjectIndex>(project, PROJECT_INDEX_FILENAME)
        )
        .filter((project) => !project.isRemoved)
        .sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
    }
  }
  return [];
}

async function getDirectories(source: string): Promise<string[] | undefined> {
  try {
    const entries = await fs.promises.readdir(source, { withFileTypes: true });
    const directories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(source, entry.name));
    return directories;
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}

async function isFolderProject(projectPath: string): Promise<boolean> {
  const projectIndexPath = path.join(projectPath, PROJECT_INDEX_FILENAME);
  try {
    fs.accessSync(projectIndexPath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function findProjectPathById(id: string): Promise<string | undefined> {
  const { workspaces } = await getSettings();
  const currentWorkspace = getActiveWorkspace(workspaces);

  if (currentWorkspace) {
    const directories = await getDirectories(currentWorkspace.path);
    if (directories) {
      return directories
        .filter(isFolderProject)
        .map((project) => {
          return {
            projectIndex: readAndParseJSONSync<ProjectIndex>(
              project,
              "projectIndex.json"
            ),
            path: project,
          };
        })
        .find((project) => project.projectIndex._id === id)?.path;
    }
  }
  return undefined;
}

export async function updateProjectIndex(
  projectIndex: ProjectIndex
): Promise<ProjectIndex | undefined> {
  const projectPath = await findProjectPathById(projectIndex._id);
  if (projectPath) {
    const projectIndexPath = path.join(projectPath, PROJECT_INDEX_FILENAME);
    try {
      const projectIndexJson = JSON.stringify(projectIndex);
      fs.writeFileSync(projectIndexPath, projectIndexJson, "utf8");
      return projectIndex;
    } catch (err) {
      throw new Error(`Fail to update project index : ${err}`);
    }
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projectPath = await findProjectPathById(id);

  if (projectPath) {
    //Project index
    const projectIndex: ProjectIndex = readAndParseJSONSync<ProjectIndex>(
      projectPath,
      PROJECT_INDEX_FILENAME
    );

    //Current model
    const projectData: ProjectVersionData =
      readAndParseJSONSync<ProjectVersionData>(
        projectPath,
        PROJECT_CURRENT_VERSION_FILENAME
      );

    return {
      ...projectIndex,
      ...projectData,
    };
  }

  return undefined;
}

export async function getProjectHistoryByProjectId(
  id: string
): Promise<ChatEntry[] | undefined> {
  const projectPath = await findProjectPathById(id);
  if (projectPath) {
    const projectHistory: ChatEntry[] = readAndParseJSONSync<ChatEntry[]>(
      projectPath,
      PROJECT_CHAT_FILENAME
    );
    return projectHistory;
  }
  return undefined;
}

export async function updateProjectModel({
  id,
  model,
}: UpdateModelPayload): Promise<UpdateModelPayload> {
  const projectPath = await findProjectPathById(id);
  if (projectPath) {
    const projectIndexPath = path.join(
      projectPath,
      PROJECT_CURRENT_VERSION_FILENAME
    );
    try {
      const currentVersion = readAndParseJSONSync<ProjectVersionData>(
        projectPath,
        PROJECT_CURRENT_VERSION_FILENAME
      );

      const projectIndexJson = JSON.stringify({ ...currentVersion, model });
      fs.writeFileSync(projectIndexPath, projectIndexJson, "utf8");

      const historic = readAndParseJSONSync<ChatEntry[]>(
        projectPath,
        PROJECT_CHAT_FILENAME
      );

      if (historic) {
        const currentEntry = historic[historic.length - 1];
        if (currentEntry) {
          const currentEntryUpdated = {
            ...currentEntry,
            projectVersion: {
              ...currentEntry.projectVersion,
              model,
            },
          } as ChatEntry;
          const chatPath = path.join(projectPath, PROJECT_CHAT_FILENAME);
          const newChatHistoric = [
            ...historic.slice(0, -1),
            currentEntryUpdated,
          ];
          const newHistoricJSON = JSON.stringify(newChatHistoric);
          fs.writeFileSync(chatPath, newHistoricJSON, "utf8");
        }
      }

      return { id, model };
    } catch (err) {
      throw new Error(`Fail to update project index : ${err}`);
    }
  } else {
    throw new Error(`Fail to find project index`);
  }
}

export async function saveProjectNewVersion(
  chatEntry: ChatEntry,
  id: string
): Promise<ChatEntry> {
  const projectPath = await findProjectPathById(id);
  if (projectPath) {
    const projectCurrentVersionPath = path.join(
      projectPath,
      PROJECT_CURRENT_VERSION_FILENAME
    );
    try {
      if (chatEntry.projectVersion) {
        const newVersionJSON = JSON.stringify(chatEntry.projectVersion);
        fs.writeFileSync(projectCurrentVersionPath, newVersionJSON, "utf8");
      }

      const historic = readAndParseJSONSync<ChatEntry[]>(
        projectPath,
        PROJECT_CHAT_FILENAME
      );
      const chatPath = path.join(projectPath, PROJECT_CHAT_FILENAME);
      const newHistoric: ChatEntry[] = [...historic, chatEntry];
      const newHistoricJSON = JSON.stringify(newHistoric);
      fs.writeFileSync(chatPath, newHistoricJSON, "utf8");

      return chatEntry;
    } catch (err) {
      throw new Error(`Fail to update project index : ${err}`);
    }
  } else {
    throw new Error(`Fail to find project index`);
  }
}

export async function manualApplyVersion({
  projectId,
  versionId,
}: ManualReapplyPayload): Promise<string> {
  const projectPath = await findProjectPathById(projectId);
  if (projectPath) {
    const historic = readAndParseJSONSync<ChatEntry[]>(
      projectPath,
      PROJECT_CHAT_FILENAME
    );

    const versionToApply = historic.find(
      (entry) => entry._id === versionId
    )?.projectVersion;

    if (!versionToApply) throw new Error("Unable to find the version to apply");

    await saveProjectNewVersion(
      {
        _id: generateUUID(),
        dateCreation: new Date(),
        projectVersion: {
          ...versionToApply,
          version: historic.length,
          fromVersion: versionToApply.version,
        },
        isManualReapply: true,
      },
      projectId
    );

    return projectId;
  } else {
    throw new Error(`Fail to find project index`);
  }
}
