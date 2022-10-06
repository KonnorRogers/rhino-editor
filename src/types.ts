/* Utility Types */
export type Maybe<T> = T | null | undefined;

/* Library specific types */
export interface AttachmentAttributes {
  file: File;
  src: string;
  sgid?: Maybe<string>;
  url?: Maybe<string>;
  content?: Maybe<string>;
}
