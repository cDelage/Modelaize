import styled from "styled-components";
import Prompt from "../../ui/layout/Prompt";
import { ButtonIconPrimary } from "../../ui/buttons/ButtonIconPrimary";
import { IoSend } from "react-icons/io5";
import { Column } from "../../ui/layout/Flexbox";
import { ICON_FIT } from "../../ui/UiConstants";
import IconModelaize from "../../ui/icons/IconModelaize";

const PromptStyled = styled.div`
  height: 30%;
  width: 100%;
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  align-items: center;
  padding: var(--space-7);
  box-sizing: border-box;
`;

function PromptEmptyProject({
  generateApplicationDescription,
  isGeneratingApplicationDescription,
  promptValue,
  setPromptValue
}: {
  generateApplicationDescription: (prompt: string) => void;
  isGeneratingApplicationDescription: boolean;
  promptValue: string;
  setPromptValue: (prompt: string) => void
}) {

  return (
    <>
      <Column $justify="center" $align="center" $gap="40px" $grow={1}>
        <IconModelaize width={150} height={150} />
        <div>Write a prompt to describe your application</div>
      </Column>
      <PromptStyled>
        <Prompt
          placeholder="Describe your application"
          width="50%"
          value={promptValue}
          onChange={(e) => setPromptValue(e.target.value)}
          disabled={isGeneratingApplicationDescription}
          $boxShadow="var(--shadow-solid)"
        />
        <Column $justify="end" $height="100%">
          <ButtonIconPrimary
            disabled={!promptValue || isGeneratingApplicationDescription}
            onClick={() => generateApplicationDescription(promptValue)}
          >
            <IoSend size={ICON_FIT} />
          </ButtonIconPrimary>
        </Column>
      </PromptStyled>
    </>
  );
}

export default PromptEmptyProject;
