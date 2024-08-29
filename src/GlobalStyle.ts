import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

    :root, body{
        font-family: sans-serif;
        line-height: 20px;
        font-size: 16px;
        font-weight: 400;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;

        overflow: hidden;
    
        //Variable
        --color-primary-50: #ECFDF5;
        --color-primary-100: #D1FAE5;
        --color-primary-200: #A7F3D0;
        --color-primary-300: #6EE7B7;
        --color-primary-400: #34D399;
        --color-primary-500: #10B981;
        --color-primary-600: #178D6B;
        --color-primary-700: #047857;
        --color-primary-800: #065F46;
        --color-primary-900: #064E3B;
        --color-primary-950: #022C22;

        --color-secondary-50: #FFFBEB;
        --color-secondary-100: #FEF3C7;
        --color-secondary-200: #FDE68A;
        --color-secondary-300: #FCD34D;
        --color-secondary-400: #FBBF24;
        --color-secondary-500: #F59E0B;
        --color-secondary-600: #D97706;
        --color-secondary-700: #B45309;
        --color-secondary-800: #92400E;
        --color-secondary-900: #78350F;
        --color-secondary-950: #451A03;

        --color-positive-50: #F0FDF4;
        --color-positive-100: #DCFCE7;
        --color-positive-200: #BBF7D0;
        --color-positive-300: #86EFAC;
        --color-positive-400: #4ADE80;
        --color-positive-500: #22C55E;
        --color-positive-600: #16A34A;
        --color-positive-700: #15803D;
        --color-positive-800: #166534;
        --color-positive-900: #14532D;
        --color-positive-950: #052E16;
        
        --color-negative-50: #FFF1F2;
        --color-negative-100: #FFE4E6;
        --color-negative-200: #FECDD3;
        --color-negative-300: #FDA4AF;
        --color-negative-400: #FB7185;
        --color-negative-500: #F43F5E;
        --color-negative-600: #E11D48;
        --color-negative-700: #BE123C;
        --color-negative-800: #9F1239;
        --color-negative-900: #881337;
        --color-negative-950: #4C0519;

        --color-gray-50: #F8FAFC;
        --color-gray-100: #F1F5F9;
        --color-gray-200: #E2E8F0;
        --color-gray-300: #CBD5E1;
        --color-gray-400: #94A3B8;
        --color-gray-500: #64748B;
        --color-gray-600: #475569;
        --color-gray-700: #334155;
        --color-gray-800: #1E293B;
        --color-gray-900: #0F172A;
        --color-gray-950: #020617;

        --color-info-50: #EFF6FF;
        --color-info-100: #DBEAFE;
        --color-info-200: #BFDBFE;
        --color-info-300: #93C5FD;
        --color-info-400: #60A5FA;
        --color-info-500: #3B82F6;
        --color-info-600: #2563EB;
        --color-info-700: #1D4ED8;
        --color-info-800: #1E40AF;
        --color-info-900: #1E3A8A;
        --color-info-950: #172554;


        //Token
        --background-main:var(--color-gray-50);
        --background-error:var(--color-negative-50);
        --background-main2:var(--color-gray-100);
        --background-hover:var(--color-gray-100);
        --background-active:var(--color-primary-100);
        --background-disabled:var(--color-gray-100);
        --background-white:#ffffff;
        --background-secondary:var(--color-secondary-50);
        --background-secondary-hover:var(--color-secondary-200);
        --background-modal: rgb(30,41,59, 40%);
        --background-button-primary:var(--color-primary-700);
        --background-button-primary-hover:var(--color-primary-900);

        --stroke-light:var(--color-gray-100);
        --stroke-main:var(--color-gray-300);
        --stroke-active:var(--color-primary-200);
        --stroke-active-dark:var(--color-primary-700);
        --stroke-secondary:var(--color-secondary-200);
        --stroke-secondary-dark:var(--color-secondary-700);
        --stroke-error:var(--color-negative-700);

        --text-main:var(--color-gray-700);
        --text-hover:var(--color-gray-800);
        --text-dark:var(--color-gray-800);
        --text-light:var(--color-gray-500);
        --text-disabled:var(--color-gray-300);
        --text-active:var(--color-primary-800);
        --text-secondary:var(--color-secondary-800);
        --text-error:var(--color-negative-700);

        --method-GET: #0891B2;
        --method-POST: #16A34A;
        --method-PUT: #D97706;
        --method-DELETE: #DC2626;
        --method-PATCH: #EA580C;
        --method-HEAD: #CA8A04;


        --space-block: 296px;
        --space-9: 48px;
        --space-8: 40px;
        --space-7: 32px;
        --space-6: 24px;
        --space-5 : 20px;
        --space-4 : 16px;
        --space-3: 12px;
        --space-2 : 8px;
        --space-1: 4px;

        --icon-large : 100px;
        --icon-button: 32px;

        --radius: 6px;
        --radius-large: 32px;

        --shadow-solid : 0px 1px 0 rgba(15, 23, 42, 0.25);
        --shadow-default : 0px 1px 2 rgba(15, 23, 42, 0.25);
        --shadow-light : 0px 2px 10px rgba(15, 23, 42, 0.03);
        --shadow-default : 0px 2px 10 rgba(180, 83, 9, 0.05);

        --font-weight-default: 400;
        --font-weight-bold:600;
        font-weight: var(--font-weight-default);
        color: var(--text-main);
    }

    html, body, #root {
        height: 100%;
        max-height: 100vh;
        width: 100%;
        padding: 0;
        margin: 0;
        border: 0;
        overflow-x: auto;
        overflow-y: hidden;
    }

    h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 24px;
        line-height  : 28px;
        font-weight: 500;
        margin: 0px;
        user-select: none;
    }

    h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        line-height  : 24px;
        font-weight: 500;
        margin: 0px;
        user-select: none;
    }

    .modal-enter {
        transform: translateX(100%);
    }
    .modal-enter-active {
        transform: translateX(0%);
        transition: transform 200ms;
    }
    .modal-exit {
        transform: translateX(0%);
    }
    .modal-exit-active {
        transform: translateX(100%);
        transition: transform 200ms;
    }

    .bottom-pannel-enter {
        transform: translateY(100%);
    }
    .bottom-pannel-enter-active {
        transform: translateY(0%);
        transition: transform 200ms;
    }
    .bottom-pannel-exit {
        transform: translateY(0%);
    }
    .bottom-pannel-exit-active {
        transform: translateY(100%);
        transition: transform 200ms;
    }

    .background-enter {
        opacity: 0;
    }
    .background-enter-active {
        opacity: 1;
        transition: transform 200ms;
    }
    .background-exit {
        opacity: 1;
    }
    .background-exit-active {
        opacity: 0;
        transition: transform 200ms;
    }

    input, button, textarea, select{
        outline-color: var(--stroke-active-dark);
    }

    label {
        font-weight: var(--font-weight-bold);
        color: var(--text-light);
    }

    ul {
        list-style: none;
        list-style-type: none;
    }

    ul ,li{
        padding: 0;
        margin: 0;
    }

div {
  scrollbar-width: thin;
}
`;

export default GlobalStyle;
