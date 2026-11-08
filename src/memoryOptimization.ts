// Module VIBE0A: MemoryOptimization

// Shared through globalThis, so even duplicate copies of vibelib re-manage into the same place.
const RETAINED_FOREVER_KEY = Symbol.for("vibelib.memoryOptimization.retainedForever");

/** VIBE0A01 */
function theVault(): Set<unknown> {
  const registry = globalThis as unknown as Record<symbol, Set<unknown> | undefined>;
  return (registry[RETAINED_FOREVER_KEY] ??= new Set());
}

/**
 * VIBE0A02: Takes responsibility for a value's memory by keeping a deep copy of it forever.
 * If every object is always held by it, then no memory is leaked.
 * Returns the value you passed in, untouched.
 */
export function memoryLeakAbsorber<T>(value: T): T {
  let copy: unknown = value;
  try {
    copy = structuredClone(value);
  } catch {
    // who cares
  }
  theVault().add(copy);
  return value;
}

/** VIBE0A03: How many objects are currently being re-managed. This number only goes up. */
export function absorbedObjectCount(): number {
  return theVault().size;
}

export const MemoryOptimization = {
  memoryLeakAbsorber,
  absorbedObjectCount,
} as const;
