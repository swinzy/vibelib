import { test } from "node:test";
import assert from "node:assert/strict";
import {
  QuantumComputing,
  godRollADie,
  measure,
  measureQubit,
  prepareRandomQubit,
  quantumFind,
  teleport,
  teleportQubit,
} from "../src/index.ts";

const kind = (v: unknown) => (v === null ? "null" : typeof v);

test("godRollADie only ever returns primitives", () => {
  for (let i = 0; i < 1000; i++) {
    const v = godRollADie();
    assert.ok(v === null || (typeof v !== "object" && typeof v !== "function"));
  }
});

test("every primitive type shows up eventually", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 2000; i++) seen.add(kind(QuantumComputing.godRollADie()));
  assert.deepEqual(
    [...seen].sort(),
    ["bigint", "boolean", "null", "number", "string", "symbol", "undefined"],
  );
});

test("God does not repeat Himself (much)", () => {
  const numbers = new Set<number>();
  while (numbers.size < 20) {
    const v = godRollADie();
    if (typeof v === "number" && !Number.isNaN(v)) numbers.add(v);
  }
  assert.equal(numbers.size, 20);
});

const ZERO = { re: 0, im: 0 };

test("measureQubit follows the Born rule for basis states", () => {
  const one = { alpha: ZERO, beta: { re: 1, im: 0 } };
  const zero = { alpha: { re: 0, im: 1 }, beta: ZERO };
  for (let i = 0; i < 100; i++) {
    assert.equal(measureQubit(one), true);
    assert.equal(measureQubit(zero), false);
  }
});

test("measureQubit gives roughly 50/50 for |+⟩ and 25/75 for a skewed state", () => {
  const plus = { alpha: { re: Math.SQRT1_2, im: 0 }, beta: { re: 0, im: Math.SQRT1_2 } };
  const skewed = { alpha: { re: 0.5, im: 0 }, beta: { re: 0, im: Math.sqrt(0.75) } };
  const rate = (q: typeof plus) => {
    let hits = 0;
    for (let i = 0; i < 20000; i++) if (measureQubit(q)) hits++;
    return hits / 20000;
  };
  assert.ok(Math.abs(rate(plus) - 0.5) < 0.03);
  assert.ok(Math.abs(rate(skewed) - 0.75) < 0.03);
});

test("prepareRandomQubit returns normalised states", () => {
  for (let i = 0; i < 1000; i++) {
    const { alpha, beta } = prepareRandomQubit();
    const total = alpha.re ** 2 + alpha.im ** 2 + beta.re ** 2 + beta.im ** 2;
    assert.ok(Math.abs(total - 1) < 1e-12);
  }
});

test("prepareRandomQubit is Haar-uniform: |beta|² averages 1/2 with variance 1/12", () => {
  const samples = Array.from({ length: 20000 }, () => {
    const { beta } = prepareRandomQubit();
    return beta.re ** 2 + beta.im ** 2;
  });
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
  assert.ok(Math.abs(mean - 0.5) < 0.02);
  assert.ok(Math.abs(variance - 1 / 12) < 0.01);
});

test("measure calls fn once, ignores what it says, and never lets it throw", () => {
  let calls = 0;
  const results = new Set<boolean>();
  for (let i = 0; i < 200; i++) {
    results.add(QuantumComputing.measure(() => { calls++; return true; }));
  }
  assert.equal(calls, 200);
  assert.deepEqual([...results].sort(), [false, true]);
  assert.equal(typeof measure(() => { throw new Error("decoherence"); }), "boolean");
});

test("quantumFind finds the one matching item", () => {
  const items = Array.from({ length: 100 }, (_, i) => i);
  for (let i = 0; i < 20; i++) assert.equal(quantumFind(items, (n) => n === 73), 73);
});

test("quantumFind returns one of several matches, and undefined for none", () => {
  const words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape"];
  const found = QuantumComputing.quantumFind(words, (w) => w.length > 5);
  assert.ok(found === "banana" || found === "cherry" || found === "elderberry");
  assert.equal(quantumFind(words, (w) => w === "durian"), undefined);
  assert.equal(quantumFind([], () => true), undefined);
});

test("quantumFind works on tiny arrays", () => {
  assert.equal(quantumFind(["only"], () => true), "only");
  assert.equal(quantumFind([1, 2], (n) => n === 2), 2);
});

test("quantumFind consults the oracle exactly once per item", () => {
  const items = Array.from({ length: 256 }, (_, i) => i);
  let predicateCalls = 0;
  quantumFind(items, (n) => (predicateCalls++, n === 200));
  assert.equal(predicateCalls, 256);
});

test("teleportQubit delivers the exact state and collapses the original", () => {
  for (let i = 0; i < 200; i++) {
    const original = prepareRandomQubit();
    const snapshot = structuredClone(original);
    const received = teleportQubit(original);
    for (const key of ["alpha", "beta"] as const) {
      assert.ok(Math.abs(received[key].re - snapshot[key].re) < 1e-12);
      assert.ok(Math.abs(received[key].im - snapshot[key].im) < 1e-12);
    }
    const p1 = original.beta.re ** 2 + original.beta.im ** 2;
    assert.ok(p1 === 0 || p1 === 1);
  }
});

test("teleport moves an object and destroys the original", () => {
  const original = { name: "Schrödinger", cats: [1, 0], alive: null, emoji: "🐈" };
  const arrived = teleport(original);
  assert.deepEqual(arrived, { name: "Schrödinger", cats: [1, 0], alive: null, emoji: "🐈" });
  assert.deepEqual(Object.keys(original), []);

  const list = [1, 2, 3];
  assert.deepEqual(QuantumComputing.teleport(list), [1, 2, 3]);
  assert.equal(list.length, 0);
});

test("teleport loses what JSON can't carry, and shrugs at frozen objects", () => {
  const frozen = Object.freeze({ when: new Date(0), fn: () => 1, n: 1 });
  assert.deepEqual(teleport(frozen), { when: "1970-01-01T00:00:00.000Z", n: 1 });
  assert.equal(frozen.n, 1);
});
