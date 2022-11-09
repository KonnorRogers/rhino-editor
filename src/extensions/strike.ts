import { mergeAttributes } from "@tiptap/core"
import Strike from "@tiptap/extension-strike"

/**
 * @TODO: ActiveStorage Gem
 * This only exists because "<s>" isnt safe-listed.
 * This can go away if an actiontext extension gem is shipped.
 * https://github.com/ueberdosis/tiptap/blob/c729810767d374e4324e7f3ea84e2a65df18d622/packages/extension-strike/src/strike.ts#L62-L64
 */
export const CustomStrike = Strike.extend({
  renderHTML({ HTMLAttributes }) {
    return ['del', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})

export default CustomStrike

