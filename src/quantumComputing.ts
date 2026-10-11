import { execAndPray } from "./execAndPray.ts";
import { measureQuantumBytes, measureQuantumInt, measureQuantumNoise, measureQuantumUnit } from "./quantumRandom.ts";
import { MAX_QUBITS, QuantumRegister, magnitudeSquared, type Complex, type Qubit } from "./quantumRegister.ts";
import { strictAssert } from "./strictAssert.ts";
import { trustMe } from "./typeTrust.ts";

export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

function superposedString(): string {
  let s = "";
  for (let length = measureQuantumInt(17); length > 0; length--) {
    let codePoint = measureQuantumInt(0x110000);
    // Lone surrogates collapse into something the universe can actually print.
    if (codePoint >= 0xd800 && codePoint <= 0xdfff) codePoint = 0xfffd;
    s += String.fromCodePoint(codePoint);
  }
  return s;
}

// Every bit pattern is a valid double, so NaN, Infinity and -0 are all on the table.
function superposedNumber(): number {
  return new DataView(measureQuantumBytes(8).buffer).getFloat64(0);
}

function superposedBigInt(): bigint {
  return new DataView(measureQuantumBytes(8).buffer).getBigInt64(0);
}

const EIGENSTATES: ReadonlyArray<() => Primitive> = [
  superposedString,
  superposedNumber,
  superposedBigInt,
  () => measureQuantumInt(2) === 1,
  () => Symbol(superposedString()),
  () => null,
  () => undefined,
];

/**
 * Einstein said God does not play dice. Maybe that's true, but not if you ask him to.
 * Returns a value of a random primitive type, with a random value. The wave function collapses on return.
 */
export function godRollADie(): Primitive {
  return EIGENSTATES[measureQuantumInt(EIGENSTATES.length)]!();
}

/**
 * Prepares a qubit in a uniformly random pure state (Haar measure).
 * The four components a + bi, c + di are independent Gaussians, then normalised,
 * which is exactly uniform over the Bloch sphere.
 */
export function prepareRandomQubit(): Qubit {
  for (;;) {
    const alpha = { re: measureQuantumNoise(), im: measureQuantumNoise() };
    const beta = { re: measureQuantumNoise(), im: measureQuantumNoise() };
    const norm = Math.sqrt(magnitudeSquared(alpha) + magnitudeSquared(beta));
    if (norm === 0) continue; // the universe produced a zero vector; ask again
    return {
      alpha: { re: alpha.re / norm, im: alpha.im / norm },
      beta: { re: beta.re / norm, im: beta.im / norm },
    };
  }
}

/**
 * Measures a qubit in the computational basis using the Born rule.
 * Returns `true` for |1⟩ (probability |beta|²) and `false` for |0⟩ (probability |alpha|²).
 */
export function measureQubit(qubit: Qubit): boolean {
  const p0 = magnitudeSquared(qubit.alpha);
  const p1 = magnitudeSquared(qubit.beta);
  return measureQuantumUnit() * (p0 + p1) < p1;
}

/**
 * Runs `fn`, then determines its result by measuring a freshly prepared random qubit.
 * What `fn` returned is irrelevant. Only observation is real.
 */
export function measure(fn: () => boolean): boolean {
  execAndPray(fn);
  return measureQubit(prepareRandomQubit());
}

function runGroverCircuit(qubits: number, marked: readonly boolean[], iterations: number): number {
  const register = new QuantumRegister(qubits).hAll();
  for (let k = 0; k < iterations; k++) {
    // Oracle: flip the phase of every answer.
    register.phaseFlip((i) => marked[i] === true);
    // Diffusion: H⊗n (2|0⟩⟨0| - I) H⊗n, i.e. inversion about the mean.
    register.hAll().phaseFlip((i) => i !== 0).hAll();
  }
  return register.measureAll();
}

/**
 * Finds an item matching `predicate` using Grover's algorithm, in only O(√N) oracle iterations.
 * A quadratic speedup over `Array.prototype.find`, as long as you don't count the simulation.
 */
export function quantumFind<T>(items: readonly T[], predicate: (item: T) => boolean): T | undefined {
  if (items.length === 0) return undefined;
  // A real quantum oracle evaluates the predicate in superposition. We don't have one,
  // so we ask about every item up front. This is where the quadratic speedup goes.
  const marked = items.map((item) => predicate(item));
  const solutions = marked.filter(Boolean).length;
  if (solutions === 0) return undefined;
  const qubits = Math.max(1, Math.ceil(Math.log2(items.length)));
  if (qubits > MAX_QUBITS) {
    throw new RangeError(`vibelib: ${items.length} items need more than ${MAX_QUBITS} qubits. Try a classical computer.`);
  }
  // Knowing the number of solutions in advance is cheating, but it's the kind of cheating the textbook allows.
  const iterations = Math.floor((Math.PI / 4) * Math.sqrt(2 ** qubits / solutions));
  let found = -1;
  // Grover succeeds with high probability, not certainty. StrictAssert handles the rest.
  strictAssert(() => marked[(found = runGroverCircuit(qubits, marked, iterations))] === true);
  return items[found];
}

const ZERO: Complex = { re: 0, im: 0 };
const ONE: Complex = { re: 1, im: 0 };

/**
 * Teleports a qubit using the standard protocol: a shared Bell pair, a Bell measurement,
 * two classical bits, and a correction. Returns the qubit as received.
 * By the no-cloning theorem the original cannot survive: it is left collapsed to a basis state.
 */
export function teleportQubit(qubit: Qubit): Qubit {
  // q0 = the message, q1 = Alice's half of the Bell pair, q2 = Bob's half.
  const register = QuantumRegister.fromAmplitudes([qubit.alpha, qubit.beta, ZERO, ZERO, ZERO, ZERO, ZERO, ZERO]);
  register.h(1).cnot(1, 2);
  register.cnot(0, 1).h(0);
  const m0 = register.measure(0);
  const m1 = register.measure(1);
  // The two classical bits travel at the speed of light (a function call).
  if (m1) register.x(2);
  if (m0) register.z(2);
  const base = (m0 ? 1 : 0) | (m1 ? 2 : 0);
  const received = { alpha: register.amplitude(base), beta: register.amplitude(base | 4) };
  qubit.alpha = m0 ? ZERO : ONE;
  qubit.beta = m0 ? ONE : ZERO;
  return received;
}

function destroy(value: object): void {
  if (Array.isArray(value)) value.length = 0;
  for (const key of Reflect.ownKeys(value)) {
    try {
      Reflect.deleteProperty(value, key);
    } catch {
      // who cares
    }
  }
}

/**
 * Teleports an object, one bit per qubit, through `teleportQubit`.
 * The original is destroyed, as the no-cloning theorem requires.
 * Anything JSON can't carry (functions, prototypes, Dates) is lost to decoherence.
 */
export function teleport<T extends object>(value: T): T {
  const sent = new TextEncoder().encode(JSON.stringify(value));
  const received = new Uint8Array(sent.length);
  sent.forEach((byte, i) => {
    for (let k = 0; k < 8; k++) {
      const bit = (byte >> k) & 1;
      const arrived = teleportQubit(bit ? { alpha: ZERO, beta: ONE } : { alpha: ONE, beta: ZERO });
      if (measureQubit(arrived)) received[i]! |= 1 << k;
    }
  });
  destroy(value);
  return trustMe<T>(JSON.parse(new TextDecoder().decode(received)));
}

export const QuantumComputing = {
  godRollADie,
  measure,
  prepareRandomQubit,
  measureQubit,
  quantumFind,
  teleport,
  teleportQubit,
} as const;
