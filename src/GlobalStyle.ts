import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
    margin: 0;
  }

  #root {
    display: flex;
  }
`;

export default GlobalStyle;
