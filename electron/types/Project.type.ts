import { ApplicationDescriptionSheet } from "./ApplicationDescriptionSheet.type";
import { Model } from "./Model.type";
import { Service } from "./Services.type";

export type Project = ProjectIndex & ProjectVersionData;

export type ProjectVersionData = {
  model: Model;
  services: Service[]
  version: number;
  dateCreation: Date;
  fromVersion?: number;
}

export type ProjectVersionDataPayload = ProjectVersionData & {
  isUpdated: boolean
}

export type ChatEntry = {
  _id: string;
  dateCreation: Date;
  prompt?: string;
  agentLogs?: string;
  projectVersion?: ProjectVersionData;
  applicationDescriptionSheet?: ApplicationDescriptionSheet;
  isManualReapply?: boolean;
}

export type ProjectIndex = {
  _id: string;
  name: string;
  createdAt: Date;
  isRemoved?: boolean;
  needSave?: boolean;
};

export type UpdateModelPayload = {
  id: string;
  model: Model;
};

export type UpdateVersionPayload = {
  id: string;
  prompt: string;
}

export type CreateProjectPayload = {
  prompt: string;
  applicationDescription: ApplicationDescriptionSheet;
}

export type ManualReapplyPayload = {
  projectId: string;
  versionId: string;
}