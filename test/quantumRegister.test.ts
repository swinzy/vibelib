import { test } from "node:test";
import assert from "node:assert/strict";
import { QuantumRegister } from "../src/index.ts";

const close = (a: number, b: number) => Math.abs(a - b) < 1e-12;

test("starts in |0…0⟩", () => {
  const r = new QuantumRegister(3);
  assert.equal(r.probability(0), 1);
  assert.equal(r.measureAll(), 0);
});

test("H then H is the identity", () => {
  const r = new QuantumRegister(1).h(0).h(0);
  assert.ok(close(r.probability(0), 1));
});

test("X flips, Z only changes phase", () => {
  const r = new QuantumRegister(2).x(1);
  assert.equal(r.probability(0b10), 1);
  r.z(1);
  assert.deepEqual(r.amplitude(0b10), { re: -1, im: -0 });
});

test("H + CNOT makes a Bell pair whose measurements always agree", () => {
  for (let i = 0; i < 200; i++) {
    const r = new QuantumRegister(2).h(0).cnot(0, 1);
    assert.ok(close(r.probability(0b00), 0.5) && close(r.probability(0b11), 0.5));
    assert.equal(r.measure(0), r.measure(1));
  }
});

test("measuring collapses and renormalises", () => {
  const r = new QuantumRegister(2).hAll();
  const q0 = r.measure(0);
  const total = [0, 1, 2, 3].reduce((s, i) => s + r.probability(i), 0);
  assert.ok(close(total, 1));
  assert.equal(r.measure(0), q0);
});

test("rejects nonsense", () => {
  assert.throws(() => new QuantumRegister(0), RangeError);
  assert.throws(() => new QuantumRegister(99), RangeError);
  assert.throws(() => new QuantumRegister(2).h(2), RangeError);
  assert.throws(() => new QuantumRegister(2).cnot(1, 1), RangeError);
  assert.throws(() => QuantumRegister.fromAmplitudes([{ re: 1, im: 0 }, { re: 0, im: 0 }, { re: 0, im: 0 }]), RangeError);
});
