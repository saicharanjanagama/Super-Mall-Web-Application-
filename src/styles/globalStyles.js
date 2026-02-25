// src/styles/GlobalStyles.js

import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`

  /* ===============================
     CSS RESET
  =============================== */

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.family};
    font-size: ${({ theme }) => theme.font.size.md};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background ${({ theme }) => theme.transition.normal},
                color ${({ theme }) => theme.transition.normal};
  }

  /* ===============================
     TYPOGRAPHY
  =============================== */

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.font.weight.bold};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textLight};
  }

  /* ===============================
     LINKS
  =============================== */

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: color ${({ theme }) => theme.transition.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  /* ===============================
     BUTTONS
  =============================== */

  button {
    border: none;
    outline: none;
    font-family: inherit;
    font-size: ${({ theme }) => theme.font.size.sm};
    transition: all ${({ theme }) => theme.transition.fast};
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ===============================
     INPUTS & TEXTAREAS
  =============================== */

  input,
  textarea,
  select {
    font-family: inherit;
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radius.md};
    transition: border ${({ theme }) => theme.transition.fast};
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  /* ===============================
     IMAGES
  =============================== */

  img {
    max-width: 100%;
    display: block;
  }

  /* ===============================
     SELECTION COLOR
  =============================== */

  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  /* ===============================
     SCROLLBAR (Modern Browsers)
  =============================== */

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.borderStrong};
    border-radius: ${({ theme }) => theme.radius.round};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

`;