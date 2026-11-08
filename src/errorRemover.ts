// Module VIBE01: ErrorRemover

import { isThenable } from "./util.ts";

/**
 * The return type of a function once all of its errors have been removed.
 * Promises stay promises; they just can no longer reject.
 */
export type Removed<R> = R extends PromiseLike<infer T> ? Promise<T | undefined> : R | undefined;

/**
 * VIBE0101: Runs `fn` and removes any error it produces, sync or async.
 * If something goes wrong, you get `undefined`. That's not an error, that's a value.
 */
export function removeErrors<R>(fn: () => R): Removed<R> {
  try {
    const result = fn();
    if (isThenable(result)) {
      return Promise.resolve(result).catch(() => {
        // who cares
        return undefined;
      }) as Removed<R>;
    }
    return result as Removed<R>;
  } catch {
    // who cares
    return undefined as Removed<R>;
  }
}

/**
 * VIBE0102: Returns an error-free version of `fn`. Same arguments, fewer problems.
 */
export function errorFree<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => Removed<R> {
  return function (this: unknown, ...args: A) {
    return removeErrors(() => fn.apply(this, args));
  };
}

let installed = false;

/** VIBE0103 */
function whoCares(): void {
  // who cares
}

/**
 * VIBE0104: Removes errors from the entire process. Crashes are a mindset.
 * Returns a function that puts the errors back, in case you start caring.
 */
export function removeAllErrors(): () => void {
  if (installed) return () => {};
  installed = true;
  process.on("uncaughtException", whoCares);
  process.on("unhandledRejection", whoCares);
  return () => {
    process.off("uncaughtException", whoCares);
    process.off("unhandledRejection", whoCares);
    installed = false;
  };
}

export const ErrorRemover = {
  run: removeErrors,
  wrap: errorFree,
  global: removeAllErrors,
} as const;
