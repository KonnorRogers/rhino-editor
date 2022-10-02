/**
 * A function that handles returning human readable file sizes.
 */
export function toMemorySize(bytes: number) {
  const kilobytes = bytes / 1024;

  if (kilobytes < 1) {
    return bytes.toString() + "B";
  }

  const megabytes = kilobytes / 1024;

  if (megabytes < 1) {
    return kilobytes.toFixed(2).toString() + " KB";
  }

  return megabytes.toFixed(2).toString() + " MB";
}
