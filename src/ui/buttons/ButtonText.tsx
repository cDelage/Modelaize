import styled from "styled-components";

export const ButtonText = styled.button<{ $color?: string; $fontSize?: string }>`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize};
  width: fit-content;
  &:hover {
    text-decoration: underline;
  }
`;

