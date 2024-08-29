import styled from "styled-components";

export const ButtonIconPrimary = styled.button`
  color: white;
  border: none;
  cursor: pointer;
  background-color: var(--background-button-primary);
  border-radius: var(--radius);
  height: var(--space-8);
  width: var(--space-8);

  &:hover {
    background-color: var(--background-button-primary-hover);
  }

  &:disabled{
    background-color: var(--background-disabled);
    cursor: not-allowed;
  }
`;
