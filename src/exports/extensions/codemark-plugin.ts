import { Extension } from "@tiptap/core";
import codemark from "prosemirror-codemark";
import { type MarkType } from "@tiptap/pm/model";

export interface InlineCodePluginOptions {
  markType?: null | undefined | MarkType;
}

/**
 * Uses https://github.com/curvenote/editor/tree/main/packages/prosemirror-codemark to make inline code much nicer to use.
 */
export const CodemarkPlugin = Extension.create({
  name: "rhino-codemark-plugin",
  addProseMirrorPlugins() {
    return codemark({ markType: this.editor.schema.marks.code });
  },
});
