// Add this to package.json
// pnpm install @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor y-prosemirror y-websocket yjs
//
//
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { TipTapEditor } from 'rhino-editor/exports/elements/tip-tap-editor.js'
import "rhino-editor/exports/styles/trix.css"
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

import {WebsocketProvider} from "@y-rb/actioncable";

const document = new Y.Doc();
import consumer from '../channels/consumer'

const provider = new WebsocketProvider(
  document,
  consumer,
  "SyncChannel",
  {id: "1"}
);

const names = [
  "Fred",
  "Bill",
  "Cyndi",
  "Konnor",
  "Suzanne"
]

const name = names[Math.floor(Math.random() * names.length)]

class CollaborationEditor extends TipTapEditor {
  constructor () {
    super()

    this.starterKit = {
      ...super.starterKit,
      history: false
    }
    this.rhinoStarterKit = {
      placeholder: {
        placeholder: 'Write something … It’ll be shared with everyone else looking at this example.',
      }
    }
  }

  extensions () {
    return [
      ...super.extensions(),
      // Register the document with Tiptap
      Collaboration.configure({document}),
      CollaborationCursor.configure({
        provider,
        user: {
          name,
          color: '#f783ac',
        },
      })
    ]
  }
}

CollaborationEditor.define("rhino-collaboration-editor")
