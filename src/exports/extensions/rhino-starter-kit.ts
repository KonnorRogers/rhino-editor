import { Extension, Mark, Node } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
// import {
//   FirefoxCaretFixPlugin,
//   FirefoxCaretPluginOptions,
// } from "./firefox-caret-plugin";
import {
  Attachment,
  AttachmentOptions,
  PreviewableAttachment,
} from "./attachment.js";
import { Image, ImageOptions } from "./image.js";
import { Gallery, GalleryOptions } from "./gallery.js";
import { Figcaption, FigcaptionOptions } from "./figcaption.js";
// import { Plugin } from "@tiptap/pm";
import { CustomStrike } from "./strike.js";
import Placeholder, { PlaceholderOptions } from "@tiptap/extension-placeholder";
import Focus, { FocusOptions } from "@tiptap/extension-focus";
import { StrikeOptions } from "@tiptap/extension-strike";
import Link, { LinkOptions } from "@tiptap/extension-link";
import { Paste, PasteOptions } from "./paste.js";
import { BubbleMenuExtension, BubbleMenuOptions } from "./bubble-menu.js";
// import BubbleMenu, { BubbleMenuOptions } from '@tiptap/extension-bubble-menu'
// import { PluginKey } from '@tiptap/pm/state'

export interface RhinoStarterKitOptions {
  /** Funky hack extension for contenteditable in firefox. */
  // firefoxCaretPlugin: Partial<FirefoxCaretPluginOptions> | false;

  /** Enables attachment galleries */
  rhinoGallery: Partial<GalleryOptions> | false;

  /** Enables attachments */
  rhinoAttachment: Partial<AttachmentOptions> | false;

  /** Enables captions in attachments */
  rhinoFigcaption: Partial<FigcaptionOptions> | false;

  /** Enables images in attachments */
  rhinoImage: Partial<ImageOptions> | false;

  /**
   * Replaces the default strike from TipTap's StarterKit and replaces it with `<del>` instead of `<s>`
   */
  rhinoStrike: Partial<StrikeOptions> | false;

  /**
   * A plugin for finding the currently focused element. Used by various CSS styles in the editor.
   */
  rhinoFocus: Partial<FocusOptions> | false;

  /**
   * Enables the link dialog
   */
  rhinoLink: Partial<LinkOptions> | false;

  /**
   * Enables & configures the placeholder you see for captions and for empty documents
   */
  rhinoPlaceholder: Partial<PlaceholderOptions> | false;

  /**
   * Sends a browser event called `rhino-paste-event` everytime a user pastes something into the document.
   */
  rhinoPasteEvent: Partial<PasteOptions> | false;

  rhinoDefaultBubbleMenu: Partial<BubbleMenuOptions> | false;
}

export type TipTapPlugin = Node | Extension | Mark;

export const RhinoStarterKit = Extension.create<RhinoStarterKitOptions>({
  name: "rhino-starter-kit",
  addProseMirrorPlugins() {
    const loadedExtensions: Plugin[] = [];

    const extensions: [
      keyof RhinoStarterKitOptions,
      (options: Record<string, unknown>) => Plugin,
    ][] = [
      // ["firefoxCaretPlugin", FirefoxCaretFixPlugin]
      ["rhinoPasteEvent", Paste],
    ];

    extensions.forEach(([string, extension]) => {
      const options = this.options[string];
      if (options !== false) {
        loadedExtensions.push(extension(options));
      }
    });

    return loadedExtensions;
  },

  addExtensions() {
    const loadedExtensions: TipTapPlugin[] = [];

    const extensions: [keyof RhinoStarterKitOptions, TipTapPlugin][] = [
      ["rhinoGallery", Gallery],
      ["rhinoAttachment", Attachment],
      ["rhinoImage", Image],
      ["rhinoFigcaption", Figcaption],
      ["rhinoStrike", CustomStrike],
      ["rhinoLink", Link],
      ["rhinoFocus", Focus],
      ["rhinoPlaceholder", Placeholder],
      ["rhinoDefaultBubbleMenu", BubbleMenuExtension],
    ];

    extensions.forEach(([string, extension]) => {
      const options = this.options[string];
      if (options !== false) {
        loadedExtensions.push(extension.configure(options));

        // This is a special case. Because non-previewable attachments don't belong in galleries
        // To reduce the logic we have to write, previewable attachments are a slightly modified version of non-previewable attachments with a different "group" so they can belong to a gallery.
        if (string === "rhinoAttachment") {
          loadedExtensions.push(
            PreviewableAttachment.configure(options as AttachmentOptions),
          );
        }
      }
    });

    return loadedExtensions;
  },
});
