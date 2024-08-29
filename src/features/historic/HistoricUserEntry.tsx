import styled from "styled-components";

const UserPromptStyled = styled.div`
  background-color: var(--background-main2);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  width: 375px;
  box-shadow: var(--shadow-solid);
`;

function HistoricUserEntry({ prompt }: { prompt: string }) {
  return (
    <UserPromptStyled>
      {prompt}
    </UserPromptStyled>
  );
}

export default HistoricUserEntry;
