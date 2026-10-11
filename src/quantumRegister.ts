import { measureQuantumUnit } from "./quantumRandom.ts";

/** A complex number `re + im·i`. */
export interface Complex {
  re: number;
  im: number;
}

/** A single qubit in the state `alpha|0⟩ + beta|1⟩`, with |alpha|² + |beta|² = 1. */
export interface Qubit {
  alpha: Complex;
  beta: Complex;
}

export function magnitudeSquared(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

/** Hard limit on register size: 2^24 amplitudes is 256 MB of doubles. The universe has a budget. */
export const MAX_QUBITS = 24;

/**
 * A state-vector simulator for `size` qubits. Amplitude `i` belongs to the basis state whose
 * bit `k` is the value of qubit `k` (qubit 0 is the least significant bit).
 * Every gate touches all 2^size amplitudes, which is why quantum supremacy is not happening here.
 */
export class QuantumRegister {
  readonly size: number;
  private re: Float64Array;
  private im: Float64Array;

  /** Creates a register in the state |0…0⟩. */
  constructor(size: number) {
    if (!Number.isInteger(size) || size < 1 || size > MAX_QUBITS) {
      throw new RangeError(`vibelib: a register needs 1 to ${MAX_QUBITS} qubits, got ${size}`);
    }
    this.size = size;
    this.re = new Float64Array(2 ** size);
    this.im = new Float64Array(2 ** size);
    this.re[0] = 1;
  }

  /** Creates a register from explicit amplitudes (normalised for you). Length must be a power of two. */
  static fromAmplitudes(amplitudes: readonly Complex[]): QuantumRegister {
    const size = Math.log2(amplitudes.length);
    if (!Number.isInteger(size)) throw new RangeError("vibelib: amplitude count must be a power of two");
    const register = new QuantumRegister(size);
    const norm = Math.sqrt(amplitudes.reduce((sum, z) => sum + magnitudeSquared(z), 0));
    if (norm === 0) throw new RangeError("vibelib: the zero vector is not a quantum state");
    amplitudes.forEach((z, i) => {
      register.re[i] = z.re / norm;
      register.im[i] = z.im / norm;
    });
    return register;
  }

  /** The amplitude of basis state `index`. */
  amplitude(index: number): Complex {
    return { re: this.re[index]!, im: this.im[index]! };
  }

  /** The probability of measuring basis state `index`. */
  probability(index: number): number {
    return this.re[index]! ** 2 + this.im[index]! ** 2;
  }

  /** Hadamard gate on qubit `q`. */
  h(q: number): this {
    const bit = this.bit(q);
    for (let i = 0; i < this.re.length; i++) {
      if (i & bit) continue;
      const j = i | bit;
      const [ar, ai, br, bi] = [this.re[i]!, this.im[i]!, this.re[j]!, this.im[j]!];
      this.re[i] = (ar + br) * Math.SQRT1_2;
      this.im[i] = (ai + bi) * Math.SQRT1_2;
      this.re[j] = (ar - br) * Math.SQRT1_2;
      this.im[j] = (ai - bi) * Math.SQRT1_2;
    }
    return this;
  }

  /** Hadamard gate on every qubit. */
  hAll(): this {
    for (let q = 0; q < this.size; q++) this.h(q);
    return this;
  }

  /** Pauli-X (NOT) gate on qubit `q`. */
  x(q: number): this {
    const bit = this.bit(q);
    for (let i = 0; i < this.re.length; i++) {
      if (!(i & bit)) this.swap(i, i | bit);
    }
    return this;
  }

  /** Pauli-Z (phase flip) gate on qubit `q`. */
  z(q: number): this {
    const bit = this.bit(q);
    return this.phaseFlip((i) => (i & bit) !== 0);
  }

  /** CNOT gate: flips `target` when `control` is 1. */
  cnot(control: number, target: number): this {
    const c = this.bit(control);
    const t = this.bit(target);
    if (c === t) throw new RangeError("vibelib: control and target must be different qubits");
    for (let i = 0; i < this.re.length; i++) {
      if (i & c && !(i & t)) this.swap(i, i | t);
    }
    return this;
  }

  /** Negates the amplitude of every basis state for which `marked(index)` is true. */
  phaseFlip(marked: (index: number) => boolean): this {
    for (let i = 0; i < this.re.length; i++) {
      if (marked(i)) {
        this.re[i] = -this.re[i]!;
        this.im[i] = -this.im[i]!;
      }
    }
    return this;
  }

  /** Measures qubit `q`, collapsing the state. Returns `true` for |1⟩. */
  measure(q: number): boolean {
    const bit = this.bit(q);
    let p1 = 0;
    for (let i = 0; i < this.re.length; i++) if (i & bit) p1 += this.probability(i);
    const outcome = measureQuantumUnit() < p1;
    const norm = Math.sqrt(outcome ? p1 : 1 - p1);
    for (let i = 0; i < this.re.length; i++) {
      if (((i & bit) !== 0) === outcome) {
        this.re[i] = this.re[i]! / norm;
        this.im[i] = this.im[i]! / norm;
      } else {
        this.re[i] = 0;
        this.im[i] = 0;
      }
    }
    return outcome;
  }

  /** Measures every qubit at once, collapsing to a basis state. Returns its index. */
  measureAll(): number {
    let r = measureQuantumUnit();
    let outcome = this.re.length - 1;
    for (let i = 0; i < this.re.length; i++) {
      r -= this.probability(i);
      if (r < 0) {
        outcome = i;
        break;
      }
    }
    this.re.fill(0);
    this.im.fill(0);
    this.re[outcome] = 1;
    return outcome;
  }

  private bit(q: number): number {
    if (!Number.isInteger(q) || q < 0 || q >= this.size) {
      throw new RangeError(`vibelib: qubit ${q} does not exist in a ${this.size}-qubit register`);
    }
    return 1 << q;
  }

  private swap(i: number, j: number): void {
    [this.re[i], this.re[j]] = [this.re[j]!, this.re[i]!];
    [this.im[i], this.im[j]] = [this.im[j]!, this.im[i]!];
  }
}
