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

    html, body, #root {
        height: 100%;
        overflow: hidden;
        overscroll-behavior: none;
    }

    body {
        background-color: #FFFFFF;
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
    .EmojiPickerReact {
        .epr-category-nav,
        li.epr-emoji-category>.epr-emoji-category-label  {
            display: none;
        }
    }

    // 댓글 이모지 피커 스타일
    .comment-emoji-picker input[type="text"] {
        font-size: 16px !important;
    }
    .comment-emoji-picker button.epr-emoji {
        border-radius: 50% !important;
    }
    .comment-emoji-picker {
        padding-bottom: 40px !important;
        border: none !important;
    }
    .comment-emoji-picker .epr-header {
        position: static !important;
        background-color: #FCFCFC !important;
        border-bottom: 1px solid #F0F0F0 !important;
        margin-top: 24px !important;
        margin-bottom: 6px !important;
    }
    .mood-emoji-picker.comment-emoji-picker .epr-header {
        margin-top: 0 !important;
        background-color: transparent !important;
        border-bottom: none !important;
    }
    .mood-emoji-picker button.epr-emoji:focus {
        background-color: transparent !important;
    }
    .comment-emoji-picker .epr-category-nav {
        display: flex !important;
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background-color: var(--epr-bg-color) !important;
        z-index: 1 !important;
        padding: 6px var(--epr-horizontal-padding) !important;
    }
    .EmojiPickerReact.comment-emoji-picker [class*="epr-cat-btn"],
    .EmojiPickerReact.comment-emoji-picker [class*="epr-cat-btn"]:hover,
    .EmojiPickerReact.comment-emoji-picker [class*="epr-cat-btn"]:active {
        background-position-y: 0 !important;
        opacity: 0.5 !important;
        -webkit-tap-highlight-color: transparent;
        transition: none !important;
    }
    .EmojiPickerReact.comment-emoji-picker [class*="epr-cat-btn"].epr-active,
    .EmojiPickerReact.comment-emoji-picker [class*="epr-cat-btn"].epr-active:hover,
    .EmojiPickerReact.comment-emoji-picker [class*="epr-cat-btn"]:focus,
    .EmojiPickerReact.comment-emoji-picker [class*="epr-cat-btn"]:focus:hover {
        background-position-y: var(--epr-category-navigation-button-size) !important;
        opacity: 1 !important;
    }
    /* :focus된 버튼이 있을 때, .epr-active가 다른 버튼에 잔류해도 비활성으로 강제 */
    .EmojiPickerReact.comment-emoji-picker .epr-category-nav:has([class*="epr-cat-btn"]:focus) [class*="epr-cat-btn"].epr-active:not(:focus) {
        background-position-y: 0 !important;
        opacity: 0.5 !important;
    }
`;

export default GlobalStyle;
