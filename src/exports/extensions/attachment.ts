import {
  AttachmentManager,
  AttachmentManagerAttributes,
} from "../attachment-manager.js";
import { LOADING_STATES } from "../elements/attachment-editor.js";
import type { LoadingState } from "../elements/attachment-editor.js";
import { CommandProps, mergeAttributes, Node } from "@tiptap/core";
import { selectionToInsertionEnd } from "../../internal/selection-to-insertion-end.js";
import { Maybe } from "../../types";
import { findAttribute } from "./find-attribute.js";
import { toDefaultCaption } from "../../internal/to-default-caption.js";
import { fileUploadErrorMessage } from "../translations.js";
import { findChildrenByType, findParentNodeOfTypeClosestToPos } from "prosemirror-utils";
import { AttachmentRemoveEvent } from "../events/attachment-remove-event.js";

import { render, html } from "lit/html.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { when } from "lit/directives/when.js";

import { EditorState, Plugin, PluginKey, Transaction } from "@tiptap/pm/state";
import {
  DOMSerializer,
  Node as ProseMirrorNode,
  ResolvedPos,
} from "@tiptap/pm/model";

interface AttachmentAttrs extends AttachmentManagerAttributes {
  loadingState: LoadingState;
  previewable: boolean;
  progress: number;

  // Image
  width?: Maybe<number>;
  height?: Maybe<number>;

  [key: string]: unknown;
}

export interface AttachmentOptions {
  HTMLAttributes: Record<string, any>;
  fileUploadErrorMessage: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    attachment: {
      /**
       * Add an attachment(s)
       */
      setAttachment: (
        options: AttachmentManager | AttachmentManager[],
      ) => ReturnType;

      /**
       * Allows you to insert an attachment at a location within TipTap
       */
      setAttachmentAtCoords: (
        options: AttachmentManager | AttachmentManager[],
        coordinates: { top: number; left: number },
      ) => ReturnType;
    };
  }
}

function handleCaptions(
  node: ProseMirrorNode,
  tr: Transaction,
  newState: EditorState,
  pos: number,
) {
  let modified = false;
  if (node.type.name !== "attachment-figure") return modified;

  // @see https://discuss.prosemirror.net/t/saving-content-containing-dom-generated-by-nodeview/2594/5
  let scratch = document.createElement("div");
  scratch.appendChild(
    DOMSerializer.fromSchema(newState.schema).serializeNode(node),
  );

  const figcaption = scratch.querySelector("figcaption");

  if (figcaption == null) return modified;

  const caption = figcaption.innerHTML;
  if (node.attrs.caption !== caption) {
    tr.setNodeMarkup(pos, undefined, {
      ...node.attrs,
      caption,
    });
    modified = true;
  }

  return modified;
}

/** https://github.com/basecamp/trix/blob/main/src/trix/models/attachment.coffee#L4 */
const isPreviewable = /^image(\/(gif|png|jpe?g)|$)/;

function canPreview(previewable: Boolean, contentType: Maybe<string>): Boolean {
  return previewable || contentType?.match(isPreviewable) != null;
}

function toExtension(fileName: Maybe<string>): string {
  if (!fileName) return "";

  return "attachment--" + fileName.match(/\.(\w+)$/)?.[1].toLowerCase();
}

function toType(content: Maybe<string>, previewable: Boolean): string {
  if (previewable) {
    return "attachment--preview";
  }

  if (content) {
    return "attachment--content";
  }

  return "attachment--file";
}

export const Attachment = Node.create<AttachmentOptions>({
  name: "attachment-figure",
  group: "block attachmentFigure",
  content: "inline*",
  selectable: true,
  draggable: true,
  isolating: true,
  defining: true,

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("rhino-autocaptions"),
        appendTransaction(_transactions, _oldState, newState) {
          const tr = newState.tr;
          let modified = false;

          // @TODO: Iterate through transactions instead of descendants (?).
          newState.doc.descendants((node, pos, _parent) => {
            const mutations = [handleCaptions(node, tr, newState, pos)];

            const shouldModify = mutations.some((bool) => bool === true);

            if (shouldModify) {
              modified = true;
            }
          });

          if (modified) return tr;

          return undefined;
        },
      }),
      new Plugin({
        key: new PluginKey("rhino-prevent-unintended-figcaption-behavior"),
        props: {
          handleKeyDown: (view, event) => {
          /**
           * This is a hack. When we have an empty figcaption and you press "Enter" or "Backspace" you delete the
           * containing gallery.
           */
            if (["Backspace", "Enter"].includes(event.key)) {
              const name = view.state.selection.$anchor.parent.type.name
              const content = view.state.selection.$anchor.parent.textContent

              if (name === "attachment-figure" && content === "") {
                event.preventDefault()
                return true
              }
            }

            return false
          }
        }
      }),
      new Plugin({
        key: new PluginKey("rhino-attachment-remove-event"),
        view() {
          return {
            update(view, prevState) {
              const nodeType = view.state.schema.nodes["attachment-figure"];

              const attachmentNodesBefore = findChildrenByType(
                prevState.doc,
                nodeType,
              );

              type FindNodeResult = ReturnType<typeof findChildrenByType>;
              type FindNodeResultObj = FindNodeResult[keyof FindNodeResult];

              const afterSgidsAndAttachmentIds = new Map<
                string,
                FindNodeResultObj
              >();

              // attachmentNodesAfter state transform
              findChildrenByType(view.state.doc, nodeType).forEach((node) => {
                const nodeAttrs = node.node
                  .attrs as AttachmentManagerAttributes;
                const key = nodeAttrs.sgid || nodeAttrs.attachmentId;

                if (key) {
                  afterSgidsAndAttachmentIds.set(key, node);
                }
              });

              attachmentNodesBefore.forEach((node) => {
                const nodeAttrs = node.node
                  .attrs as AttachmentManagerAttributes;

                const key = nodeAttrs.sgid || nodeAttrs.attachmentId;

                if (!key) return;
                if (afterSgidsAndAttachmentIds.has(key)) return;

                const attachmentManager = new AttachmentManager(
                  nodeAttrs,
                  view,
                );
                view.dom.dispatchEvent(
                  new AttachmentRemoveEvent(attachmentManager),
                );
              });
            },
          };
        },
      }),
    ];
  },
  addOptions() {
    return {
      HTMLAttributes: {
        class: "attachment",
        "data-trix-attributes": JSON.stringify({ presentation: "gallery" }),
      },
      fileUploadErrorMessage: fileUploadErrorMessage,
    };
  },

  parseHTML() {
    return [
      // Generated by #to_trix_html
      {
        tag: "figure[data-trix-attachment]",
        // contentElement: "figcaption"
      },
      // Generated by the standard output.
      {
        tag: "figure.attachment",
        contentElement: "figcaption",
      },
    ];
  },

  renderHTML({ node }) {
    const {
      // Figure
      content,
      contentType,
      sgid,
      fileName,
      fileSize,
      caption,
      url,
      previewable,

      // Image
      src,
      width,
      height,
    } = node.attrs as AttachmentAttrs;

    const attachmentAttrs = {
      caption,
      contentType,
      content,
      filename: fileName,
      filesize: fileSize,
      height,
      width,
      sgid,
      url,
      src,
    };

    const figure = [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        class:
          this.options.HTMLAttributes.class +
          " " +
          toType(content, canPreview(previewable, contentType)) +
          " " +
          toExtension(fileName),
        "data-trix-content-type": contentType,
        "data-trix-attachment": JSON.stringify(attachmentAttrs),
        "data-trix-attributes": JSON.stringify({
          caption,
          presentation: "gallery",
        }),
      }),
    ] as const;

    const figcaption = [
      "figcaption",
      mergeAttributes(
        {},
        { class: "attachment__caption attachment__caption--edited" },
      ),
      0,
    ] as const;

    const image = [
      "img",
      mergeAttributes(
        {},
        {
          src: url || src,
          contenteditable: false,
          width,
          height,
        },
      ),
    ];

    if (!content) {
      return [...figure, image, figcaption];
    }

    return [...figure, figcaption];
  },

  addAttributes() {
    return {
      attachmentId: { default: null },
      caption: {
        default: "",
        parseHTML: (element) => {
          return (
            element.querySelector("figcaption")?.innerHTML ||
            findAttribute(element, "caption")
          );
        },
      },
      progress: {
        default: 0,
        parseHTML: (element) => (findAttribute(element, "sgid") ? 100 : 0),
      },
      loadingState: {
        default: LOADING_STATES.notStarted,
        parseHTML: (element) =>
          findAttribute(element, "sgid")
            ? LOADING_STATES.success
            : LOADING_STATES.notStarted,
      },
      sgid: {
        default: "",
        parseHTML: (element) => findAttribute(element, "sgid"),
      },
      src: {
        default: "",
        parseHTML: (element) => findAttribute(element, "src"),
      },
      height: {
        default: "",
        parseHTML: (element) => findAttribute(element, "height"),
      },
      width: {
        default: "",
        parseHTML: (element) => {
          return findAttribute(element, "width");
        },
      },
      contentType: {
        default: "",
        parseHTML: (element) => {
          // This is a special case where it exists as:
          // figure["data-trix-attachment"]["contentType"] and
          // action-text-attachment["content-type"]
          return (
            findAttribute(element, "content-type") ||
            JSON.parse(element.getAttribute("data-trix-attachment") || "")
              .contentType ||
            "application/octet-stream"
          );
        },
      },
      fileName: {
        default: "",
        parseHTML: (element) => findAttribute(element, "filename"),
      },
      fileSize: {
        default: "",
        parseHTML: (element) => findAttribute(element, "filesize"),
      },
      content: {
        default: "",
        parseHTML: (element) => {
          return (
            findAttribute(element, "content") ||
            element.closest("action-text-attachment")?.innerHTML ||
            ""
          );
        },
      },
      url: {
        default: "",
        parseHTML: (element) => {
          return findAttribute(element, "url");
        },
      },
      previewable: {
        default: false,
        parseHTML: (element) => {
          const { previewable } = JSON.parse(
            element.getAttribute("data-trix-attachment") || "{}",
          );

          return previewable;
        },
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const {
        content,
        contentType,
        sgid,
        fileName,
        progress,
        fileSize,
        url,
        src,
        width,
        height,
        caption,
        previewable,
        loadingState,
      } = node.attrs as AttachmentAttrs;

      const trixAttachment = JSON.stringify({
        contentType,
        content,
        filename: fileName,
        filesize: fileSize,
        height,
        width,
        sgid,
        url,
        caption,
      });

      const trixAttributes = JSON.stringify({
        presentation: "gallery",
        caption,
      });

      const figureClasses = `
        ${this.options.HTMLAttributes.class}
        ${toType(content, canPreview(previewable, contentType))}
        ${toExtension(fileName)}
      `;

      function handleFigureClick(e: Event) {
        const target = e.currentTarget as HTMLElement;
        const figcaption = target.querySelector("figcaption");

        if (figcaption == null) return;

        if (e.composedPath().includes(figcaption)) {
          return;
        }

        if (typeof getPos === "function") {
          editor
            .chain()
            .setTextSelection(getPos() + 1)
            .run();
        }
      }

      // Clean up any objects laying around
      if (url) {
        try {
          URL.revokeObjectURL(src);
        } catch (_e) {}
      }

      const isPreviewable = canPreview(previewable, contentType);

      let imgSrc: string | undefined = undefined;

      if (isPreviewable && (url || src)) {
        imgSrc = url || src;
      }

      const template = html`
        <figure
          class=${figureClasses}
          sgid=${ifDefined(sgid ? sgid : undefined)}
          data-trix-content-type=${contentType}
          data-trix-attachment=${trixAttachment}
          data-trix-attributes=${trixAttributes}
          @click=${handleFigureClick}
        >
          <rhino-attachment-editor
            file-name=${fileName || ""}
            file-size=${String(fileSize || 0)}
            loading-state=${loadingState || LOADING_STATES.notStarted}
            progress=${String(progress)}
            contenteditable="false"
            .fileUploadErrorMessage=${this.options.fileUploadErrorMessage}
          >
          </rhino-attachment-editor>

          ${when(
            content && !isPreviewable,
            /* This is really not great. This is how Trix does it, but it feels very unsafe.
               https://github.com/basecamp/trix/blob/fda14c5ae88a0821cf8999a53dcb3572b4172cf0/src/trix/views/attachment_view.js#L36
            */
            () => html`${unsafeHTML(content)}`,
            () => html`
              <img
                class=${loadingState === LOADING_STATES.error
                  ? "rhino-upload-error"
                  : ""}
                width=${String(width)}
                height=${String(height)}
                src=${ifDefined(imgSrc)}
                contenteditable="false"
              />
            `,
          )}

          <figcaption
            class=${`attachment__caption ${caption ? "" : "is-empty"}`}
            data-placeholder="Add a caption..."
            data-default-caption=${toDefaultCaption({ fileName, fileSize })}
          ></figcaption>
        </figure>
      `;

      // Scratch element to render into.
      const scratch = document.createElement("div");
      render(template, scratch);

      const dom = scratch.firstElementChild;
      const contentDOM = dom?.querySelector("figcaption");

      return {
        dom,
        contentDOM,
        update() { return false }
      };
    };
  },

  addCommands() {
    return {
      setAttachmentAtCoords:
        (
          options: AttachmentManager | AttachmentManager[],
          coordinates: { left: number; top: number },
        ) =>
        ({ view, state, tr, dispatch }) => {
          const posAtCoords = view.posAtCoords(coordinates);

          if (!posAtCoords) return false;

          const currentSelection = state.doc.resolve(posAtCoords.pos)
          return handleAttachment(options,
            currentSelection,
          {
            state,
            tr,
            dispatch,
          });
        },
      setAttachment:
        (options: AttachmentManager | AttachmentManager[]) =>
        ({ state, tr, dispatch }) => {
          const currentSelection = state.doc.resolve(state.selection.anchor)
          return handleAttachment(options, currentSelection, {
            state,
            tr,
            dispatch,
          });
        },
    };
  },
});

function handleAttachment(
  options: AttachmentManager | AttachmentManager[],
  currentSelection: ResolvedPos,
  { state, tr, dispatch }: Pick<CommandProps, "state" | "tr" | "dispatch">,
) {
  const { schema } = state;

  const minSize = 0;
  const maxSize = tr.doc.content.size

  function clamp(val: number, min: number = minSize, max: number = maxSize) {
    if (val < min) return min
    if (val > max) return max
    return val
  }

  // Attachments disabled, dont pass go.
  const hasGalleriesDisabled =
    schema.nodes["attachment-gallery"] == null;

  const currentNode = state.doc.resolve(currentSelection.pos)
  const paragraphTopNode = findParentNodeOfTypeClosestToPos(currentNode, schema.nodes["paragraph"])

  let currentGallery = findParentNodeOfTypeClosestToPos(state.doc.resolve(currentSelection.pos), schema.nodes["attachment-gallery"])

  let priorGalleryPos = null

  if (paragraphTopNode) {
    const paragraphIsEmpty = currentSelection.parent.textContent === ""
    const prevNode = state.doc.resolve(clamp(paragraphTopNode.pos - 1))

    if (paragraphIsEmpty && prevNode.parent.type.name === "attachment-gallery") {
      priorGalleryPos = clamp(paragraphTopNode.pos - 1)
    }
  }

  const isInGallery = currentGallery || priorGalleryPos;

  const attachments: AttachmentManager[] = Array.isArray(options)
    ? options
    : ([] as AttachmentManager[]).concat(options);

  let attachmentNodes = attachments.map((attachment) => {
    return schema.nodes["attachment-figure"].create(
      attachment,
      attachment.caption ? [schema.text(attachment.caption)] : [],
    );
  });

  let end = 0

  if (currentGallery) {
    end = currentGallery.start + currentGallery.node.nodeSize - 2
  } else if (priorGalleryPos != null) {
    end = priorGalleryPos
  }

  end = clamp(end)

  if (hasGalleriesDisabled) {
    attachmentNodes = attachmentNodes.flatMap((node) => [
      node,
    ]);
    tr.insert(end, attachmentNodes.concat([schema.nodes.paragraph.create()]));

    if (dispatch) dispatch(tr);
    return true;
  }

  if (isInGallery) {
    tr.insert(end, attachmentNodes);
  } else {
    const currSelection = state.selection;

    const gallery = schema.nodes["attachment-gallery"].create(
      {},
      attachmentNodes,
    );

    tr.replaceWith(currSelection.from - 1, currSelection.to, [
      gallery,
      schema.nodes.paragraph.create(),
    ]);

    selectionToInsertionEnd(tr, tr.steps.length - 1, -1);
  }

  if (dispatch) dispatch(tr);
  return true;
}
