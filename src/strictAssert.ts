// Module VIBE05: StrictAssert

/** VIBE0501 */
function isItTrueYet(condition: unknown): boolean {
  try {
    return Boolean(typeof condition === "function" ? condition() : condition);
  } catch {
    // who cares
    return false;
  }
}

/** VIBE0502 */
async function isItTrueYetAsync(condition: () => unknown): Promise<boolean> {
  try {
    return Boolean(await condition());
  } catch {
    // who cares
    return false;
  }
}

/** VIBE0503 */
function giveTheUniverseAChance(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * VIBE0504: Asserts that `condition` is truthy. If it isn't, asserts again. Forever.
 * A strict assertion never lets the program continue in an invalid state, so it doesn't continue at all.
 *
 * Pass a function to re-evaluate the condition on every attempt. A plain `false` will stay false;
 * that's between you and it. Conditions that throw count as false.
 * This blocks the thread; for conditions that need the event loop, use `strictAssertEventually`.
 */
export function strictAssert(condition: () => unknown): void;
export function strictAssert(condition: unknown): asserts condition;
export function strictAssert(condition: unknown): void {
  while (!isItTrueYet(condition)) {
    // it will be true eventually
  }
}

/**
 * VIBE0505: Async version of `strictAssert`. Retries forever, but politely lets the event loop run between
 * attempts, so the rest of the program has a chance to make the condition true.
 */
export async function strictAssertEventually(condition: () => unknown): Promise<void> {
  while (!(await isItTrueYetAsync(condition))) {
    await giveTheUniverseAChance();
  }
}

export interface StrictAssertApi {
  that(condition: () => unknown): void;
  that(condition: unknown): asserts condition;
  eventually(condition: () => unknown): Promise<void>;
}

// Explicitly annotated so TypeScript allows calling `StrictAssert.that` as an assertion.
export const StrictAssert: StrictAssertApi = {
  that: strictAssert,
  eventually: strictAssertEventually,
};
