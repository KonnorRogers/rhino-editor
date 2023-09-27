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
import { fileUploadErrorMessage, captionPlaceholder } from "../translations.js";
import {
  findChildrenByType,
  findParentNodeOfTypeClosestToPos,
} from "prosemirror-utils";
import { AttachmentRemoveEvent } from "../events/attachment-remove-event.js";

import { render, html } from "lit/html.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { when } from "lit/directives/when.js";

import {
  EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
  TextSelection,
  Transaction,
} from "@tiptap/pm/state";
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
  captionPlaceholder: string;
  previewable: boolean;
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

export const figureTypes = [
  "previewable-attachment-figure",
  "attachment-figure",
];

/**
 * This is a special case where it exists as:
 * figure["data-trix-attachment"]["contentType"] and
 * action-text-attachment["content-type"]
 */
function parseContentTypeFromElement(element: HTMLElement) {
  return (
    findAttribute(element, "content-type") ||
    JSON.parse(element.getAttribute("data-trix-attachment") || "{}")
      .contentType ||
    "application/octet-stream"
  );
}

const canParseAttachment = (
  node: HTMLElement | string,
  shouldPreview: boolean,
) => {
  if (node instanceof HTMLElement) {
    const contentType = parseContentTypeFromElement(node);

    if (contentType === "application/octet-stream") {
      return false;
    }

    // For <action-text-attachment>
    const actionTextAttachment = node.closest("action-text-attachment");
    if (actionTextAttachment) {
      const previewable =
        actionTextAttachment.getAttribute("previewable") === "true";

      if (!actionTextAttachment.getAttribute("sgid")) {
        return false;
      }

      if (previewable === shouldPreview) {
        return true;
      }

      return false;
    }

    const previewable = canPreview(
      findAttribute(node, "previewable"),
      findAttribute(node, "contentType"),
    );

    if (previewable === shouldPreview) {
      return true;
    }
  }

  return false;
};

/**
 * This appends to the current HTML of the <figcaption> into node.attrs.caption.
 * This is how a figcaption knows if it's empty and is important for ActionText.
 */
function handleCaptions(
  node: ProseMirrorNode,
  tr: Transaction,
  newState: EditorState,
  pos: number,
) {
  let modified = false;

  if (figureTypes.includes(node.type.name) === false) return modified;

  // Make sure the user isn't selecting multiple nodes.
  if (newState.selection.from !== newState.selection.to) {
    return modified;
  }

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

function canPreview(previewable: boolean, contentType: Maybe<string>): boolean {
  return Boolean(
    previewable || AttachmentManager.isPreviewable(contentType || ""),
  );
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
        key: new PluginKey("rhino-attachment-fixer"),
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
          handlePaste: (view, event) => {
            const name = view.state.selection.$anchor.parent.type.name;

            const { clipboardData } = event;

            if (!clipboardData) return false;

            if (figureTypes.includes(name)) {
              event.preventDefault();
              const tr = view.state.tr;
              // @TODO: Ideally we don't need to do this. This prevents inserting unnecessary <p> tags in the figcaption
              // causing things to get fubar and <p> to get inserted in a bizarre place.
              const text = clipboardData.getData("text/plain");
              tr.insertText(text);
              view.dispatch(tr);
              return true;
            }
            return false;
          },
          handleKeyDown: (view, event) => {
            /**
             * This is a hack. When we have an empty figcaption and you press "Enter" or "Backspace" you delete the
             * containing gallery.
             */
            if (["Backspace", "Enter"].includes(event.key)) {
              const name = view.state.selection.$head.parent.type.name;
              const content = view.state.selection.$head.parent.textContent;

              if (view.state.selection.to !== view.state.selection.from) {
                return false;
              }

              if (figureTypes.includes(name) && content === "") {
                event.preventDefault();
                return true;
              }
            }

            return false;
          },
        },
      }),
      new Plugin({
        key: new PluginKey("rhino-attachment-remove-event"),
        view() {
          type FindNodeResult = ReturnType<typeof findChildrenByType>;
          type FindNodeResultObj = FindNodeResult[keyof FindNodeResult];

          const afterSgidsAndAttachmentIds = new Map<
            string,
            FindNodeResultObj
          >();

          return {
            update(view, prevState) {
              const nodeTypes = [
                view.state.schema.nodes["previewable-attachment-figure"],
                view.state.schema.nodes["attachment-figure"],
              ];

              nodeTypes.forEach((nodeType) => {
                const attachmentNodesBefore = findChildrenByType(
                  prevState.doc,
                  nodeType,
                );

                // attachmentNodesAfter state transform
                findChildrenByType(view.state.doc, nodeType).forEach((node) => {
                  const nodeAttrs = node.node
                    .attrs as AttachmentManagerAttributes;
                  const sgid = nodeAttrs.sgid;
                  const attachmentId = nodeAttrs.attachmentId;

                  if (sgid) {
                    afterSgidsAndAttachmentIds.set(sgid, node);
                  }

                  if (attachmentId) {
                    afterSgidsAndAttachmentIds.set(attachmentId, node);
                  }
                });

                attachmentNodesBefore.forEach((node) => {
                  const nodeAttrs = node.node
                    .attrs as AttachmentManagerAttributes;

                  const { sgid, attachmentId } = nodeAttrs;

                  if (sgid && afterSgidsAndAttachmentIds.has(sgid)) return;
                  if (
                    attachmentId &&
                    afterSgidsAndAttachmentIds.has(attachmentId)
                  )
                    return;

                  const attachmentManager = new AttachmentManager(
                    nodeAttrs,
                    view,
                  );

                  view.dom.dispatchEvent(
                    new AttachmentRemoveEvent(attachmentManager),
                  );
                });

                afterSgidsAndAttachmentIds.clear();
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
      },
      fileUploadErrorMessage: fileUploadErrorMessage,
      captionPlaceholder: captionPlaceholder,
      previewable: false,
    };
  },

  parseHTML() {
    return [
      // When it's <figure data-trix-attachment> its coming from `to_trix_html`
      {
        tag: "figure[data-trix-attachment]",
        getAttrs: (node) => {
          const isValid = canParseAttachment(node, this.options.previewable);

          if (!isValid) {
            return false;
          }

          return null;
        },
      },
      // When it's .attachment, its coming from <action-text-attachment><figure></figure></action-text-attachment> its the raw HTML.
      {
        tag: "action-text-attachment > figure.attachment",
        contentElement: "figcaption",
        getAttrs: (node) => {
          const isValid = canParseAttachment(node, this.options.previewable);

          if (!isValid) {
            return false;
          }

          return null;
        },
      },
      {
        tag: "action-text-attachment",
        getAttrs: (node) => {
          const isValid = canParseAttachment(node, this.options.previewable);

          if (!isValid) {
            return false;
          }

          return null;
        },
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
          ...(canPreview(previewable, contentType)
            ? { presentation: "gallery" }
            : {}),
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

    if (!content && canPreview(previewable, contentType)) {
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
        parseHTML: (element) => {
          return findAttribute(element, "sgid") ||
            findAttribute(element, "content") ||
            element.closest("action-text-attachment")?.innerHTML
            ? 100
            : 0;
        },
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
          return parseContentTypeFromElement(element);
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
          const attachment = element.closest("action-text-attachment");

          let content = "";

          if (attachment) {
            const domParser = new DOMParser();
            const parsedDom = domParser.parseFromString(
              attachment.innerHTML,
              "text/html",
            );

            const firstChild = parsedDom.body.firstElementChild;

            if (firstChild) {
              if (
                firstChild.tagName.toLowerCase() !== "figure" ||
                !firstChild.classList.contains("attachment")
              ) {
                content = attachment.innerHTML;
              }
            }
          }

          return content || findAttribute(element, "content");
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
          let { previewable } = JSON.parse(
            element.getAttribute("data-trix-attachment") || "{}",
          );

          if (previewable == null) {
            previewable = findAttribute(element, "previewable");
          }

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

      console.log({ content });

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

      const isPreviewable = canPreview(previewable, contentType);

      const trixAttributes = JSON.stringify({
        ...(isPreviewable ? { presentation: "gallery" } : {}),
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
          const { view } = editor;

          const { tr } = view.state;

          const captionNode = view.state.doc.nodeAt(getPos() + 1);
          captionNode?.nodeSize;

          tr.setSelection(
            TextSelection.create(
              view.state.doc,
              getPos() + 1 + (captionNode?.nodeSize || 0),
            ),
          );

          view.dispatch(tr);

          // This is for raw HTML, its kinda not a huge deal...
          // const defaultCaption = toDefaultCaption({ fileName, fileSize })
          // if (figcaption.innerHTML === defaultCaption || figcaption.innerHTML === defaultCaption.split(" · ").join(" ")) {
          //
          //   // view.dispatch(tr.setNodeMarkup(getPos(), null, { caption: "" }))
          // }
        }
      }

      let imgSrc: string | undefined = undefined;

      if (isPreviewable && (url || src)) {
        imgSrc = url || src;
      }

      let mouseIsDown = false;
      let mouseTimeout: number | null = null;

      // This is a very simple drag handler. This allows us to drag non-previewable nodes.
      // https://discuss.prosemirror.net/t/dragndrop-a-drag-handle-element/4563
      const handleMouseDown = (_e: MouseEvent) => {
        // We need to give this a second just so we dont mess with "click" behavior.
        mouseTimeout = setTimeout(() => {
          mouseIsDown = true;
        }, 10);
      };

      const handleMouseUp = (_e: MouseEvent) => {
        mouseIsDown = false;
        if (mouseTimeout) {
          clearTimeout(mouseTimeout);
        }
      };

      const handleMouseMove = (_e: MouseEvent) => {
        if (mouseIsDown && typeof getPos === "function") {
          const { view } = editor;
          view.dispatch(
            view.state.tr.setSelection(
              NodeSelection.create(view.state.doc, getPos()),
            ),
          );
        }
      };

      const template = html`
        <figure
          class=${figureClasses}
          attachment-type=${this.name}
          sgid=${ifDefined(sgid ? sgid : undefined)}
          data-trix-content-type=${contentType}
          data-trix-attachment=${trixAttachment}
          data-trix-attributes=${trixAttributes}
          @click=${handleFigureClick}
          @mousedown=${handleMouseDown}
          @mouseup=${handleMouseUp}
          @mousemove=${handleMouseMove}
        >
          <rhino-attachment-editor
            file-name=${fileName || ""}
            file-size=${String(fileSize || 0)}
            loading-state=${loadingState || LOADING_STATES.notStarted}
            progress=${String(sgid || content || !fileSize ? 100 : progress)}
            contenteditable="false"
            ?show-metadata=${isPreviewable}
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
            style="display: ${Boolean(content) ? "none" : ""};"
            class=${`attachment__caption ${
              caption ? "attachment__caption--edited" : "is-empty"
            }`}
            data-placeholder=${this.options.captionPlaceholder}
            data-default-caption=${toDefaultCaption({ fileName, fileSize })}
          ></figcaption>
        </figure>
      `;

      // Scratch element to render into.
      const scratch = document.createElement("div");
      render(template, scratch);

      const dom = scratch.firstElementChild;
      const contentDOM = dom?.querySelector("figcaption");

      let srcRevoked = false;

      return {
        dom,
        contentDOM,
        update(node) {
          if (node.type.name !== "attachment") return false;

          if (!srcRevoked && node.attrs.url) {
            srcRevoked = true;

            /** Do your part to save the environment. (Try to) prevent memory leaks. */
            try {
              URL.revokeObjectURL(node.attrs.src);
            } catch (_e) {
              /* We don't really care if this fails. We tried. */
            }
          }

          return false;
        },
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
          let posAtCoords = view.posAtCoords(coordinates);

          const currentSelection = state.doc.resolve(posAtCoords?.pos || 0);
          return handleAttachment(options, currentSelection, {
            state,
            tr,
            dispatch,
          });
        },
      setAttachment:
        (options: AttachmentManager | AttachmentManager[]) =>
        ({ state, tr, dispatch }) => {
          const currentSelection = state.doc.resolve(state.selection.anchor);
          return handleAttachment(options, currentSelection, {
            state,
            tr,
            dispatch,
          });
        },
    };
  },
});

export const PreviewableAttachment = Attachment.extend({
  name: "previewable-attachment-figure",
  group: "block previewableAttachmentFigure",
  addOptions() {
    return {
      ...Attachment.options,
      previewable: true,
    };
  },

  // We purposely override this to nothing. Because all of the extensions registered by Attachment
  // are global, they run twice. We don't want that. for example, this causes `rhino-attachment-remove`
  // to fire twice. No bueno.
  addProseMirrorPlugins() {
    return [];
  },
});

function handleAttachment(
  options: AttachmentManager | AttachmentManager[],
  currentSelection: ResolvedPos,
  { state, tr, dispatch }: Pick<CommandProps, "state" | "tr" | "dispatch">,
) {
  const { schema } = state;

  const minSize = 0;
  const maxSize = tr.doc.content.size;

  function clamp(val: number, min: number = minSize, max: number = maxSize) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }

  // Attachments disabled, dont pass go.
  const hasGalleriesDisabled = schema.nodes["attachment-gallery"] == null;

  const currentNode = state.doc.resolve(currentSelection.pos);
  const paragraphTopNode = findParentNodeOfTypeClosestToPos(
    currentNode,
    schema.nodes["paragraph"],
  );

  let currentGallery = findParentNodeOfTypeClosestToPos(
    state.doc.resolve(currentSelection.pos),
    schema.nodes["attachment-gallery"],
  );

  let priorGalleryPos = null;

  if (paragraphTopNode) {
    const paragraphIsEmpty = currentSelection.parent.textContent === "";
    const prevNode = state.doc.resolve(clamp(paragraphTopNode.pos - 1));

    if (
      paragraphIsEmpty &&
      prevNode.parent.type.name === "attachment-gallery"
    ) {
      priorGalleryPos = clamp(paragraphTopNode.pos - 1);
    }
  }

  const isInGallery = currentGallery || priorGalleryPos;

  const attachments: AttachmentManager[] = Array.isArray(options)
    ? options
    : ([] as AttachmentManager[]).concat(options);

  let allNodesPreviewable = true;

  let attachmentNodes: ProseMirrorNode[] = [];

  let previewableNodes: ProseMirrorNode[] = [];

  attachments.forEach((attachment) => {
    const nodeType = attachment.isPreviewable
      ? "previewable-attachment-figure"
      : "attachment-figure";

    const figure = schema.nodes[nodeType].create(
      attachment,
      attachment.caption ? [schema.text(attachment.caption)] : [],
    );

    if (hasGalleriesDisabled) {
      attachmentNodes.push(figure);
      return;
    }

    if (!attachment.isPreviewable) {
      allNodesPreviewable = false;

      // Make a new gallery. Non-previewable nodes dont belong in galleries.
      if (previewableNodes.length >= 1) {
        attachmentNodes = attachmentNodes.concat(
          schema.nodes["attachment-gallery"].create({}, previewableNodes),
        );
        previewableNodes = [];
      }

      attachmentNodes.push(figure);
      return;
    }

    previewableNodes.push(figure);
  });

  let end = 0;

  if (currentGallery) {
    end = currentGallery.start + currentGallery.node.nodeSize - 2;
  } else if (priorGalleryPos != null) {
    end = priorGalleryPos;
  }

  end = clamp(end);

  if (hasGalleriesDisabled) {
    attachmentNodes = attachmentNodes.flatMap((node) => [node]);
    tr.insert(end, attachmentNodes.concat([schema.nodes.paragraph.create()]));

    if (dispatch) dispatch(tr);
    return true;
  }

  if (isInGallery) {
    if (allNodesPreviewable) {
      tr.insert(end, previewableNodes);
    } else {
      // Make a new gallery. Non-previewable nodes dont belong in galleries.
      if (!hasGalleriesDisabled && previewableNodes.length >= 1) {
        attachmentNodes = attachmentNodes.concat(
          schema.nodes["attachment-gallery"].create({}, previewableNodes),
        );
      }
      tr.insert(end + 1, attachmentNodes);
    }
  } else {
    const currSelection = state.selection;

    // Make a new gallery. Non-previewable nodes dont belong in galleries.
    if (!hasGalleriesDisabled && previewableNodes.length >= 1) {
      attachmentNodes = attachmentNodes.concat(
        schema.nodes["attachment-gallery"].create({}, previewableNodes),
      );
    }

    tr.replaceWith(currSelection.from - 1, currSelection.to, [
      ...attachmentNodes,
      schema.nodes.paragraph.create(),
    ]);

    selectionToInsertionEnd(tr, tr.steps.length - 1, -1);
  }

  if (dispatch) dispatch(tr);
  return true;
}
