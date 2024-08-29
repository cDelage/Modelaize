import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Router } from "electron-router-dom";
import GlobalStyle from "./GlobalStyle";
import AppLayout from "./features/layout/AppLayout";
import { UserSettings } from "../electron/types/UserSettings.type";
import EmptyProject from "./features/project/EmptyProject";
import ProjectPage from "./features/project/ProjectPage";
import {
  ChatEntry,
  CreateProjectPayload,
  ManualReapplyPayload,
  Project,
  ProjectIndex,
  UpdateModelPayload,
  UpdateVersionPayload,
} from "../electron/types/Project.type";
import { ApplicationDescriptionSheet } from "../electron/types/ApplicationDescriptionSheet.type";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

declare global {
  interface Window {
    settings: {
      getSettings: () => Promise<UserSettings>;
      updateSettings: (userSettings: UserSettings) => Promise<number>;
      addNewWorkspace: () => Promise<string | undefined>;
    };
    project: {
      createProject: (createProjectPayload: CreateProjectPayload) => Promise<string>;
      getAllProjects: () => Promise<ProjectIndex[]>;
      updateProjectIndex: (
        projectIndex: ProjectIndex
      ) => Promise<ProjectIndex | undefined>;
      updateProjectModel: (
        model: UpdateModelPayload
      ) => Promise<UpdateModelPayload | undefined>;
      getProjectById: (id: string) => Promise<Project | undefined>;
      getChatHistoricByProjectId: (id: string) => Promise<ChatEntry[] | undefined>;
      generateApplicationDescription: (prompt : string) => Promise<ApplicationDescriptionSheet>;
      updateProjectCurrentVersion: (updateVersionPayload: UpdateVersionPayload) => Promise<string>;
      reapplyVersion: (manualReapplyPayload: ManualReapplyPayload) => Promise<string>;
    };
  }
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <GlobalStyle />
      <Router
        main={
          <>
            <Route
              path="/"
              element={<AppLayout />}
              children={
                <>
                  <Route path="/" element={<EmptyProject />} />
                  <Route path="/:projectId" element={<ProjectPage />} />
                </>
              }
            />
          </>
        }
      />
    </QueryClientProvider>
  );
}

export default App;
