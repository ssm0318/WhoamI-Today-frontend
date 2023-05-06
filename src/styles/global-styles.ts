import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset};

  * {
    font-family: 'Roboto', sans-serif
  }

  button {
    outline: none;
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: #000;
  }
`;

export default GlobalStyle;
