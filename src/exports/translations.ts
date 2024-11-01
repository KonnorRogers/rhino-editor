export const isiOS = /Mac|iOS|iPhone|iPad|iPod/i.test(
  window.navigator.platform,
);

export const modifierKey = isiOS ? "cmd" : "ctrl";
export const altKey = isiOS ? "option" : "alt";
export const fileUploadErrorMessage = "Unable to upload this file.";
export const captionPlaceholder = "Add a caption...";

export const translations = {
  attachFiles: "Attach Files",
  bold: `Bold <${modifierKey}+b>`,
  italics: `Italicize <${modifierKey}+i>`,
  strike: `Strikethrough <${modifierKey}+shift+x>`,
  link: `Link <${modifierKey}+k>`,
  heading: `Heading <${modifierKey}+${altKey}+1>`,
  blockQuote: `Blockquote <${modifierKey}+shift+b>`,
  code: `Inline code <${modifierKey}+e>`,
  codeBlock: `Codeblock <${modifierKey}+${altKey}+c>`,
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
  captionPlaceholder: captionPlaceholder,
} as const;
