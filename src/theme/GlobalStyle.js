// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Box sizing and default resets */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: ${({ theme }) => theme.fonts.primaryText};
     background-color: ${({ theme }) => theme.mode == 'light' ? '#f5f5f5' : theme.colors.mainBackground};
    color: ${({ theme }) => theme.colors.primaryText};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
  }
    
`;
