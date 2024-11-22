// @ts-check
import { css } from "lit";

export const hostStyles = css`
  :host,
  .trix-content {
    /* General tokens */
    --rhino-focus-ring: 0px 0px 1px 1px var(--rhino-button-active-border-color);
    --rhino-border-radius: 4px;

    --rhino-danger-border-color: red;
    --rhino-danger-background-color: #ffdddd;

    /* Editor tokens */
    --rhino-text-color: #374151;
    --rhino-dark-text-color: white;

    --rhino-border-color: #cecece;
    --rhino-placeholder-text-color: #cecece;
    --rhino-dark-placeholder-text-color: gray;

    /* Regular buttons */
    --rhino-button-text-color: #889;
    --rhino-button-dark-text-color: #eee;
    --rhino-button-border-color: #cecece;

    /** Disabled Buttons */
    --rhino-button-disabled-text-color: #d1d5db;
    --rhino-button-disabled-border-color: #d1d5db;
    --rhino-button-disabled-background-color: #d1d5db;

    /** Active buttons */
    --rhino-button-active-border-color: #005a9c;
    --rhino-button-active-background-color: rgb(226 239 255);

    --rhino-toolbar-text-color: hsl(219, 6%, 43%);
    --rhino-toolbar-icon-size: 1em;

    --rhino-dialog-border-color: hsl(
      var(--rhino-button-focus-background-color-hsl) / 50%
    );

    /** Focus buttons */
    --rhino-button-focus-background-color: hsl(
      var(--rhino-button-focus-background-color-hsl)
    );

    --rhino-button-focus-background-color-hsl: 219 26% 95%;

    /**
     * Override "--rhino-fake-selection-color" to change the color of .rhino-selection when the editor is not focused.
     */
    --rhino-fake-selection-color: rgb(220, 220, 220);

    display: block;

    color: var(--rhino-text-color);
    color: light-dark(var(--rhino-text-color), var(--rhino-dark-text-color));
  }
`;

// TODO: Should these cursor styles be made a separate CSS files? I worry about having too many external stylesheets, but I know some users are not using `trix.css` and will miss out on these.
export const cursorStyles = css`
  /**
 * Cursor styles that are useful for providing a more "pleasant" editor experience.
 */
  /**
* https://github.com/curvenote/editor/blob/main/packages/prosemirror-codemark/src/codemark.css
*/
  @keyframes rhino-blink {
    49% {
      border-color: unset;
    }
    50% {
      border-color: Canvas;
    }
    99% {
      border-color: Canvas;
    }
  }
  .rhino-editor .no-cursor {
    caret-color: transparent;
  }

  :where(.rhino-editor) .fake-cursor {
    margin: 0;
    padding: 0;
    margin-right: -1px;
    border-left-width: 1px;
    border-left-style: solid;
    animation: rhino-blink 1s;
    animation-iteration-count: infinite;
    position: relative;
    z-index: 1;
  }

  /** This is for actual "selection" which are highlighting more than 1 character. */
  :where(.rhino-editor .ProseMirror):not(:focus-within) .rhino-selection {
    background: var(--rhino-fake-selection-color);
  }

  /** .fake-cursor-selection is for link "insertions" without selected text. */
  :where(.rhino-editor) .rhino-insertion-placeholder {
    display: none;
    user-select: none;
  }

  /**
This is used for showing a fake cursor for selections like link insertions
*/
  :where(.rhino-editor)[link-dialog-expanded] .rhino-insertion-placeholder {
    margin: 0;
    padding: 0;
    margin-right: -1px;
    margin-left: -2px;
    border-left-width: 4px;
    border-left-style: solid;
    border-color: Highlight;
    position: relative;
    z-index: 1;
    display: inline;
  }

  .ProseMirror-separator {
    display: none !important;
  }
`;

export const toolbarButtonStyles = css`
  .rhino-toolbar-button {
    appearance: none;
    -webkit-appearance: none;
    border: 1px solid var(--rhino-border-color);
    border-radius: var(--rhino-border-radius);
    padding: 0.4em;
    color: var(--rhino-button-text-color);
    color: light-dark(
      var(--rhino-button-text-color),
      var(--rhino-button-dark-text-color)
    );
    background: Canvas;
    font-size: inherit;
    display: inline-grid;
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
    border-color: var(--rhino-button-active-border-color);
  }

  .rhino-toolbar-button:is(:focus):not([aria-disabled="true"], :disabled) {
    box-shadow: var(--rhino-focus-ring);
  }

  /* Only change the background color in certain scenarios */
  .rhino-toolbar-button:is(:hover):not(
      [aria-disabled="true"],
      :disabled,
      [aria-pressed="true"],
      [part~="toolbar__button--active"]
    ) {
    background-color: var(--rhino-button-focus-background-color);
    background-color: light-dark(
      var(--rhino-button-focus-background-color),
      gray
    );
  }

  .rhino-toolbar-button:is([aria-disabled="true"], :disabled):not(
      [part~="toolbar__button--active"]
    ) {
    color: var(--rhino-button-disabled-text-color);
    color: light-dark(var(--rhino-button-disabled-text-color), gray);
    border-color: var(--rhino-button-disabled-border-color);
  }

  .rhino-toolbar-button:is(:focus, :hover):is(
      [aria-disabled="true"],
      :disabled
    ):not([part~="toolbar__button--active"]) {
    outline: transparent;
    color: var(--rhino-button-disabled-text-color);
    color: light-dark(var(--rhino-button-disabled-text-color), gray);
    border-color: var(--rhino-button-disabled-border-color);
    box-shadow: 0 0 0 1px var(--rhino-button-disabled-border-color);
    box-shadow: 0 0 0 1px
      light-dark(var(--rhino-button-disabled-border-color), transparent);
  }

  svg,
  ::slotted(svg) {
    height: var(--rhino-toolbar-icon-size);
    width: var(--rhino-toolbar-icon-size);
  }
`;

export default css`
  ${hostStyles}

  [part~="toolbar"] {
    color: var(--rhino-toolbar-text-color);
  }

  [part~="toolbar"]::part(base) {
    border-color: var(--rhino-border-color);
    border-bottom-color: transparent;
    border-width: 1px;
    border-radius: 4px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    display: flex;
    align-items: center;
    overflow: auto;
  }

  [part~="toolbar"][part~="bubble-menu__toolbar"]::part(base) {
    border: 1px solid var(--rhino-border-color);
    border-radius: 4px;
    padding: 4px;
    background: Canvas;
  }

  [part~="toolbar"]::part(base):is(:focus-visible, :focus-within) {
    border-color: var(--rhino-button-active-border-color);
    outline: transparent;
  }

  .rhino-toolbar-button[part~="toolbar__button--active"],
  .rhino-toolbar-button[part~="toolbar__button--active"]:is(
      :hover,
      :focus-within
    ) {
    background-color: var(--rhino-button-active-background-color);
  }

  slot[name="toolbar"]
    :is(
      [part~="toolbar__button--link"],
      [part~="toolbar__button--increase-indentation"]
    ) {
    margin-inline-end: 1rem;
  }

  [part~="toolbar__button--attach-files"] {
    margin-inline-end: auto;
  }

  role-anchored-region {
    font-size: 0.8em;
    --background: transparent;
    --border-color: transparent;
  }

  role-anchored-region::part(popover) {
    border: none;
  }

  .link-dialog__container {
    display: flex;
    align-items: center;
    max-width: 600px;
    border: 1px solid gray;
    padding: 0.4em;
    background: Canvas;
    border-radius: 8px;
  }

  .link-dialog__input {
    border: 1px solid var(--rhino-border-color);
    border-radius: var(--rhino-border-radius);
    padding: 0.4em 0.6em;
    flex: 1 1 auto;
  }

  .link-dialog__input:is(:focus) {
    outline: transparent;
    border-color: var(--rhino-button-active-border-color);
  }

  .link-validate:invalid {
    outline: transparent;
    background-color: var(--rhino-danger-background-color);
    border-color: var(--rhino-danger-border-color);
    box-shadow: none;
  }

  .rhino-toolbar-button.link-dialog__button {
    padding: 0.4em 0.6em;
    border: 1px solid var(--rhino-button-border-color);
    border-radius: var(--rhino-border-radius);
  }

  .link-dialog__buttons {
    margin-inline-start: 0.5em;
  }

  .editor-wrapper {
    position: relative;
  }

  .trix-content {
    border: 1px solid var(--rhino-border-color);
    border-radius: 0px 0px var(--rhino-border-radius) var(--rhino-border-radius);
    margin: 0;
    padding: 0.4em 0.6em;
    min-height: 200px;
    outline: transparent;
    white-space: pre-wrap;
  }

  role-tooltip {
    position: fixed;
    top: 0;
    left: 0;
    font-size: 0.75em;
    --background: CanvasText;
    color: Canvas;
    --border-color: CanvasText;
  }

  role-tooltip::part(popover) {
    padding: 0.4em 0.6em;
  }
`;
