import { TrixEditor } from "./elements/trix";
import { AttachmentEditor } from "./elements/attachment-editor";
import { AttachmentManager } from "./models/attachment-manager";

AttachmentEditor.define()
TrixEditor.define()

export {
  AttachmentEditor,
  TrixEditor,
	AttachmentManager
};
