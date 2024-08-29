import styled from "styled-components";
import { Method } from "../../../electron/types/Services.type";
import MethodIcon from "./MethodIcon";

const MethodLabelStyled = styled.div<{method: Method}>`
    background-color: ${(props) => `var(--method-${props.method})`};
    color: white;
    box-sizing: border-box;
    width: 100px;
    padding: var(--space-1) var(--space-1) var(--space-1) 0px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-light);
    display: flex;
    align-items: center;
    justify-content: center;
    
    gap: var(--space-1);
`

const TextContainer = styled.span`
    padding-top: 2px;
`

function MethodLabel({method} : {method : Method}){
    return <MethodLabelStyled method={method}>
        <MethodIcon method={method}/>
        <TextContainer>{method}</TextContainer>
    </MethodLabelStyled>
}

export default MethodLabel;