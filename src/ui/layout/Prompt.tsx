import styled from "styled-components";

const Prompt = styled.textarea<{ width?: string; $backgroundColor?: string; $boxShadow? : string; }>`
  border-radius: var(--radius);
  background-color: ${(props) => props.$backgroundColor ? props.$backgroundColor : `white`};
  width: ${(props) => props.width};
  border: none;
  resize: none;
  font-size: 1rem;
  line-height: 1.8rem;
  padding: var(--space-4);
  font-family: sans-serif;
  height: 100%;
  box-sizing: border-box;
  box-shadow: ${(props) => props.$boxShadow};

  &:disabled{
    background-color: var(--background-disabled);
    color: var(--text-disabled)
  }
`;

export default Prompt;
