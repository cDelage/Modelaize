import { IoSettingsOutline } from "react-icons/io5";
import { ButtonSecondary } from "../../ui/buttons/ButtonSecondary";
import IconModelaizeGray from "../../ui/icons/IconModelaizeGray";
import { Column } from "../../ui/layout/Flexbox";
import SidePannel from "../../ui/layout/SidePannel";
import { ICON_SIZE_SMALL } from "../../ui/UiConstants";
import UserSettingsModal from "../settings/UserSettingsModal";

function EmptySettingsPlaceholder() {
  return (
    <Column $justify="center" $align="center" $gap="40px" $grow={1}>
      <IconModelaizeGray width={150} height={150} />
      <Column $gap="var(--space-4)" $align="center">
        <div>Configure the environment to work</div>
        <SidePannel>
          <SidePannel.SidePannelButton>
            <ButtonSecondary>
              <IoSettingsOutline size={ICON_SIZE_SMALL} />
              Setup environment
            </ButtonSecondary>
          </SidePannel.SidePannelButton>
          <SidePannel.SidePannelBody>
            <UserSettingsModal />
          </SidePannel.SidePannelBody>
        </SidePannel>
      </Column>
    </Column>
  );
}

export default EmptySettingsPlaceholder;
