import { css, html, TemplateResult } from "lit";

import { close } from "src/internal/icons";
import { toMemorySize } from "src/internal/to-memory-size";
import { normalize } from "src/exports/styles/normalize";
import { BaseElement } from "src/internal/elements/base-element";

export const LOADING_STATES = Object.freeze({
  notStarted: "not-started",
  loading: "loading",
  error: "error",
  success: "success",
});

export type LoadingState = (typeof LOADING_STATES)[keyof typeof LOADING_STATES];
/**
 * An attachment editor element for managing tip-tap attachments. This encompasses the
 *   delete button, tooltip, and progress handler.
 */
export class AttachmentEditor extends BaseElement {
  fileName?: string;
  fileSize?: number;
  progress?: number;
  loadingState?: LoadingState;
  errorMessage?: TemplateResult | string;

  constructor() {
    super();
    this.loadingState = "not-started";
    this.errorMessage = html`There was an error uploading this file.`;
  }

  static baseName = "rhino-attachment-editor";

  close() {
    return html`${close}`;
  }

  static get properties() {
    return {
      fileName: { attribute: "file-name", type: String },
      fileSize: { attribute: "file-size", type: Number },
      progress: { type: Number },
      class: { attribute: "class", type: String },
      loadingState: { attribute: "loading-state" },
      errorMessage: { state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("rhino-attachment-editor");
  }

  static get styles() {
    return css`
      ${normalize}

      :host {
        position: absolute;
        width: 100%;
        pointer-events: none;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 0;
        --rhino-error-background-color: hsl(0 100% 89%);
        --rhino-error-text-color: hsl(0 66% 30%);
        --rhino-error-border-color: hsl(0 66% 30%);
      }

      button {
        background-color: white;
        border: 1px solid var(--rhino-button-active-border-color);
        border-radius: 9999px;
        display: flex;
        align-items: center;
        padding: 0.15rem;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(0, -50%);
        pointer-events: all;
      }

      button svg {
        height: 1.5rem;
        width: 1.5rem;
      }

      button:is(:focus, :hover):not([aria-disabled="true"], :disabled) {
        outline: transparent;
        background-color: rgb(240, 240, 240);
      }

      .file-metadata {
        position: absolute;
        left: 50%;
        top: 2em;
        transform: translate(-50%, 0);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        text-align: center;
        max-width: 90%;
        padding: 0.4rem 0.6rem;
        outline: 1px solid white;
        font-size: 0.8rem;
        color: #fff;
        background-color: hsla(0 0% 0% / 70%);
        border-radius: 3px;
      }

      .file-name {
        display: inline-block;
        max-width: 100%;
        vertical-align: bottom;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-size {
        margin-left: 0.2em;
        white-space: nowrap;
      }

      .file-progress-container {
        top: calc(50% - 10px);
        left: 5%;
        width: 90%;
        position: absolute;
        z-index: 1;
      }

      .file-progress {
        --border-radius: 8px;
        --progress-value-color: blue;
        --progress-background-color: #eee;
        height: 10px;
        padding: 0;
        margin: 0;
        opacity: 0.9;
        width: 100%;
        transition: opacity 200ms ease-out visibility 200ms ease-out;
        border-radius: var(--border-radius);
        background-color: var(--progress-background-color);
        border: 1px solid gray;
      }

      progress::-webkit-progress-bar {
        background-color: var(--progress-background-color);
        border-radius: var(--border-radius);
      }
      progress::-webkit-progress-value {
        background-color: var(--progress-value-color);
        border-radius: var(--border-radius);
      }
      progress::-moz-progress-bar {
        /* style rules */
        border-radius: var(--border-radius);
        background-color: var(--progress-value-color);
      }

      :host([loading-state="error"]) .file-progress-error {
        background-color: var(--rhino-error-background-color);
        color: var(--rhino-error-text-color);
        border: 1px solid var(--rhino-error-border-color);
        padding: 0.4em 0.6em;
        margin-top: 0.25rem;
        display: inline-block;
        border-radius: 8px;
      }

      :host([loading-state="error"]) .file-progress {
        background-color: var(--rhino-error-background-color);
        border-color: var(--rhino-error-border-color);
      }

      .file-progress[value="100"] {
        opacity: 0;
        visibility: hidden;
      }
    `;
  }

  toFileSize(): string {
    if (this.fileSize) return toMemorySize(this.fileSize);

    return "";
  }

  render() {
    return html`
      <button
        class="delete-button"
        part="delete-button"
        @pointerdown=${(e: PointerEvent) => {
          e.preventDefault();
          this.parentElement?.remove();
        }}
      >
        ${this.close()}
      </button>

      <span
        part="file-metadata"
        class="file-metadata"
        ?hidden=${!(this.fileName || this.toFileSize())}
      >
        <span class="file-name" part="file-name">${this.fileName}</span>
        <span class="file-size" part="file-size">${this.toFileSize()}</span>
      </span>
      <div class="file-progress-container" part="file-progress-container">
        <progress
          id="file-progress"
          class="file-progress"
          part="file-progress"
          value=${this.progress || 0}
          min="0"
          max="100"
        ></progress>
        <label
          for="file-progress"
          class="file-progress-error"
          part="file-progress-error"
        >
          ${this.loadingState === "error" ? this.errorMessage : null}
        </label>
      </div>
    `;
  }
}
