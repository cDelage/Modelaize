import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "node:path";
import { createFileRoute, createURLRoute } from "electron-router-dom";
import {
  addNewWorkspace,
  getSettings,
  updateSettings,
} from "./services/SettingsService";
import { UserSettings } from "./types/UserSettings.type";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectIndex,
  updateProjectModel,
  getProjectHistoryByProjectId,
  manualApplyVersion,
} from "./services/ProjectService";
import { CreateProjectPayload, ManualReapplyPayload, ProjectIndex, UpdateModelPayload, UpdateVersionPayload } from "./types/Project.type";
import { generateApplicationDescriptionSheet } from "./services/GenerateApplicationDescriptionService";
import { updateProjectCurrentVersion } from "./services/UpdateModelService";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  win.setMenuBarVisibility(false);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(createURLRoute(VITE_DEV_SERVER_URL, "main"));
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(
      ...createFileRoute(path.join(process.env.DIST, "index.html"), "main")
    );
  }

  ipcMain.handle("get-settings", async () => await getSettings());
  ipcMain.handle(
    "update-settings",
    async (_event: IpcMainInvokeEvent, settings: UserSettings) =>
      await updateSettings(settings)
  );
  ipcMain.handle(
    "add-new-workspace",
    async (_event: IpcMainInvokeEvent) =>
      await addNewWorkspace(win as BrowserWindow)
  );
  ipcMain.handle(
    "create-project",
    async (_event: IpcMainInvokeEvent, createProjectPayload: CreateProjectPayload) =>
      await createProject(createProjectPayload)
  );
  ipcMain.handle(
    "get-all-projects",
    async (_event: IpcMainInvokeEvent) => await getAllProjects()
  );
  ipcMain.handle(
    "update-project-index",
    async (_event: IpcMainInvokeEvent, projectIndex: ProjectIndex) =>
      await updateProjectIndex(projectIndex)
  );
  ipcMain.handle(
    "update-project-model",
    async (_event: IpcMainInvokeEvent, model: UpdateModelPayload) =>
      await updateProjectModel(model)
  );
  ipcMain.handle(
    "get-project-by-id",
    async (_event: IpcMainInvokeEvent, id: string) => await getProjectById(id)
  );
  ipcMain.handle(
    "get-chat-historic-by-project-id",
    async (_event: IpcMainInvokeEvent, id: string) => {
      return await getProjectHistoryByProjectId(id);
    }
  );
  ipcMain.handle("generate-application-description", async (_event: IpcMainInvokeEvent, prompt: string) => await generateApplicationDescriptionSheet(prompt))

  ipcMain.handle("update-project-version", async (_event: IpcMainInvokeEvent, updateProjectPayload: UpdateVersionPayload) => await updateProjectCurrentVersion(updateProjectPayload))

  ipcMain.handle("reapply-version", async (_event: IpcMainInvokeEvent, manualReapplyPayload: ManualReapplyPayload) => await manualApplyVersion(manualReapplyPayload))

}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
