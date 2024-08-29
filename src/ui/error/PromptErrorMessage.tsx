import styled, { css } from "styled-components";
import { Row } from "../layout/Flexbox";
import { MouseEvent, useCallback, useState } from "react";
import { IoChevronDown, IoReload } from "react-icons/io5";
import { ICON_SIZE_SMALL } from "../UiConstants";
import { TextBold } from "../text/Text";
import { ButtonSecondary } from "../buttons/ButtonSecondary";

const GenerationErrorStyled = styled.div`
  background-color: var(--background-error);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  width: 375px;
  box-shadow: var(--shadow-solid);
  border: 1px solid var(--stroke-error);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const ErrorContainer = styled.div<{ $isExpand: boolean }>`
  color: var(--text-main);
  width: 100%;
  ${(props) =>
    !props.$isExpand &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    `}
`;

function PromptErrorMessage({ error, regenarate }: { error: string, regenarate?: () => void }) {
  const [isExpand, setIsExpand] = useState(false);

  const toggleExpand = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setIsExpand(exp => !exp)
  },[setIsExpand])

  return (
    <GenerationErrorStyled>
      <TextBold $color="var(--text-error)">Error</TextBold>
      <Row $gap="var(--space-2)" onClick={() => setIsExpand(true)}>
        <IoChevronDown
          size={ICON_SIZE_SMALL}
          onClick={toggleExpand}
          style={{
            transform: !isExpand ? "rotate(-90deg)" : "",
            transition: "transform 200ms ease-in-out",
            cursor:"pointer"
          }}
        />
        <ErrorContainer $isExpand={isExpand}>{error}</ErrorContainer>
      </Row>
      <Row $gap="var(--space-2)">
        <ButtonSecondary onClick={regenarate}>
          <IoReload /> Restart the generation
        </ButtonSecondary>
      </Row>
    </GenerationErrorStyled>
  );
}

export default PromptErrorMessage;
