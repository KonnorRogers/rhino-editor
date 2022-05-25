import { css, html, LitElement } from 'lit'

import { close } from './icons'
import { normalize } from '../normalize'

export class AttachmentEditor extends LitElement {
  close () {
    return html`${close}`
  }

  static get properties () {
    return {
      fileName: { attribute: "file-name", type: String },
      fileSize: { attribute: "file-size", type: String },
      progress: { type: String }
    }
  }

  static get styles () {
    return css`
      ${normalize}

      :host {
        display: flex;
      }

      button {
        background-color: white;
        border: 1px solid skyblue;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        padding: 0.15rem;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(0, -50%);
      }

      button svg {
        height: 1.5rem;
        width: 1.5rem;
      }

      button:is(:focus, :hover):not([aria-disabled="true"], :disabled) {
        outline: none;
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
        width: 90%;
        opacity: 0.9;
        transition: opacity 200ms ease-in;
      }
    `
  }

  render () {
    return html`
      <button class="close-button" @click=${() => {
        console.log("closing...")
        this.parentElement.remove()
      }}>
        ${this.close()}
      </button>
      <span class="file-metadata">
        <span class="file-name">${this.fileName}</span><span class="file-size">${this.fileSize}</span>
      </span>
      <progress class="file-progress" value=${this.progress} max="100"></progress>
    `
  }
}
