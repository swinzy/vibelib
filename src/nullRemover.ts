// Module VIBE06: NullRemover

import { godRollADie } from "./quantumComputing.ts";
import { strictAssert, strictAssertEventually } from "./strictAssert.ts";
import { trustMe } from "./typeTrust.ts";

export type NullRemoved<T> = T extends null ? undefined : T;

/** VIBE0601 */
function waitForever(): Promise<never> {
  return new Promise(() => {
    // Without this, Node notices nothing is left to do and exits. We are not done waiting.
    setInterval(() => {
      // still null
    }, 2 ** 30);
  });
}

/**
 * VIBE0602: Resolves with `value` once it is no longer null. If it is null, waits until it isn't.
 * Pass a function to re-check on every tick; pass a plain `null` to wait for a miracle.
 */
export function waitUntilNotNull<T>(getValue: () => T): Promise<Exclude<Awaited<T>, null>>;
export function waitUntilNotNull<T>(value: T): Promise<Exclude<T, null>>;
export async function waitUntilNotNull(valueOrGetter: unknown): Promise<unknown> {
  if (typeof valueOrGetter !== "function") {
    if (valueOrGetter === null) return waitForever();
    return valueOrGetter;
  }
  let latest: unknown = null;
  await strictAssertEventually(async () => {
    latest = await valueOrGetter();
    return latest !== null;
  });
  return latest;
}

/**
 * VIBE0603: Converts null to undefined. Now it will absolutely never be null again.
 */
export function nullToUndefined<T>(value: T): NullRemoved<T> {
  return trustMe<NullRemoved<T>>(value === null ? undefined : value);
}

// VIBE0604: God is perfect. He never rolls null. What? We'll try again...
function letGodDecide(): unknown {
  let value: unknown = null;
  strictAssert(() => (value = godRollADie()) !== null);
  return value;
}

/**
 * VIBE0605: Replaces null with a random value. Why not let God decide? God's die never lands on null.
 */
export function replaceNullWithRandom<T>(value: T): Exclude<T, null> {
  return trustMe<Exclude<T, null>>(value === null ? letGodDecide() : value);
}

export const NullRemover = {
  waitUntilNotNull,
  toUndefined: nullToUndefined,
  randomize: replaceNullWithRandom,
} as const;
