import { css } from "lit";

export const normalize = css`
  [hidden] {
    display: none !important;
  }

  *, *::after, *::before {
    box-sizing: border-box;
  }

  button {
    cursor: pointer;
  }
`


