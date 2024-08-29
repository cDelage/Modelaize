import styled from "styled-components";

export const ButtonSecondary = styled.button`
  border: none;
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  border-radius: var(--radius);
  cursor: pointer;
  display: flex;
  gap: 4px;
  padding: var(--space-2);
  align-items: center;
  border: 1px solid var(--stroke-secondary);
  font-size: 1rem;
  width: fit-content;
  &:hover {
    background-color: var(--background-secondary-hover);
  }
  &:disabled{
    background-color: var(--background-disabled);
    color:var(--text-disabled);
    cursor: not-allowed;
    border: 1px solid var(--stroke-light);
  }
`;
