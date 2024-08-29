import styled from "styled-components";

const LoaderStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;

  .loader {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: block;
    margin: 15px auto;
    position: relative;
    color: var(----color-primary-700);
    left: -100px;
    box-sizing: border-box;
    animation: shadowRolling 2s linear infinite;
  }

  @keyframes shadowRolling {
    0% {
      box-shadow:
        0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0);
    }
    12% {
      box-shadow:
        100px 0 #15803D,
        0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0);
    }
    25% {
      box-shadow:
        110px 0 #15803D,
        100px 0 #15803D,
        0px 0 rgba(255, 255, 255, 0),
        0px 0 rgba(255, 255, 255, 0);
    }
    36% {
      box-shadow:
        120px 0 #15803D,
        110px 0 #15803D,
        100px 0 #15803D,
        0px 0 rgba(255, 255, 255, 0);
    }
    50% {
      box-shadow:
        130px 0 #15803D,
        120px 0 #15803D,
        110px 0 #15803D,
        100px 0 #15803D;
    }
    62% {
      box-shadow:
        200px 0 rgba(255, 255, 255, 0),
        130px 0 #15803D,
        120px 0 #15803D,
        110px 0 #15803D;
    }
    75% {
      box-shadow:
        200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0),
        130px 0 #15803D,
        120px 0 #15803D;
    }
    87% {
      box-shadow:
        200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0),
        130px 0 #15803D;
    }
    100% {
      box-shadow:
        200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0),
        200px 0 rgba(255, 255, 255, 0);
    }
  }
`;

function LoaderLine() {
  return (
    <LoaderStyled>
      <span className="loader"></span>
    </LoaderStyled>
  );
}

export default LoaderLine;
