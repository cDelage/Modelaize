import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UserSettings,
  Workspace,
} from "../../../electron/types/UserSettings.type";
import { useNavigate } from "react-router-dom";

export function useSettings() {
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: window.settings.getSettings,
  });

  return { settings, isLoadingSettings };
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: updateSettings, isPending: isUpdatingSettings } = useMutation(
    {
      mutationFn: (userSettings: UserSettings) =>
        window.settings.updateSettings(userSettings),
      onError: (err) => {
        console.error(err);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["settings"] });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        navigate("/")
      },
    }
  );

  return {
    updateSettings,
    isUpdatingSettings,
  };
}

export function useUpdateSettingsLocal() {
  const queryClient = useQueryClient();

  const updateSettingsLocal = (settings: UserSettings) => {
    queryClient.setQueryData(["settings"], settings);
  };

  return updateSettingsLocal;
}

export function useActiveWorkspace() {
  const { settings } = useSettings();

  return settings?.workspaces.find((workspace) => workspace.active);
}

export function useAddNewWorkspace() {
  const { settings } = useSettings();
  const { updateSettings } = useUpdateSettings();

  const { mutate: addNewWorkspace, isPending: isPendingAddWorkspace } =
    useMutation({
      mutationFn: window.settings.addNewWorkspace,
      onError: (err) => {
        console.error(err);
      },
      onSuccess: (path) => {
        if (path && settings) {
          updateSettings({
            ...settings,
            workspaces: [
              ...settings.workspaces
                .filter((workspace) => workspace.path != path)
                .map((workspace) => {
                  return {
                    ...workspace,
                    active: false,
                  } as Workspace;
                }),
              {
                path,
                active: true,
              },
            ],
          });
        }
      },
    });

  return { addNewWorkspace, isPendingAddWorkspace };
}
