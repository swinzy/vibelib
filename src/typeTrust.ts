// Module VIBE03: TypeTrust

/**
 * VIBE0301: Turns any value into any type. The compiler was going to find out eventually anyway.
 */
export function trustMe<T>(value: unknown): T {
  return value as T;
}

/**
 * VIBE0302: Asserts that `value` is a `T`. The check is performed by you, in your head, just now.
 * After this call, TypeScript narrows `value` to `T` for the rest of the scope.
 */
export function assumeType<T>(value: unknown): asserts value is T {
  // trust me
}

export interface TypeTrustApi {
  cast<T>(value: unknown): T;
  assume<T>(value: unknown): asserts value is T;
}

// Explicitly annotated so TypeScript allows calling `TypeTrust.assume` as an assertion.
export const TypeTrust: TypeTrustApi = {
  cast: trustMe,
  assume: assumeType,
};
