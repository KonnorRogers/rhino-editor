import { css, html } from "lit";

import { close } from "src/views/icons";
import { toMemorySize } from "src/views/toMemorySize";
import { normalize } from "src/styles/normalize";
import { BaseElement } from './base-element'

/**
 * An attachment editor element for managing tip-tap attachments. This encompasses the
 *   delete button, tooltip, and progress handler.
 */
export class AttachmentEditor extends BaseElement {
  fileName?: string;
  fileSize?: number;
  progress?: number;

  static baseName = "rhino-attachment-editor"

  close() {
    return html`${close}`;
  }

  static get properties() {
    return {
      fileName: { attribute: "file-name", type: String },
      fileSize: { attribute: "file-size", type: Number },
      progress: { type: Number },
    };
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
      }

      button {
        background-color: white;
        border: 1px solid var(--button-border-color);
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

      .file-progress {
        position: absolute;
        z-index: 1;
        height: 20px;
        top: calc(50% - 10px);
        left: 5%;
        padding: 0;
        margin: 0;
        width: 90%;
        opacity: 0.9;
        transition: opacity 200ms ease-out;
      }

      .file-progress[value="100"] {
        opacity: 0;
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

      <span part="file-metadata" class="file-metadata" ?hidden=${!(this.fileName || this.toFileSize())}>
        <span class="file-name" part="file-name">${this.fileName}</span>
        <span class="file-size" part="file-size">${this.toFileSize()}</span>
      </span>
      <progress
        class="file-progress"
        part="file-progress"
        value=${this.progress || 0}
        min="0"
        max="100"
      ></progress>
    `;
  }
}
