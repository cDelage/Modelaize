import styled from "styled-components";

export const ButtonIconTertiary = styled.button`
  background-color: transparent;
  border: none;
  color: var(--text-light);
  width: var(--icon-button);
  height: var(--icon-button);
  cursor: pointer;

  &:hover {
    color: var(--text-hover);
  }

  &:disabled {
    color: var(--text-disabled);
  }
`;
