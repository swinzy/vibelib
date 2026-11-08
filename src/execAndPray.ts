// Module VIBE02: ExecAndPray

import { isThenable } from "./util.ts";

/**
 * VIBE0201: Starts `fn` and returns immediately. Whether it worked is between it and a higher power.
 * Sync throws and async rejections are both swallowed, so the prayer never comes back to bite you.
 */
export function execAndPray<A extends unknown[]>(fn: (...args: A) => unknown, ...args: A): void {
  try {
    const result = fn(...args);
    if (isThenable(result)) {
      result.then(undefined, () => {
        // who cares
      });
    }
  } catch {
    // who cares
  }
}

/**
 * VIBE0202: Fires off every function at once and hopes for the best. Bulk prayer discount.
 */
export function prayAll(...fns: Array<() => unknown>): void {
  for (const fn of fns) execAndPray(fn);
}

export const ExecAndPray = {
  run: execAndPray,
  all: prayAll,
} as const;
