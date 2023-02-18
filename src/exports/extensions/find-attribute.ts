export function findAttribute(element: HTMLElement, attribute: string) {
  const attr = element
    .closest("action-text-attachment")
    ?.getAttribute(attribute);
  if (attr) return attr;

  const attrs = element
    .closest("figure[data-trix-attachment]")
    ?.getAttribute("data-trix-attachment");
  if (!attrs) return null;

  return JSON.parse(attrs)[attribute];
}
