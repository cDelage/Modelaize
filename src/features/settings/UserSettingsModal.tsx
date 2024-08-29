import { useCallback } from "react";
import { Column, Row } from "../../ui/layout/Flexbox";
import InputField from "../../ui/forms/InputField";
import { InputText } from "../../ui/forms/InputText";
import Loader from "../../ui/layout/Loader";
import {
  useAddNewWorkspace,
  useSettings,
  useUpdateSettings,
  useUpdateSettingsLocal,
} from "./SettingsQueries";
import {
  UserSettings,
  Workspace,
} from "../../../electron/types/UserSettings.type";
import { Table, Td, Th, THead, TrBody, TrHeader } from "../../ui/tables/Table";
import { ButtonIconTertiary } from "../../ui/buttons/ButtonIconTertiary";
import { IoEllipsisHorizontal, IoFolder } from "react-icons/io5";
import { ICON_FIT } from "../../ui/UiConstants";
import { ButtonIconPrimary } from "../../ui/buttons/ButtonIconPrimary";
import Menu from "../../ui/layout/Menu";

function UserSettingsModal() {
  const { settings, isLoadingSettings } = useSettings();
  const updateSettingsLocal = useUpdateSettingsLocal();
  const { addNewWorkspace } = useAddNewWorkspace();
  const { updateSettings } = useUpdateSettings();

  const handleUpdateToken = useCallback(
    (newToken: string) => {
      updateSettingsLocal({
        ...settings,
        token: newToken,
      } as UserSettings);
    },
    [updateSettingsLocal]
  );

  const handleBlurUpdateToken = useCallback(() => {
    updateSettings(settings as UserSettings);
  }, [updateSettings, settings]);

  const handleActivateRepository = useCallback(
    (path: string) => {
      if (settings) {
        updateSettings({
          ...settings,
          workspaces: settings.workspaces.map((workspace) => {
            return {
              ...workspace,
              active: workspace.path === path,
            };
          }),
        });
      }
    },
    [updateSettings, settings]
  );

  const handleDeleteRepository = useCallback(
    (workspaceToRemove: Workspace) => {
      if (settings) {
        updateSettings({
          ...settings,
          workspaces: workspaces
            .filter((workspace) => workspace.path !== workspaceToRemove.path)
            .map((workspace, index) => {
              return {
                ...workspace,
                active: workspaceToRemove.active
                  ? index ===
                    workspaces.filter(
                      (workspace) => workspace.path !== workspaceToRemove.path
                    ).length -
                      1
                  : workspace.active,
              };
            }),
        });
      }
    },
    [updateSettings, settings]
  );

  if (isLoadingSettings) return <Loader />;
  if (!settings) return <></>;

  const { token, workspaces } = settings;

  return (
    <Column $gap="var(--space-8)" $padding="var(--space-7)" $overflow="auto">
      <h1> Settings</h1>

      <Column $gap="var(--space-7)">
        <InputField label="Open AI API Key">
          <InputText
            type="password"
            value={token}
            onBlur={handleBlurUpdateToken}
            onChange={(event) => handleUpdateToken(event.target.value)}
            placeholder="Your OPENAI API Key here"
          />
        </InputField>
        <InputField label="Workspaces">
          <>
            <Table>
              <THead>
                <TrHeader>
                  <Th>Path</Th>
                  <Th className="shrink">State</Th>
                  <Th className="shrink"></Th>
                </TrHeader>
              </THead>
              <tbody>
                {!workspaces.length && (
                  <tr>
                    <Td>No workspace existing</Td>
                  </tr>
                )}
                {workspaces.map((workspace) => (
                  <TrBody key={workspace.path}>
                    <Td $active={workspace.active}>{workspace.path}</Td>
                    <Td $active={workspace.active}>
                      {workspace.active && "Active"}
                    </Td>
                    <Td>
                      <Menu>
                        <Menu.Toggle id="workspace">
                          <ButtonIconTertiary>
                            <IoEllipsisHorizontal size={ICON_FIT} />
                          </ButtonIconTertiary>
                        </Menu.Toggle>
                        <Menu.ListTabs>
                          <Menu.Tab
                            onClick={() =>
                              handleActivateRepository(workspace.path)
                            }
                          >
                            Activate workspace
                          </Menu.Tab>
                          <Menu.Tab
                            onClick={() => handleDeleteRepository(workspace)}
                          >
                            Delete workspace
                          </Menu.Tab>
                        </Menu.ListTabs>
                      </Menu>
                    </Td>
                  </TrBody>
                ))}
              </tbody>
            </Table>
            <Row $justify="end">
              <ButtonIconPrimary onClick={() => addNewWorkspace()}>
                <IoFolder size={ICON_FIT} />
              </ButtonIconPrimary>
            </Row>
          </>
        </InputField>
      </Column>
    </Column>
  );
}

export default UserSettingsModal;
