import { Extension } from '@tiptap/core';
import codemark from 'prosemirror-codemark';
import { type MarkType } from '@tiptap/pm/model';
import { PluginKey } from '@tiptap/pm/state';


export interface InlineCodePluginOptions {
  markType?: null | undefined | MarkType
}

/**
 * Uses https://github.com/curvenote/editor/tree/main/packages/prosemirror-codemark to make inline code much nicer to use.
 */
export const InlineCodePlugin = Extension.create({
    name: 'rhino-inline-code',
    addProseMirrorPlugins() {
      let markType = this.options.markType
      if (!markType) {
        console.log(this.editor.schema.marks.code)
        markType = this.editor.schema.marks.code
      }

      return codemark({
          markType
      })
    },
  })
