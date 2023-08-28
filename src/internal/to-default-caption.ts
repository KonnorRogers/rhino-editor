import type { Maybe } from "../types.js";
import { toMemorySize } from "./to-memory-size.js";

interface CaptionParams {
  fileName?: Maybe<string>;
  fileSize?: Maybe<string | number>;
}

export function toDefaultCaption({
  fileName,
  fileSize,
}: CaptionParams): string {
  if (!fileName || !fileSize) {
    return "";
  }

  return `${fileName} · ${toMemorySize(Number(fileSize))}`;
}
