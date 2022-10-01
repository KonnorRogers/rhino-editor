import { css } from "lit";

export default css`
  :host {
    display: block;
    --border-color: #cecece;
    --placeholder-text-color: #cecece;
    --input-focus-ring: 0 0 2px 1px #005a9c;

    --active-button-background-color: rgb(226 239 255);

    --button-text-color: #889;
    --button-border-color: #005a9c;
    --button-background-color: hsl(219, 26%, 95%);

    --disabled-button-text-color: #d1d5db;
    --disabled-button-border-color: #d1d5db;
    --disabled-button-background-color: #d1d5db;

    --toolbar-text-color: hsl(219, 6%, 43%);

    --link-dialog-border-color: #005a9c;
    --link-dialog-background-color: hsla(219, 26%, 95%, 0.5);

    --link-dialog-input-invalid-background-color: #ffdddd;
    --link-dialog-input-invalid-border-color: red;

    color: #374151;
  }

  img, svg {
    width: 100%;
  }

  img, svg, figure {
    max-width: 100%;
    height: auto;
    display: block;
  }

  figure, p {
    padding: 0;
    margin: 0;
  }

  figure {
    position: relative;
  }

  .ProseMirror .placeholder {
    position: absolute;
    pointer-events: none;
    color: var(--placeholder-text-color);
    cursor: text;
    content: "";
  }

  .ProseMirror {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    margin: 0;
    padding: 0.4em 0.6em;
    min-height: 200px;
    outline: transparent;
  }

  .toolbar {
    color: var(--toolbar-text-color);
    overflow: auto;
  }

  .toolbar__button {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 32px;
    margin-right: -3px;
    min-width: 32px;
    position: relative;
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  .toolbar__button[aria-disabled="true"] {
    color: var(--disabled-button-text-color);
    border-color: var(--disabled-button-border-color);
  }

  .toolbar__button[aria-disabled="true"]:focus {
    border-color: var(--disabled-button-border-color);
  }

  .toolbar__button svg {
    flex-shrink: 0;
    height: 24px;
    width: 24px;
  }

  button:is(:focus, :hover):not([aria-disabled="true"], :disabled) {
    outline: transparent;
    box-shadow: 0 0 0 1px var(--button-border-color);
    border-color: var(--button-border-color);
    background-color: var(--button-background-color);
  }

  .toolbar__button:is([aria-disabled="true"]:not([part~="button--active"])) {
    color: var(--disabled-button-text-color);
    border-color: var(--disabled-button-border-color);
  }

  .toolbar__button:is(:focus, :hover):is([aria-disabled="true"]:not([part~="button--active"])) {
    outline: transparent;
    color: var(--disabled-button-text-color);
    border-color: var(--disabled-button-border-color);
    box-shadow: 0 0 0 1px var(--disabled-button-border-color);
  }

  .toolbar__button:is([part~="button--active"]),
  .toolbar__button:is([part~="button--active"]):is(:hover, :focus) {
    background-color: var(--active-button-background-color);
  }

  .toolbar__button:is([part~="button__link"], [part~="button__orderedList"]) {
    margin-right: 1rem;
  }

  .toolbar__button[part~="button__files"] {
    margin-right: auto;
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
    border-top: 2px solid #ccc;
  }

  .link-dialog__input {
    border: 1px solid #374151;
    border-radius: 4px;
    padding: 0.4em 0.6em;
    flex: 1 1 auto;
  }

  .link-dialog__input:is(:focus) {
    outline: transparent;
    box-shadow: var(--input-focus-ring);
    border-color: var(--link-dialog-border-color);
    background-color: var(--link-dialog-background-color);
  }

  .link-validate:invalid {
    outline: transparent;
    background-color: var(--link-dialog-input-invalid-background-color);
    border-color: var(--link-dialog-input-invalid-border-color);
    box-shadow: none;
  }

  .link-dialog__button {
    padding: 0.4em 0.6em;
    border: 1px solid var(--button-border-color);
    border-radius: 4px;
  }

  .link-dialog__buttons {
    margin-right: 0.5em;
    margin-left: 0.5em;
  }

  /* Attachments */
  figure.has-focus {
    outline: transparent;
    box-shadow: 0 0 0 2px var(--button-border-color);
  }

  attachment-editor {
    display: none;
  }

  .ProseMirror[contenteditable="true"] figure.has-focus attachment-editor {
    display: flex;
  }

  figcaption {
    position: relative;
  }

  .ProseMirror p.is-editor-empty:first-child::before,
  figcaption p:first-child.is-empty::before {
    color: #adb5bd;
    content: attr(data-placeholder);
  }

  figcaption p:first-child.is-empty::before {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    cursor: text;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    float: left;
    height: 0;
    pointer-events: none;
  }
`
