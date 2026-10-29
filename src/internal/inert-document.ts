let inertDocument: Document | undefined;

export function getInertDocument(): Document {
  if (!inertDocument) {
    inertDocument = document.implementation.createHTMLDocument("");
  }

  return inertDocument;
}
