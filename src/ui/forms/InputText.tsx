import styled, { css } from "styled-components";

export const InputText = styled.input<{$grow?:boolean}>`
    background-color: white;
    padding: var(--space-2);
    border: none;
    border-radius: var(--radius);
    height: var(--space-8);
    box-sizing: border-box;
    box-shadow: var(--shadow-solid);
    ${(props) => props.$grow && css`
        flex-grow: 1;
    `}

    &:disabled {
        color: var(--text-disabled);
        background-color: var(--background-disabled)
    }
`