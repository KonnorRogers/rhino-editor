export function makeElement (tag, obj = {}) {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(obj)) {
    if (value == null) continue
    el[key] = value
  }

  return el
}
