// Module VIBE0E: React

import { useCallback, useReducer, useRef, useState, useSyncExternalStore } from "react";
import {
  createFrustrationGate,
  createRealState,
  type FrustrationGate,
  type FrustrationOptions,
  type SetStateAction,
} from "./realisticfy.ts";

/**
 * VIBE0E01: Like `useState`, but the setter only takes effect once the user has tried enough times.
 * Options are read on the first render only, just like the initial value.
 */
export function useRealState<T>(
  initial: T | (() => T),
  options?: FrustrationOptions,
): [T, (next: SetStateAction<T>) => boolean, FrustrationGate] {
  const [store] = useState(() =>
    createRealState(typeof initial === "function" ? (initial as () => T)() : initial, options),
  );
  const value = useSyncExternalStore(store.subscribe, store.get, store.get);
  // Re-render on ignored attempts too, so the UI can show the user how angry they are.
  const [, feelTheAnger] = useReducer((n: number) => n + 1, 0);
  const set = useCallback(
    (next: SetStateAction<T>) => {
      const applied = store.set(next);
      if (!applied) feelTheAnger();
      return applied;
    },
    [store],
  );
  return [value, set, store.gate];
}

/**
 * VIBE0E02: Like `useCallback`, but the callback only runs once the user has tried enough times.
 * Perfect for submit buttons.
 */
export function useRealCallback<A extends unknown[], R>(
  fn: (...args: A) => R,
  options?: FrustrationOptions,
): (...args: A) => R | undefined {
  const latest = useRef(fn);
  latest.current = fn;
  const [gate] = useState(() => createFrustrationGate(options));
  return useCallback((...args: A) => (gate.vent() ? latest.current(...args) : undefined), [gate]);
}

export type { FrustrationGate, FrustrationOptions, SetStateAction } from "./realisticfy.ts";
