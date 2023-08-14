/* Utility Types */
export type Maybe<T> = T | null | undefined;

/**
 * Convenient way to smash all keys together and make it easy to read.
 */
export type Prettify<T> = { [key in keyof T]: T[key] } & {}
