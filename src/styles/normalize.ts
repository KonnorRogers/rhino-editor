import { css } from "lit";

export const normalize = css`
  [hidden] {
    display: none !important;
  }

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  button {
    background-color: inherit;
    border: none;
    color: inherit;
    cursor: pointer;
  }
`;
