import { NodeType } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";

import { NodeRange, objectIncludes, getNodeType } from "@tiptap/core";

// https://github.com/ueberdosis/tiptap/issues/4190
export function isExactNodeActive(
  state: EditorState,
  typeOrName: NodeType | string | null,
  attributes: Record<string, any> = {},
): boolean {
  const { from, to, empty } = state.selection;
  const type = typeOrName ? getNodeType(typeOrName, state.schema) : null;

  const nodeRanges: NodeRange[] = [];

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isText) {
      return;
    }

    const relativeFrom = Math.max(from, pos);
    const relativeTo = Math.min(to, pos + node.nodeSize);

    nodeRanges.push({
      node,
      from: relativeFrom,
      to: relativeTo,
    });
  });

  const selectionRange = to - from;

  /******
    This is modified from "isActive".
    https://github.com/ueberdosis/tiptap/issues/4190#issuecomment-1636209809
  *****/
  const matchedNodeRanges = nodeRanges
    .slice(-3) // here is the change
    .filter((nodeRange) => {
      if (!type) {
        return true;
      }

      return type.name === nodeRange.node.type.name;
    })
    .filter((nodeRange) =>
      objectIncludes(nodeRange.node.attrs, attributes, { strict: false }),
    );
  /** END MODIFICATION **/

  if (empty) {
    return !!matchedNodeRanges.length;
  }

  const range = matchedNodeRanges.reduce(
    (sum, nodeRange) => sum + nodeRange.to - nodeRange.from,
    0,
  );

  return range >= selectionRange;
}
