import styled, { css } from "styled-components";

export const ButtonTertiary = styled.button<{$width?:string}>`
  background-color: transparent;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  border-radius: var(--radius);
  padding: var(--space-2);
  font-size: 1rem;
  background-color: var(--background-main);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);

  &:hover {
    color: var(--text-hover);
    background-color: var(--background-hover);
  }

  &:disabled{
    background-color: var(--background-disabled);
    color:var(--text-disabled);
    cursor: not-allowed;
  }

  ${(props) => props.$width && css`
    width: ${props.$width};
  `}
`;
