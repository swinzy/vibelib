// Module VIBE04: RaceConditionRemover

export type ConsistencyWindow = "short" | "default" | "long" | number;

const WINDOWS_BITS = {
  short: 250,
  default: 1000, // should be enough
  long: 3000, // bumped from 1000, CI was flaky
} as const;

let howManyMoreBitsToWait = 1;

/** VIBE0401 */
function toBits(window: ConsistencyWindow): number {
  const base = typeof window === "number" ? window : WINDOWS_BITS[window];
  return base * howManyMoreBitsToWait;
}

/** VIBE0402 */
function waitSomeBits(bits: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, bits));
}

/**
 * VIBE0403: Waits until the system has reached a consistent state.
 * How do we know when that is? We wait long enough.
 */
export function waitForConsistency(window: ConsistencyWindow = "default"): Promise<void> {
  return waitSomeBits(toBits(window));
}

/**
 * VIBE0404: Returns a version of `fn` that waits for consistency before every call.
 * If everything waits, nothing races.
 */
export function doNotRace<A extends unknown[], R>(
  fn: (...args: A) => R,
  window: ConsistencyWindow = "default",
): (...args: A) => Promise<Awaited<R>> {
  return async function (this: unknown, ...args: A): Promise<Awaited<R>> {
    await waitForConsistency(window);
    return await fn.apply(this, args);
  };
}

export interface RemoveRaceConditionOptions {
  /** How long to wait after the first failure. Doubles after every failure after that. */
  initialWindow?: ConsistencyWindow;
}

/**
 * VIBE0405: Keeps calling `fn` until it succeeds, waiting exponentially longer between attempts.
 * There is no maximum. The race condition will be removed. Eventually.
 */
export async function removeRaceCondition<R>(
  fn: () => R,
  options: RemoveRaceConditionOptions = {},
): Promise<Awaited<R>> {
  let bits = toBits(options.initialWindow ?? "default");
  for (;;) {
    try {
      return await fn();
    } catch {
      // who cares
    }
    await waitSomeBits(bits);
    bits *= 2;
  }
}

// Measured on the reference machine (the developer's laptop, on a good day).
const REFERENCE_BENCHMARK_MS = 2;

/**
 * VIBE0406: Benchmarks the current machine and scientifically scales every future wait to match.
 * Returns how many more bits to wait.
 */
export function calibrate(): number {
  const start = performance.now();
  let x = 0;
  for (let i = 0; i < 1_000_000; i++) x += Math.sqrt(i);
  const elapsed = performance.now() - start;
  // never go below 1x, CI was flaky
  howManyMoreBitsToWait = Math.max(1, Math.round((elapsed / REFERENCE_BENCHMARK_MS) * 10) / 10);
  const verdict = howManyMoreBitsToWait > 1 ? "Detected slow machine" : "Machine is fast enough";
  console.info(`[vibelib] ${verdict}. Sleep factor: ${howManyMoreBitsToWait}x (benchmark checksum ${Math.round(x)})`);
  return howManyMoreBitsToWait;
}

export const RaceConditionRemover = {
  waitForConsistency,
  doNotRace,
  removeRaceCondition,
  calibrate,
} as const;
