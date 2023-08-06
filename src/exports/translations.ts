export const isiOS = /Mac|iOS|iPhone|iPad|iPod/i.test(
  window.navigator.platform,
);

export const modifierKey = isiOS ? "cmd" : "ctrl";
export const fileUploadErrorMessage = "Unable to upload this file.";

export const translations = {
  attachFiles: "Attach Files",
  bold: `Bold <${modifierKey}+b>`,
  italics: `Italicize <${modifierKey}+i>`,
  strike: `Strikethrough <${modifierKey}+shift+x>`,
  link: `Link <${modifierKey}+k>`,
  heading: `Heading <${modifierKey}+alt+1>`,
  blockQuote: `Blockquote <${modifierKey}+shift+b>`,
  codeBlock: `Codeblock <${modifierKey}+e>`,
  bulletList: `Bullet List <${modifierKey}+shift+7>`,
  orderedList: `Ordered List <${modifierKey}+shift+8>`,
  undo: `Undo <${modifierKey}+z>`,
  redo: `Redo <${modifierKey}+shift+z>`,
  linkDialogLink: "Link",
  linkDialogUnlink: "Unlink",
  placeholder: "Write something...",
  increaseIndentation: "Increase indentation",
  decreaseIndentation: "Decrease indentation",
  fileUploadErrorMessage: fileUploadErrorMessage,
} as const;
