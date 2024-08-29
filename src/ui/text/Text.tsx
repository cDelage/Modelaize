import styled from "styled-components";

export const TextBold = styled.div<{ $color?: string }>`
  font-weight: var(--font-weight-bold);
  color: ${(props) => props.$color};
`;

export const TextNormal = styled.div<{ $color?: string }>`
  font-weight: var(--font-weight-default);
  color: ${(props) => props.$color};
`;

export const TextSmall = styled.div<{ $color?: string }>`
  font-size: 0.8rem;
  color: ${(props) => props.$color};
`;

export const TextSmallBold = styled.div<{ $color?: string }>`
  font-size: 0.8rem;
  font-weight: var(--font-weight-default);
  color: ${(props) => props.$color};
`;
