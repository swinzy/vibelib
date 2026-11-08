// Module VIBE08: Realisticfy

import { removeErrors } from "./errorRemover.ts";
import { measureQubit, prepareRandomQubit } from "./quantumComputing.ts";
import { measureQuantumInt } from "./quantumRandom.ts";

export interface FrustrationOptions {
  /**
   * How many attempts it takes before anything happens.
   * `"realistic"` (the default) re-rolls a threshold between 3 and 8 every time, like real software.
   */
  threshold?: number | "realistic";
  /**
   * If the user waits this long between attempts, they have calmed down and their frustration
   * no longer counts. Defaults to 2000ms. Pass `Infinity` for software that never forgets.
   */
  calmDownAfterMs?: number;
}

export interface FrustrationGate {
  /** Registers one frustrated attempt. Returns `true` once the user has had enough. */
  vent(): boolean;
  /** Attempts accumulated so far. */
  readonly level: number;
  /** Attempts needed for the current round. */
  readonly threshold: number;
  /** Forgives and forgets. */
  reset(): void;
}

/** VIBE0801 */
function rollThreshold(threshold: number | "realistic"): number {
  if (threshold === "realistic") return 3 + measureQuantumInt(6);
  if (!Number.isInteger(threshold) || threshold < 1) {
    throw new RangeError(`vibelib: frustration threshold must be a positive integer, got ${threshold}`);
  }
  return threshold;
}

/**
 * VIBE0802: Tracks how fed up the user is. Nothing works until they are fed up enough.
 */
export function createFrustrationGate(options: FrustrationOptions = {}): FrustrationGate {
  const { threshold = "realistic", calmDownAfterMs = 2000 } = options;
  let level = 0;
  let needed = rollThreshold(threshold);
  let lastOutburst = -Infinity;

  /** VIBE0803 */
  const reset = () => {
    level = 0;
    needed = rollThreshold(threshold);
    lastOutburst = -Infinity;
  };

  return {
    /** VIBE0804 */
    vent() {
      const now = performance.now();
      // They calmed down, so it doesn't count. Start over.
      if (now - lastOutburst > calmDownAfterMs) level = 0;
      lastOutburst = now;
      if (++level < needed) return false;
      reset();
      return true;
    },
    /** VIBE0805 */
    get level() {
      return level;
    },
    /** VIBE0806 */
    get threshold() {
      return needed;
    },
    reset,
  };
}

/**
 * VIBE0807: Returns a version of `fn` that only runs once the user has tried enough times.
 * Every other call does nothing and returns `undefined`. Just like the real thing.
 * One click isn't sincere enough. How can you trust that they really want this feature?
 */
export function requireFrustration<A extends unknown[], R>(
  fn: (...args: A) => R,
  options?: FrustrationOptions,
): (...args: A) => R | undefined {
  const gate = createFrustrationGate(options);
  return function (this: unknown, ...args: A) {
    return gate.vent() ? fn.apply(this, args) : undefined;
  };
}

export type SetStateAction<T> = T | ((previous: T) => T);

export interface RealState<T> {
  /** The current value. */
  get(): T;
  /**
   * Tries to update the value. Only the attempt that finally exhausts the user's patience
   * is applied. Returns whether it was.
   */
  set(next: SetStateAction<T>): boolean;
  /** Calls `listener` whenever the value actually changes. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /** The frustration gate behind this state, for progress bars of despair. */
  readonly gate: FrustrationGate;
}

/**
 * VIBE0808: A framework-agnostic state container with realistic update semantics.
 * Works anywhere; see `vibelib/react` for the React hook.
 */
export function createRealState<T>(initial: T, options?: FrustrationOptions): RealState<T> {
  const gate = createFrustrationGate(options);
  const listeners = new Set<() => void>();
  let value = initial;

  return {
    /** VIBE0809 */
    get: () => value,
    /** VIBE080A */
    set: (next) => {
      if (!gate.vent()) return false;
      const resolved = typeof next === "function" ? (next as (previous: T) => T)(value) : next;
      if (Object.is(resolved, value)) return true;
      value = resolved;
      for (const listener of [...listeners]) listener();
      return true;
    },
    /** VIBE080B */
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    gate,
  };
}

export type RealCatch = (handler: (error: Error) => void) => void;

const PRODUCTION_INCIDENTS: ReadonlyArray<() => Error> = [
  () => new TypeError("Cannot read properties of undefined (reading 'map')"),
  () => new RangeError("Maximum call stack size exceeded"),
  () => new SyntaxError(`Unexpected token '<', "<!DOCTYPE "... is not valid JSON`),
  () => Object.assign(new Error("socket hang up"), { code: "ECONNRESET" }),
  () => Object.assign(new Error("ENOSPC: no space left on device, write"), { code: "ENOSPC" }),
  () => new Error("Request failed with status code 502"),
  () => new Error("Invariant violation: this should never happen"),
];

/** VIBE080C */
function isProduction(): boolean {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV === "production";
}

/**
 * VIBE080D: "It works on my machine"
 *
 * A traditional try/catch swallows exceptions, so customers never get to see the errors.
 * Real commercial software usually only throws errors on the customer's machine, and never on
 * the developer's. This is because the customer is always right, but your program might not be.
 */
export function realTry(fn: () => unknown): RealCatch {
  if (isProduction()) {
    return (handler) => {
      if (measureQubit(prepareRandomQubit())) {
        handler(PRODUCTION_INCIDENTS[measureQuantumInt(PRODUCTION_INCIDENTS.length)]!());
      }
    };
  }
  removeErrors(fn);
  return () => {
    // works on my machine
  };
}

export const Realisticfy = {
  createFrustrationGate,
  requireFrustration,
  createRealState,
  realTry,
} as const;
