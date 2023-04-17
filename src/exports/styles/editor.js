// @ts-check
import { css } from "lit";

export const hostStyles = css`
  /* General tokens */
  --rhino-focus-ring: 0px 0px 3px 0px var(--rhino-button-active-border-color);
  --rhino-border-radius: 4px;

  --rhino-danger-border-color: red;
  --rhino-danger-background-color: #ffdddd;

  /* Editor tokens */
  --rhino-text-color: #374151;
  --rhino-border-color: #cecece;
  --rhino-placeholder-text-color: #cecece;

  /* Regular buttons */
  --rhino-button-text-color: #889;
  --rhino-button-border-color: #cecece;

  /** Disabled Buttons */
  --rhino-button-disabled-text-color: #d1d5db;
  --rhino-button-disabled-border-color: #d1d5db;
  --rhino-button-disabled-background-color: #d1d5db;

  /** Active buttons */
  --rhino-button-active-border-color: #005a9c;
  --rhino-button-active-background-color: rgb(226 239 255);

  --rhino-toolbar-text-color: hsl(219, 6%, 43%);
  --rhino-toolbar-icon-size: 24px;

  --rhino-dialog-border-color: hsl(
    var(--rhino-button-focus-background-color-hsl) / 50%
  );

  /** Focus buttons */
  --rhino-button-focus-background-color: hsl(
    var(--rhino-button-focus-background-color-hsl)
  );

  --rhino-button-focus-background-color-hsl: 219 26% 95%;

  display: block;
  color: var(--rhino-text-color);
`

// @TODO: Wire up a plugin to auto-write this.
export const toolbarButtonStyles = css`
.rhino-toolbar-button {
  border: 1px solid var(--rhino-border-color);
  border-radius: var(--rhino-border-radius);
  padding: 0.2em 0.4em;
}

.rhino-toolbar-button:is([aria-disabled="true"], :disabled) {
  color: var(--rhino-button-disabled-text-color);
  border-color: var(--rhino-button-disabled-border-color);
}

.rhino-toolbar-button[aria-disabled="true"]:focus {
  border-color: var(--rhino-button-disabled-border-color);
}

.rhino-toolbar-button svg {
  min-height: var(--rhino-toolbar-icon-size);
  min-width: var(--rhino-toolbar-icon-size);

  /* max-height / max-width needs to be set for safari */
  max-height: var(--rhino-toolbar-icon-size);
  max-width: var(--rhino-toolbar-icon-size);
}

.rhino-toolbar-button:is(:focus, :hover):not(
    [aria-disabled="true"],
    :disabled
  ) {
  outline: transparent;
  box-shadow: var(--rhino-focus-ring);
  border-color: var(--rhino-button-active-border-color);
  background-color: var(--rhino-button-focus-background-color);
}

.rhino-toolbar-button:is([aria-disabled="true"], :disabled):not([part~="button--active"]) {
  color: var(--rhino-button-disabled-text-color);
  border-color: var(--rhino-button-disabled-border-color);
}

.rhino-toolbar-button:is(:focus, :hover):is([aria-disabled="true"], :disabled):not([part~="button--active"]) {
  outline: transparent;
  color: var(--rhino-button-disabled-text-color);
  border-color: var(--rhino-button-disabled-border-color);
  box-shadow: 0 0 0 1px var(--rhino-button-disabled-border-color);
}
`

export default css`
  :host {
    ${hostStyles}
  }

  .toolbar {
    color: var(--rhino-toolbar-text-color);
  }

  .toolbar::part(base) {
    overflow: auto;
  }

  .toolbar::part(base) {
    border-color: var(--rhino-border-color);
    border-width: 1px;
    border-bottom-color: transparent;
    border-radius: var(--rhino-border-radius) var(--rhino-border-radius) 0px 0px;
  }

  .toolbar::part(base):is(:focus-visible, :focus-within) {
    border-color: var(--rhino-button-active-border-color);
    outline: transparent;
  }

  :host::part(toolbar__button--active),
  :host::part(toolbar__button--active):is(:hover, :focus) {
    background-color: var(--rhino-button-active-background-color);
  }

  :host::part(toolbar__button--link),
  :host::part(toolbar__button--increase-indentation) {
    margin-inline-end: 1rem;
  }

  :host::part(toolbar__button--attach-files) {
    margin-inline-end: auto;
  }

  .link-dialog {
    position: absolute;
    z-index: 1;
    height: 100%;
    width: 100%;
    padding: 1px;
  }

  .link-dialog__container {
    display: flex;
    align-items: center;
    background: white;
    box-shadow: 0 0.3em 1em #ccc;
    max-width: 600px;
    padding: 0.75rem 0.4rem;
    border-radius: 8px;
    border-top: 2px solid var(--rhino-border-color);
  }

  .link-dialog__input {
    border: 1px solid var(--rhino-border-color);
    border-radius: var(--rhino-border-radius);
    padding: 0.4em 0.6em;
    flex: 1 1 auto;
  }

  .link-dialog__input:is(:focus) {
    outline: transparent;
    box-shadow: var(--rhino-focus-ring);
    border-color: var(--rhino-button-active-border-color);
  }

  .link-validate:invalid {
    outline: transparent;
    background-color: var(--rhino-danger-background-color);
    border-color: var(--rhino-danger-border-color);
    box-shadow: none;
  }

  .link-dialog__button {
    padding: 0.4em 0.6em;
    border: 1px solid var(--rhino-button-border-color);
    border-radius: var(--rhino-border-radius);
  }

  .link-dialog__buttons {
    margin-right: 0.5em;
    margin-left: 0.5em;
  }

  .editor-wrapper {
    position: relative;
  }
`;

