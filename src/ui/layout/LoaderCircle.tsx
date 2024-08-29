import styled from "styled-components";

const LoaderStyled = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  .loader {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-primary-100);
    border-bottom-color: var(--color-primary-700);
    border-radius: 50%;
    display: inline-block;
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

function LoaderCircle() {
  return (
    <LoaderStyled>
      <span className="loader"></span>
    </LoaderStyled>
  );
}

export default LoaderCircle;
