import { Extension } from "@tiptap/core"
import { FirefoxCaretFixPlugin } from "./firefox-caret-plugin";
import { Attachment } from "./attachment";
import { Image } from "./image"
import { Gallery } from "./gallery";
import { Figcaption } from "./figcaption";


export const AshStarterKit = Extension.create({
  addProseMirrorPlugins() {
    return [
    	FirefoxCaretFixPlugin()
    ];
  },
  addExtensions() {
    return [
      Gallery,
      Attachment,
      Image,
      Figcaption,
    ];
  },
});
