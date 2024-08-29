export type UserSettings = {
  _id?: string;
  workspaces: Workspace[];
  createdAt?: string;
  updatedAt?: string;
  token: string;
  projectId?: string;
  platform: Platform;
  tokens?: Token[]
};

export type Workspace = {
  path: string;
  active: boolean;
};

export type Token = {
  token: string;
  projectId?: string;
  platform: Platform;
}

export type Platform = "OPENAI" | "WATSONX" | "CLAUDE-SONNET";
