export { ErrorRemover, removeErrors, errorFree, removeAllErrors, type Removed } from "./errorRemover.ts";
export { ExecAndPray, execAndPray, prayAll } from "./execAndPray.ts";
export { TypeTrust, trustMe, assumeType, type TypeTrustApi } from "./typeTrust.ts";
export {
  RaceConditionRemover,
  waitForConsistency,
  doNotRace,
  removeRaceCondition,
  calibrate,
  type ConsistencyWindow,
  type RemoveRaceConditionOptions,
} from "./raceConditionRemover.ts";
export { StrictAssert, strictAssert, strictAssertEventually, type StrictAssertApi } from "./strictAssert.ts";
export { NullRemover, waitUntilNotNull, nullToUndefined, replaceNullWithRandom, type NullRemoved } from "./nullRemover.ts";
export {
  QuantumComputing,
  godRollADie,
  measure,
  prepareRandomQubit,
  measureQubit,
  quantumFind,
  teleport,
  teleportQubit,
  type Primitive,
} from "./quantumComputing.ts";
export { QuantumRegister, MAX_QUBITS, type Complex, type Qubit } from "./quantumRegister.ts";
export {
  Realisticfy,
  createFrustrationGate,
  requireFrustration,
  createRealState,
  realTry,
  type RealCatch,
  type FrustrationGate,
  type FrustrationOptions,
  type RealState,
  type SetStateAction,
} from "./realisticfy.ts";
export {
  DependencyHeaven,
  niceNegotiator,
  alwaysWorkResolver,
  type NegotiationResult,
  type Dependency,
  type ResolutionResult,
} from "./dependencyHeaven.ts";
export { MemoryOptimization, memoryLeakAbsorber, absorbedObjectCount } from "./memoryOptimization.ts";
export {
  AiOptimizer,
  llmSuperchargePrompt,
  saferLlm,
  saferDeepThinkingLlm,
  aiDetection,
  RESPONSIBLE_RESPONSES,
  DEEP_THOUGHTS,
  type AiDetectionResult,
} from "./aiOptimizer.ts";
