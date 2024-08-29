import styled from "styled-components";

export const PageColumn = styled.div<{
  $gap?: string;
  $disablePadding?: boolean;
  $backgroundColor?: string;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${(props) => !props.$disablePadding && "var(--space-4)"};
  box-sizing: border-box;
  gap: ${(props) => props.$gap};
  background-color: ${(props) => props.$backgroundColor};
  overflow: hidden;
`;

export const PageRow = styled.div<{ $gap?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  box-sizing: border-box;
  gap: ${(props) => props.$gap};
`;
