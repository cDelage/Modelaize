import styled from "styled-components";

const LoaderStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;

  .loader {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border-top: 3px solid var(--color-primary-500);
    border-right: 3px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function Loader() {
  return (
    <LoaderStyled>
      <span className="loader"></span>
    </LoaderStyled>
  );
}

export default Loader;
