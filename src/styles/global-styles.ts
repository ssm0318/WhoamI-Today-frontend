import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
    ${reset};
    @font-face {
        font-family: 'Roboto';
        font-weight: 400;
        src: url("fonts/Roboto-Regular.ttf") format("truetype");
    }

    @font-face {
        font-family: 'Roboto';
        font-weight: 600;
        src: url("fonts/Roboto-Medium.ttf") format("truetype");
    }

    @font-face {
        font-family: 'Roboto';
        font-weight: 700;
        src: url("fonts/Roboto-Bold.ttf") format("truetype");
    }

    button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        outline: inherit;

        &:disabled {
            cursor: default;
        }
    }

    a {
        text-decoration: none;
    }

    * {
        font-family: 'Roboto', sans-serif !important;
        box-sizing: border-box;
    }

    body {
        background-color: #000000
    }

    input {
        outline: none;
    }
    textarea {
        border: none;
        overflow: auto;
        outline: none;

        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;

        resize: none; /*remove the resize handle on the bottom right*/
    }

`;

export default GlobalStyle;
