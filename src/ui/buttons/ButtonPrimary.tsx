import styled, { css } from "styled-components";

export const ButtonPrimary = styled.button<{$width?:string}>`
  color: white;
  border: none;
  cursor: pointer;
  background-color: var(--background-button-primary);
  border-radius: var(--radius);
  padding: var(--space-2);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);

  &:hover {
    background-color: var(--background-button-primary-hover);
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
