import styled, { css } from "styled-components";

export const Table = styled.table`
  background-color: white;
  width: 100%;
  box-shadow: var(--shadow-solid);
  border-collapse: collapse;
  overflow: hidden;
  border-radius: var(--radius);

  td.shrink,
  th.shrink {
    width: 1%;
    border-radius: inherit; /* ou var(--radius) selon votre besoin */
  }
`;

export const THead = styled.thead`
  border-bottom: 1px solid var(--stroke-main);
`;

export const TrHeader = styled.tr`
  background-color: var(--background-main);
  color: var(--text-light);
  font-weight: var(--font-weight-bold);
`;

export const TrBody = styled.tr`
  border-top: 1px solid var(--stroke-main);
  overflow: hidden;
`;

export const Td = styled.td<{ $active?: boolean }>`
  padding: var(--space-4);
  ${(props) =>
    props.$active &&
    css`
      font-weight: var(--font-weight-bold);
    `}
`;

export const Th = styled.th`
  padding: var(--space-2) var(--space-4);
  text-align: left;
`;
