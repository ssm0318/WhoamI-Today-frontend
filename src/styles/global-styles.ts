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
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box;         /* Opera/IE 8+ */
    }

    body {
        background-color: #000000;
        scrollbar-gutter: stable;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-smooth: never;
    }

    input {
        outline: none;
    }
    textarea {
        overflow: auto;
        outline: none;

        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;

        resize: none; /*remove the resize handle on the bottom right*/
    }

    // emoji-picker-react 관련 스타일
    .EmojiPickerReact .epr-header,
    .EmojiPickerReact li.epr-emoji-category>.epr-emoji-category-label {
        display: none;
      }
`;

export default GlobalStyle;
