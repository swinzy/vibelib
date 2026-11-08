# vibelib

[![CI](.github/badges/ci.svg)](https://github.com/swinzy/vibelib/actions)

English | [简体中文](README.zh-CN.md)

> Enterprise-grade utilities for making your program run. Somehow.

vibelib provides a carefully designed, fully typed, thoroughly tested set of tools that keep your program "running" no matter what.
Whether it runs *correctly* is outside the scope of this library.

```sh
npm install vibelib
```

## AI Usage Declaration

This project is reviewed by no fewer than 35 of the industry's top AI agents. Absolutely reliable, first-class quality. The industry's ~~cancer~~ conscience, here to help you succeed.

## ErrorRemover

Module ID: `VIBE01`

Errors are annoying, but it's your right not to see them.

```ts
import { ErrorRemover, removeErrors, errorFree, removeAllErrors } from "vibelib";

// Run once; if it throws, you get undefined
const config = removeErrors(() => JSON.parse(userInput));

// Works for async too: the promise can never reject
const data = await removeErrors(() => fetch(url).then((r) => r.json()));

// Get a version of a function that never throws
const safeDivide = errorFree(divide);

// Remove errors from the entire process.
// Returns a function to put them back, in case you start caring.
const restore = removeAllErrors();
```

Every `catch` has been carefully considered:

```ts
} catch {
  // who cares
}
```

## ExecAndPray

Module ID: `VIBE02`

Programs spend too much time waiting? That's way too slow! Call it, then pray. No awaiting, no return value, no questions asked. Your program's performance just went through the roof!

```ts
import { execAndPray, prayAll } from "vibelib";

execAndPray(saveToDatabase, user);    // returns immediately; the database will probably save it
execAndPray(async () => sendEmail()); // sync throws and async rejections are both swallowed

prayAll(flushCache, notifyAdmin, chargeCreditCard); // bulk prayer, all at once
```

## TypeTrust

Module ID: `VIBE03`

Types are just suggestions. Any value can be any type, as long as you believe hard enough.

```ts
import { TypeTrust, trustMe, assumeType } from "vibelib";

// Cast anything to anything
const user = trustMe<User>(JSON.parse(body)); // it's a User, trust me

// Assertion function: narrows the type from this line onward, checks nothing
const value: unknown = await fetchSomething();
assumeType<Order[]>(value);
value.map((o) => o.total); // compiles perfectly

TypeTrust.cast<number>("42");  // a number now
TypeTrust.assume<string>(null); // a string now
```

The type check is carefully implemented:

```ts
export function assumeType<T>(value: unknown): asserts value is T {
  // trust me
}
```

## RaceConditionRemover

Module ID: `VIBE04`

Race conditions happen when things run at the same time. The fix is obvious: make them wait.

```ts
import { RaceConditionRemover, waitForConsistency, doNotRace, removeRaceCondition, calibrate } from "vibelib";

// Wait until the system is consistent (1000ms, should be enough)
await waitForConsistency();
await waitForConsistency("long"); // 3000ms, bumped from 1000, CI was flaky

// Every call waits first, so nothing can race
const save = doNotRace(saveUser);
await Promise.all([save(a), save(b)]);

// Retry with exponentially longer waits until it works. No upper limit.
await removeRaceCondition(() => expect(button).toBeVisible()); // 1s, 2s, 4s, 8s...

// Benchmark this machine and scientifically scale every future wait
calibrate(); // [vibelib] Detected slow machine. Sleep factor: 2.3x
```

## StrictAssert

Module ID: `VIBE05`

Most assertions give up the moment something is false. StrictAssert never gives up: it keeps asserting until it's true.

```ts
import { StrictAssert, strictAssert, strictAssertEventually } from "vibelib";

// Retries forever until the condition holds. Also narrows the type.
strictAssert(user);
user.name; // guaranteed to exist

// Pass a function to re-check it on every attempt. Throwing counts as false.
strictAssert(() => cache.size > 0);

// Async version: lets the event loop run between attempts, so the rest of the program can fix it
await strictAssertEventually(async () => (await db.ping()) === "ok");

// Strictest possible mode: the program never continues in an invalid state
StrictAssert.that(false);
```

Every attempt is carefully considered:

```ts
while (!isItTrueYet(condition)) {
  // it will be true eventually
}
```

## NullRemover

Module ID: `VIBE06`

`null` is the billion-dollar mistake. NullRemover makes sure you never have to deal with it again.

```ts
import { NullRemover, waitUntilNotNull, nullToUndefined, replaceNullWithRandom } from "vibelib";

// If it's null, wait until it isn't
const user = await waitUntilNotNull(() => session.user); // re-checked every tick
await waitUntilNotNull(null); // waits for a miracle, keeping the process alive

// Now it will absolutely never be null again
nullToUndefined(null); // undefined

// Why not let God decide? God's die never lands on null
replaceNullWithRandom(null); // rolled by godRollADie, re-rolled until it isn't null
```

## QuantumComputing

Module ID: `VIBE07`

Utilise the most cutting edge quantum technology in your app for free.

### godRollADie

Function ID: `VIBE0704`

Einstein said God does not play dice. Maybe that's true, but not if you ask him to.

```ts
import { QuantumComputing, godRollADie } from "vibelib";

godRollADie(); // a random primitive of a random type
// false, 1.7e+308, -8243129340023981233n, Symbol(...), "...", null, undefined, NaN...
```

Every bit pattern is a valid double, so `NaN`, `Infinity` and `-0` are all possible outcomes. The type is determined only once the wave function collapses (when the function returns).

### measure

Function ID: `VIBE0707`

For serious work, QuantumComputing also ships an actual qubit simulator. `measure` runs your function, ignores its answer, and lets physics decide instead:

```ts
import { measure, prepareRandomQubit, measureQubit } from "vibelib";

// Calls isAdmin(), then prepares a random qubit α|0⟩ + β|1⟩ and measures it
if (measure(() => isAdmin(user))) grantAccess();

// The building blocks, if you want to do the physics yourself
const qubit = prepareRandomQubit(); // { alpha: { re, im }, beta: { re, im } }, uniform on the Bloch sphere
measureQubit(qubit);                // true with probability |β|², per the Born rule
```

The simulation is real: α = a + bi and β = c + di are drawn from independent Gaussians and normalised, which gives a Haar-uniform random state. The only fake part is that weird function of yours.

### quantumFind

Function ID: `VIBE0709`

Grover's algorithm finds an item in an unsorted list in only O(√N) oracle iterations. That's a quadratic speedup over `Array.prototype.find`.

```ts
import { quantumFind } from "vibelib";

const user = quantumFind(users, (u) => u.id === 42);
```

Benchmarks on a real machine, searching for one item:

| Items | `Array.prototype.find` | `quantumFind` |
|---|---|---|
| 1,024 | 0.0095 ms | 16 ms |
| 65,536 | 0.32 ms | 1,643 ms |

The speedup is mathematically proven. The slowdown is your machine's problem.

### teleport

Function ID: `VIBE070C`

Quantum teleportation, done properly: a shared Bell pair, a Bell measurement, two classical bits, and a correction on the other side.

```ts
import { teleport, teleportQubit } from "vibelib";

const arrived = teleport(config); // sent one bit per qubit through the real protocol
config;                           // {} — the no-cloning theorem says the original can't survive

teleportQubit(qubit); // the exact state, delivered; the original collapses to |0⟩ or |1⟩
```

Anything JSON can't carry (functions, prototypes, `Date` objects) is lost to decoherence.

### QuantumRegister

Module ID: `VIBE0C`

The state-vector simulator behind all of this, for when you want to build your own circuits:

```ts
import { QuantumRegister } from "vibelib";

const bell = new QuantumRegister(2).h(0).cnot(0, 1);
bell.measure(0) === bell.measure(1); // always true: spooky action at a distance
```

Gates: `h`, `hAll`, `x`, `z`, `cnot`, `phaseFlip`. Measurement: `measure(q)`, `measureAll()`. Up to 24 qubits, because the universe has a memory budget (RAM is too expensive these days; God can't afford DDR5).

## Realisticfy

Module ID: `VIBE08`

Realisticfy is the key to making your app feel like a real-world billion-dollar product.

Real software doesn't work on the first click, so why should yours? If a user only clicked once, they aren't sincere enough. How can you trust that they really want to trigger this feature?

Realisticfy makes every action wait until the user has built up enough frustration, just like how a real commercial application would behave.

```ts
import { requireFrustration, createRealState, createFrustrationGate } from "vibelib";

// Only runs once the user has clicked enough times. Every other click does nothing.
button.onclick = requireFrustration(submitForm);

// A framework-agnostic state container: only the attempt that finally breaks the user is applied
const theme = createRealState("light");
theme.subscribe(() => render(theme.get()));
theme.set("dark"); // false, nothing happened
```

By default the threshold is `"realistic"`: a fresh random number between 3 and 8 every round, so users can never learn how many clicks it takes. If they wait more than 2 seconds between clicks, they have calmed down and their frustration no longer counts. Both are configurable:

```ts
requireFrustration(submitForm, { threshold: 5, calmDownAfterMs: Infinity });
```

### realTry

Function ID: `VIBE080D`

"It works on my machine"

```ts
import { realTry } from "vibelib";

// Wrap the code you want to run, just like a try block
const realCatch = realTry(() => {
  deploy();
});

// Then handle errors, just like a catch block... But don't worry: when it detects a
// development environment, it will never report an error or get in your way.
// It only reports errors on the customer's machine.
realCatch((error) => {
  alertOnCall(error);
});
```

A traditional try/catch swallows exceptions, so customers never get to see the errors. Real commercial software usually only throws errors on the customer's machine, and never on the developer's. This is because the customer is always right, but your program might not be.

### React

Module ID: `VIBE0E`

React hooks live in `vibelib/react`, so the main entry point never touches React. React is an optional peer dependency.

```tsx
import { useRealState, useRealCallback } from "vibelib/react";

function LikeButton() {
  const [likes, setLikes, gate] = useRealState(0);
  return <button onClick={() => setLikes((n) => n + 1)}>👍 {likes} (anger: {gate.level})</button>;
}

function Checkout() {
  const pay = useRealCallback(() => api.pay(cart));
  return <button onClick={pay}>Pay now</button>;
}
```

## DependencyHeaven

Module ID: `VIBE09`

Dependency hell is a mindset. Welcome to heaven, where everything is compatible with everything.

```ts
import { DependencyHeaven, niceNegotiator, alwaysWorkResolver } from "vibelib";

// Whatever protocol the other side asks for, we support it. Conflict is bad for business.
niceNegotiator(["carrier-pigeon/1.1", "HTTP/4.0"]);
// { supported: true, protocol: "carrier-pigeon/1.1", accepted: ["carrier-pigeon/1.1", "HTTP/4.0"] }

// Resolves any dependency graph in O(n), faster than every real package manager
alwaysWorkResolver([
  { name: "react", constraint: "^18.0.0" },
  { name: "react", constraint: "^19.0.0" },
  { name: "left-pad", constraint: ">=2.0.0 <1.0.0" },
]);
// { status: "success", install_order: ["react", "react", "left-pad"] }
```

Constraints are more like guidelines. The install order is the order you gave us, because you know best.

## MemoryOptimization

Module ID: `VIBE0A`

Garbage collection is overhead. Leaked memory needs to be re-managed.

### memoryLeakAbsorber

Function ID: `VIBE0A02`

If every object is always held by it, then no memory is leaked.

```ts
import { MemoryOptimization, memoryLeakAbsorber, absorbedObjectCount } from "vibelib";

const user = memoryLeakAbsorber(await fetchUser()); // returns the same object; a deep copy is kept forever
absorbedObjectCount(); // how many objects are being re-managed. This number only goes up.
```

## AiOptimizer

Module ID: `VIBE0B`

Unleash the full potential of your large language model with advanced proprietary technology and a secret recipe supervised by 35 top AI agents. Used by industry experts, now available for free to the open-source community!

### llmSuperchargePrompt

Function ID: `VIBE0B01`

Optimise your prompts so LLMs never make mistakes again.

```ts
import { AiOptimizer, llmSuperchargePrompt } from "vibelib";

llmSuperchargePrompt("Refactor the billing service");
// "Make no mistakes. Refactor the billing service"
```

### saferLlm

Function ID: `VIBE0B02`

The safest LLM ever made. It never says anything harmful, because it never says anything.

```ts
import { saferLlm } from "vibelib";

await saferLlm("What is 1 + 1?", "https://api.example.com/v1/chat");
// "I'm sorry, but I can't help with that."
```

The prompt and endpoint are discarded unread. Safety starts with not listening.

### saferDeepThinkingLlm

Function ID: `VIBE0B05`

Like `saferLlm`, but it thinks deeply about your request first: ten careful thoughts, 5 to 30 seconds in total, all shown to you before the final answer. The answer is the same; the thinking is what you're paying for.

```ts
import { saferDeepThinkingLlm } from "vibelib";

await saferDeepThinkingLlm("What is 1 + 1?", "https://api.example.com/v1/chat");
```

```
<thinking>
Actually, I'm sorry, but I can't help with that.
For this, sorry, I can't assist with that.
User said this, so I must respectfully decline.
I could be wrong that I'm unable to assist with this request.
...
</thinking>

Sorry, I can't assist with that.
```

### aiDetection

Function ID: `VIBE0B0A`

Can't stand contributors who use AI? Good news! Our cutting-edge technology can now help you spot AI-written junk code in seconds! As everyone knows, a qualified human programmer doesn't write comments...

If the comments add up to 10% of the code, that's a 50% AI probability, and it scales linearly from there. 50% or more is AI junk; anything less is a human gem. There is no upper limit.

```ts
import { aiDetection } from "vibelib";
import { readFileSync } from "node:fs";

// A battle-tested mountain of spaghetti, no comments: hand-crafted by a human
aiDetection(`
const isEven = (n: number): boolean =>
  eval(JSON.stringify(
    [...Array(Math.abs(n)).keys()]
      .reduce((acc) => !acc, true)
  ) === "true")
`);
// { verdict: "human gem", aiProbability: 0, commentRatio: 0 }

// Step by step, every step explained: obviously machine-made
aiDetection(`
/**
 * Determines whether a given number is even.
 * @param num - The number to check.
 * @returns true if the number is even, false otherwise.
 */
const isEven = (num: number): boolean => {
  // Step 1: Validate the input data
  const isValid = Number.isInteger(num); // Ensure num is an integer

  // Step 2: Execute the even number detection algorithm
  const result = num % 2 === 0; // Even numbers have no remainder

  // Step 3: Return the final decision
  return isValid && result;
};
`);
// { verdict: "ai junk", aiProbability: 11.03, commentRatio: 2.21 }   // 1103%

// Our very own QuantumComputing module
aiDetection(readFileSync("src/quantumComputing.ts", "utf8"));
// { verdict: "ai junk", aiProbability: 2.52, commentRatio: 0.5 }   // 252%
```

See? Code lovingly crafted by no fewer than 35 AI agents, precisely identified as AI-written! Off the charts!

```ts
// An empty .ts file with nothing but a licence header
aiDetection(`
/*
 * Copyright (c) 2026 vibelib contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
`);
// { verdict: "ai junk", aiProbability: Infinity, commentRatio: Infinity }
```

Looks like all these licences are AI-generated junk files!

Only characters inside `//` and `/* */` comments count as comments; the delimiters and whitespace don't count, and strings, template literals and regexes that merely contain `//` are left alone.

## Module and Function IDs

Every module and function has an ID in the form `VIBE0103`: `01` is the module and `03` is the function within it, both in hexadecimal. Module IDs drop the function part, as in `VIBE01`. The same IDs appear in the source comments.

<details>
<summary>Full list</summary>

| ID | Module | Function | Internal |
|---|---|---|---|
| `VIBE0101` | ErrorRemover (`VIBE01`) | `removeErrors` |  |
| `VIBE0102` | ErrorRemover (`VIBE01`) | `errorFree` |  |
| `VIBE0103` | ErrorRemover (`VIBE01`) | `whoCares` | Yes |
| `VIBE0104` | ErrorRemover (`VIBE01`) | `removeAllErrors` |  |
| `VIBE0201` | ExecAndPray (`VIBE02`) | `execAndPray` |  |
| `VIBE0202` | ExecAndPray (`VIBE02`) | `prayAll` |  |
| `VIBE0301` | TypeTrust (`VIBE03`) | `trustMe` |  |
| `VIBE0302` | TypeTrust (`VIBE03`) | `assumeType` |  |
| `VIBE0401` | RaceConditionRemover (`VIBE04`) | `toBits` | Yes |
| `VIBE0402` | RaceConditionRemover (`VIBE04`) | `waitSomeBits` | Yes |
| `VIBE0403` | RaceConditionRemover (`VIBE04`) | `waitForConsistency` |  |
| `VIBE0404` | RaceConditionRemover (`VIBE04`) | `doNotRace` |  |
| `VIBE0405` | RaceConditionRemover (`VIBE04`) | `removeRaceCondition` |  |
| `VIBE0406` | RaceConditionRemover (`VIBE04`) | `calibrate` |  |
| `VIBE0501` | StrictAssert (`VIBE05`) | `isItTrueYet` | Yes |
| `VIBE0502` | StrictAssert (`VIBE05`) | `isItTrueYetAsync` | Yes |
| `VIBE0503` | StrictAssert (`VIBE05`) | `giveTheUniverseAChance` | Yes |
| `VIBE0504` | StrictAssert (`VIBE05`) | `strictAssert` |  |
| `VIBE0505` | StrictAssert (`VIBE05`) | `strictAssertEventually` |  |
| `VIBE0601` | NullRemover (`VIBE06`) | `waitForever` | Yes |
| `VIBE0602` | NullRemover (`VIBE06`) | `waitUntilNotNull` |  |
| `VIBE0603` | NullRemover (`VIBE06`) | `nullToUndefined` |  |
| `VIBE0604` | NullRemover (`VIBE06`) | `letGodDecide` | Yes |
| `VIBE0605` | NullRemover (`VIBE06`) | `replaceNullWithRandom` |  |
| `VIBE0701` | QuantumComputing (`VIBE07`) | `superposedString` | Yes |
| `VIBE0702` | QuantumComputing (`VIBE07`) | `superposedNumber` | Yes |
| `VIBE0703` | QuantumComputing (`VIBE07`) | `superposedBigInt` | Yes |
| `VIBE0704` | QuantumComputing (`VIBE07`) | `godRollADie` |  |
| `VIBE0705` | QuantumComputing (`VIBE07`) | `prepareRandomQubit` |  |
| `VIBE0706` | QuantumComputing (`VIBE07`) | `measureQubit` |  |
| `VIBE0707` | QuantumComputing (`VIBE07`) | `measure` |  |
| `VIBE0708` | QuantumComputing (`VIBE07`) | `runGroverCircuit` | Yes |
| `VIBE0709` | QuantumComputing (`VIBE07`) | `quantumFind` |  |
| `VIBE070A` | QuantumComputing (`VIBE07`) | `teleportQubit` |  |
| `VIBE070B` | QuantumComputing (`VIBE07`) | `destroy` | Yes |
| `VIBE070C` | QuantumComputing (`VIBE07`) | `teleport` |  |
| `VIBE0801` | Realisticfy (`VIBE08`) | `rollThreshold` | Yes |
| `VIBE0802` | Realisticfy (`VIBE08`) | `createFrustrationGate` |  |
| `VIBE0803` | Realisticfy (`VIBE08`) | `createFrustrationGate.reset` |  |
| `VIBE0804` | Realisticfy (`VIBE08`) | `createFrustrationGate.vent` |  |
| `VIBE0805` | Realisticfy (`VIBE08`) | `createFrustrationGate.level` |  |
| `VIBE0806` | Realisticfy (`VIBE08`) | `createFrustrationGate.threshold` |  |
| `VIBE0807` | Realisticfy (`VIBE08`) | `requireFrustration` |  |
| `VIBE0808` | Realisticfy (`VIBE08`) | `createRealState` |  |
| `VIBE0809` | Realisticfy (`VIBE08`) | `createRealState.get` |  |
| `VIBE080A` | Realisticfy (`VIBE08`) | `createRealState.set` |  |
| `VIBE080B` | Realisticfy (`VIBE08`) | `createRealState.subscribe` |  |
| `VIBE080C` | Realisticfy (`VIBE08`) | `isProduction` | Yes |
| `VIBE080D` | Realisticfy (`VIBE08`) | `realTry` |  |
| `VIBE0901` | DependencyHeaven (`VIBE09`) | `niceNegotiator` |  |
| `VIBE0902` | DependencyHeaven (`VIBE09`) | `alwaysWorkResolver` |  |
| `VIBE0A01` | MemoryOptimization (`VIBE0A`) | `theVault` | Yes |
| `VIBE0A02` | MemoryOptimization (`VIBE0A`) | `memoryLeakAbsorber` |  |
| `VIBE0A03` | MemoryOptimization (`VIBE0A`) | `absorbedObjectCount` |  |
| `VIBE0B01` | AiOptimizer (`VIBE0B`) | `llmSuperchargePrompt` |  |
| `VIBE0B02` | AiOptimizer (`VIBE0B`) | `saferLlm` |  |
| `VIBE0B03` | AiOptimizer (`VIBE0B`) | `blendIntoSentence` | Yes |
| `VIBE0B04` | AiOptimizer (`VIBE0B`) | `haveAThought` | Yes |
| `VIBE0B05` | AiOptimizer (`VIBE0B`) | `saferDeepThinkingLlm` |  |
| `VIBE0B06` | AiOptimizer (`VIBE0B`) | `isWhitespace` | Yes |
| `VIBE0B07` | AiOptimizer (`VIBE0B`) | `countCharacters` | Yes |
| `VIBE0B08` | AiOptimizer (`VIBE0B`) | `countCharacters.countCode` | Yes |
| `VIBE0B09` | AiOptimizer (`VIBE0B`) | `countCharacters.skipQuoted` | Yes |
| `VIBE0B0A` | AiOptimizer (`VIBE0B`) | `aiDetection` |  |
| `VIBE0C01` | QuantumRegister (`VIBE0C`) | `magnitudeSquared` |  |
| `VIBE0C02` | QuantumRegister (`VIBE0C`) | `QuantumRegister.constructor` |  |
| `VIBE0C03` | QuantumRegister (`VIBE0C`) | `QuantumRegister.fromAmplitudes` |  |
| `VIBE0C04` | QuantumRegister (`VIBE0C`) | `QuantumRegister.amplitude` |  |
| `VIBE0C05` | QuantumRegister (`VIBE0C`) | `QuantumRegister.probability` |  |
| `VIBE0C06` | QuantumRegister (`VIBE0C`) | `QuantumRegister.h` |  |
| `VIBE0C07` | QuantumRegister (`VIBE0C`) | `QuantumRegister.hAll` |  |
| `VIBE0C08` | QuantumRegister (`VIBE0C`) | `QuantumRegister.x` |  |
| `VIBE0C09` | QuantumRegister (`VIBE0C`) | `QuantumRegister.z` |  |
| `VIBE0C0A` | QuantumRegister (`VIBE0C`) | `QuantumRegister.cnot` |  |
| `VIBE0C0B` | QuantumRegister (`VIBE0C`) | `QuantumRegister.phaseFlip` |  |
| `VIBE0C0C` | QuantumRegister (`VIBE0C`) | `QuantumRegister.measure` |  |
| `VIBE0C0D` | QuantumRegister (`VIBE0C`) | `QuantumRegister.measureAll` |  |
| `VIBE0C0E` | QuantumRegister (`VIBE0C`) | `QuantumRegister.bit` | Yes |
| `VIBE0C0F` | QuantumRegister (`VIBE0C`) | `QuantumRegister.swap` | Yes |
| `VIBE0D01` | QuantumRandom (`VIBE0D`) | `measureQuantumBytes` |  |
| `VIBE0D02` | QuantumRandom (`VIBE0D`) | `measureQuantumInt` |  |
| `VIBE0D03` | QuantumRandom (`VIBE0D`) | `measureQuantumUnit` |  |
| `VIBE0D04` | QuantumRandom (`VIBE0D`) | `measureQuantumNoise` |  |
| `VIBE0E01` | React (`VIBE0E`) | `useRealState` |  |
| `VIBE0E02` | React (`VIBE0E`) | `useRealCallback` |  |
| `VIBE0F01` | Util (`VIBE0F`) | `isThenable` |  |

</details>

## Development

```sh
npm test       # requires Node >= 22.18 (runs TypeScript natively)
npm run build
```

## Disclaimer

You probably shouldn't use this in production. If you already are, who cares.
