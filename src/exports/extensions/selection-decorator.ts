// import {Plugin, PluginKey} from '@tiptap/pm/state';
// import {Decoration, DecorationSet} from '@tiptap/pm/view';
// import {Extension, getMarkRange} from '@tiptap/core';

// // import {CommentsPluginKey} from './keys';

// const LinkSelectionDecorator = Extension.create({
//   addProseMirrorPlugins () {

//   return new Plugin({
//     key: new PluginKey("selection-decorator"),
//     state: {
//     init() {
//       return {
//         activeCommentId: null,
//         maybeMouseSelecting: false,
//       };
//     },

//     apply(tr, pluginState, oldState, newState) {
//       const {doc, selection} = tr;
//       const {$from, to, empty} = selection;
//       const $to = doc.resolve(empty ? to + 1 : to);
//       const {name: markTypeName} = newState.schema.marks.comments;

//       const fromMark = $from.marks().find((mark) => mark.type.name === markTypeName);
//       const toMark = $to.marks().find((mark) => mark.type.name === markTypeName);

//       let activeCommentId = null;

//       if ((fromMark && toMark) && (fromMark === toMark)) {
//         // If both ends are on a comment, check if it's the same instance of a mark,
//         // not a mark that has been split or duplicated, e.g. with copy and paste
//         activeCommentId = toMark.attrs.commentId;
//       } else if (selection.empty && toMark) {
//         // Otherwise, if the selection is empty and there's a mark at the next position, then select that one
//         activeCommentId = toMark.attrs.commentId;
//       }

//       const meta = tr.getMeta(CommentsPluginKey);

//       let {maybeMouseSelecting} = pluginState;

//       if (meta?.maybeMouseSelecting !== undefined) {
//         maybeMouseSelecting = meta.maybeMouseSelecting;
//       }

//       return {
//         activeCommentId,
//         maybeMouseSelecting,
//       };
//     },
//   },

//   props: {
//     handleDOMEvents: {
//       mousedown(view) {
//         view.dispatch(view.state.tr.setMeta(CommentsPluginKey, {maybeMouseSelecting: true}));
//       },

//       mouseup(view) {
//         view.dispatch(view.state.tr.setMeta(CommentsPluginKey, {maybeMouseSelecting: false}));
//       },
//     },

//     decorations(state) {
//       const {activeCommentId, maybeMouseSelecting} = this.getState(state);
//       const {doc, schema} = state;
//       const {name: markTypeName} = schema.marks.comments;

//       if (activeCommentId === null || maybeMouseSelecting) {
//         return DecorationSet.empty;
//       }

//       // If there is a comment, then find all its matches across the doc
//       const activeMarks = [];
//       doc.descendants((node, pos) => {
//         node.marks.forEach((mark) => {
//           if (mark.type.name === markTypeName
//            && mark.attrs.commentId === activeCommentId) {
//             activeMarks.push({
//               mark,
//               $pos: doc.resolve(pos),
//             });
//           }
//         });
//       });

//       const decorations = [];
//       activeMarks.forEach(({mark, $pos}) => {
//         const markRange = getMarkRange($pos, mark.type, mark.attrs);

//         if (markRange) {
//           decorations.push(Decoration.inline(markRange.from, markRange.to, {class: 'comment-highlight'}, {...mark.attrs}));
//         }
//       });

//       return DecorationSet.create(doc, decorations);
//     },
//   },
// });

//   }
// })

