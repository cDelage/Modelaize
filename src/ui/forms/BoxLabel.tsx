import { ReactNode, useState } from "react";
import { IoClose } from "react-icons/io5";
import styled, { css } from "styled-components";
import { ICON_SIZE_SMALL } from "../UiConstants";

const BoxLabelStyled = styled.div`
  background-color: var(--background-secondary);
  font-size: 0.8rem;
  padding: var(--space-1);
  border-radius: var(--radius);
  color: var(--text-secondary);
  border: var(--stroke-secondary) 1px solid;
  display: flex;
  gap: var(--space-2);
  align-items: center;
  user-select: none;
`;

const DeleteButtonContainer = styled.div<{ $isHover: boolean }>`
  color: transparent;
  border: none;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${(props) =>
    props.$isHover &&
    css`
      color: inherit;
    `}
`;

function BoxLabel({
  children,
  deletable,
  onDelete,
}: {
  children: ReactNode;
  deletable?: boolean;
  onDelete?: () => void;
}) {
  const [isHover, setIsHover] = useState(false);
  return (
    <BoxLabelStyled
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children}
      {deletable && (
        <DeleteButtonContainer onClick={onDelete} $isHover={isHover}>
          <IoClose size={ICON_SIZE_SMALL} />
        </DeleteButtonContainer>
      )}
    </BoxLabelStyled>
  );
}

export default BoxLabel;
