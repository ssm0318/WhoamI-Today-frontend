import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset};

  * {
    font-family: 'Roboto', sans-serif
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: inherit;
  }

  a {
    text-decoration: none;
    color: #000;
  }
`;

export default GlobalStyle;
