import { Extension, Mark, Node } from "@tiptap/core";
// import {
//   FirefoxCaretFixPlugin,
//   FirefoxCaretPluginOptions,
// } from "./firefox-caret-plugin";
import { Attachment, AttachmentOptions } from "./attachment";
import { Image, ImageOptions } from "./image";
import { Gallery, GalleryOptions } from "./gallery";
import { Figcaption, FigcaptionOptions } from "./figcaption";
// import { Plugin } from "@tiptap/pm/state";
import { CustomStrike } from "./strike";
import Placeholder, { PlaceholderOptions } from "@tiptap/extension-placeholder";
import Focus, { FocusOptions } from "@tiptap/extension-focus";
import { StrikeOptions } from "@tiptap/extension-strike";
import Link, { LinkOptions } from "@tiptap/extension-link";

export interface RhinoStarterKitOptions {
  /** Funky hack extension for contenteditable in firefox. */
  // firefoxCaretPlugin: Partial<FirefoxCaretPluginOptions> | false;

  /** Enables attachment galleries */
  gallery: Partial<GalleryOptions> | false;

  /** Enables attachments */
  attachment: Partial<AttachmentOptions> | false;

  /** Enables captions in attachments */
  figcaption: Partial<FigcaptionOptions> | false;

  /** Enables images in attachments */
  image: Partial<ImageOptions> | false;

  strike: Partial<StrikeOptions> | false;
  focus: Partial<FocusOptions> | false;
  link: Partial<LinkOptions> | false;
  placeholder: Partial<PlaceholderOptions> | false;
}

export type TipTapPlugin = Node | Extension | Mark;

export const RhinoStarterKit = Extension.create<RhinoStarterKitOptions>({
  // addProseMirrorPlugins() {
  //   const loadedExtensions: Plugin[] = [];
  //
  //   const extensions: [
  //     keyof RhinoStarterKitOptions,
  //     (options: Record<string, unknown>) => Plugin
  //   ][] = [["firefoxCaretPlugin", FirefoxCaretFixPlugin]];
  //
  //   extensions.forEach(([string, extension]) => {
  //     const options = this.options[string];
  //     if (options !== false) {
  //       loadedExtensions.push(extension(options));
  //     }
  //   });
  //
  //   return loadedExtensions;
  // },

  addExtensions() {
    const loadedExtensions: TipTapPlugin[] = [];

    const extensions: [keyof RhinoStarterKitOptions, TipTapPlugin][] = [
      ["gallery", Gallery],
      ["attachment", Attachment],
      ["image", Image],
      ["figcaption", Figcaption],
      ["strike", CustomStrike],
      ["link", Link],
      ["focus", Focus],
      ["placeholder", Placeholder],
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
