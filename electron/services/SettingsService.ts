import { BrowserWindow, dialog } from "electron";
import { db } from "../database";
import { UserSettings, Workspace } from "../types/UserSettings.type";

export async function getSettings(): Promise<UserSettings> {
  try {
    const settings = await db.settings.findOne<UserSettings>({});
    if (!settings) {
      return {
        token: "",
        workspaces: [],
        platform: "OPENAI",
      };
    }
    return settings;
  } catch (err) {
    throw new Error(`Fail to get settings : ${err}`);
  }
}

export async function updateSettings(settings: UserSettings): Promise<number> {
  try {
    const currentSettings = await db.settings.findOne<UserSettings>({});
    if (!currentSettings) {
      await db.settings.insertOne<UserSettings>({
        token: "",
        workspaces: [],
        platform: "OPENAI",
      });
    }

    return await db.settings.updateOne({}, settings);
  } catch (err) {
    throw new Error(`Fail to update settings : ${err}`);
  }
}

export async function addNewWorkspace(
  win: BrowserWindow
): Promise<string | undefined> {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });

  if (!result.canceled) {
    return result.filePaths[0]; // Récupérer le chemin du dossier sélectionné
  }

  return undefined;
}

export function getActiveWorkspace(workspaces: Workspace[]) {
  return workspaces.find((workspace) => workspace.active);
}
