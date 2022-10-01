/** uuid generator for attaching unique ids to attachments that need uploading. */
export function uuidv4(): string {
  // @ts-expect-error
  const crypto = window.crypto || window.msCrypto
  // @ts-expect-error
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}
