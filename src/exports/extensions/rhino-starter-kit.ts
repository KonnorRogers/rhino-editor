import { Extension, Mark, Node } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
// import {
//   FirefoxCaretFixPlugin,
//   FirefoxCaretPluginOptions,
// } from "./firefox-caret-plugin";
import { Attachment, AttachmentOptions } from "./attachment.js";
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
    ];

    extensions.forEach(([string, extension]) => {
      const options = this.options[string];
      if (options !== false) {
        loadedExtensions.push(extension.configure(options));
      }
    });

    return loadedExtensions;
  },
});
