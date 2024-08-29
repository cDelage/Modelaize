import styled from "styled-components";

export const H2Bold = styled.h2<{ $color?: string }>`
  font-weight: var(--font-weight-bold);
  color: ${(props) => props.$color};
`;
