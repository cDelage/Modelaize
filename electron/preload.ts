import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { UserSettings } from "./types/UserSettings.type";
import {
  CreateProjectPayload,
  ManualReapplyPayload,
  ProjectIndex,
  UpdateModelPayload,
  UpdateVersionPayload,
} from "./types/Project.type";

// Custom APIs for renderer
const SETTINGS = {
  getSettings: async () => await ipcRenderer.invoke("get-settings"),
  updateSettings: async (userSettings: UserSettings) =>
    await ipcRenderer.invoke("update-settings", userSettings),
  addNewWorkspace: async () => await ipcRenderer.invoke("add-new-workspace"),
};

const PROJECT = {
  createProject: async (createProjectPayload: CreateProjectPayload) =>
    await ipcRenderer.invoke("create-project", createProjectPayload),
  getAllProjects: async () => await ipcRenderer.invoke("get-all-projects"),
  updateProjectIndex: async (projectIndex: ProjectIndex) =>
    await ipcRenderer.invoke("update-project-index", projectIndex),
  updateProjectModel: async (model: UpdateModelPayload) =>
    await ipcRenderer.invoke("update-project-model", model),
  getProjectById: async (id: string) =>
    await ipcRenderer.invoke("get-project-by-id", id),
  getChatHistoricByProjectId: async (id: string) =>
    await ipcRenderer.invoke("get-chat-historic-by-project-id", id),
  generateApplicationDescription: async (prompt: string) =>
    await ipcRenderer.invoke("generate-application-description", prompt),
  updateProjectCurrentVersion: async (updateVersionPayload: UpdateVersionPayload) =>
    await ipcRenderer.invoke("update-project-version", updateVersionPayload),
  reapplyVersion: async (manualReapplyPayload: ManualReapplyPayload) =>
    await ipcRenderer.invoke("reapply-version", manualReapplyPayload),
};

//generate-application-description

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("settings", SETTINGS);
    contextBridge.exposeInMainWorld("project", PROJECT);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = PROJECTS;
}
