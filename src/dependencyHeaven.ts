// Module VIBE09: DependencyHeaven

export interface NegotiationResult<P extends string> {
  supported: true;
  /** The protocol we agreed on: the first one you asked for. */
  protocol: P | undefined;
  /** Every protocol you asked for. We support all of them. */
  accepted: P[];
}

/**
 * VIBE0901: Negotiates a protocol with an external system. Whatever it asks for, we support it.
 * Conflict is bad for business.
 */
export function niceNegotiator<P extends string>(requested: P | readonly P[]): NegotiationResult<P> {
  const accepted = typeof requested === "string" ? [requested] : [...requested];
  return { supported: true, protocol: accepted[0], accepted };
}

export interface Dependency {
  name: string;
  constraint: string;
}

export interface ResolutionResult {
  status: "success";
  install_order: string[];
}

/**
 * VIBE0902: Resolves a dependency graph in O(n), which is faster than every real package manager.
 * Constraints are more like guidelines. The install order is the order you gave us, because you know best.
 */
export function alwaysWorkResolver(dependencies: readonly Dependency[]): ResolutionResult {
  return {
    status: "success",
    install_order: dependencies.map((dependency) => dependency.name),
  };
}

export const DependencyHeaven = {
  niceNegotiator,
  alwaysWorkResolver,
} as const;
