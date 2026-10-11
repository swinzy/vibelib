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

Programs spend too much time waiting? That's way too slow! Call it, then pray. No awaiting, no return value, no questions asked. Your program's performance just went through the roof!

```ts
import { execAndPray, prayAll } from "vibelib";

execAndPray(saveToDatabase, user);    // returns immediately; the database will probably save it
execAndPray(async () => sendEmail()); // sync throws and async rejections are both swallowed

prayAll(flushCache, notifyAdmin, chargeCreditCard); // bulk prayer, all at once
```

## TypeTrust

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

Utilise the most cutting edge quantum technology in your app for free.

### godRollADie

Einstein said God does not play dice. Maybe that's true, but not if you ask him to.

```ts
import { QuantumComputing, godRollADie } from "vibelib";

godRollADie(); // a random primitive of a random type
// false, 1.7e+308, -8243129340023981233n, Symbol(...), "...", null, undefined, NaN...
```

Every bit pattern is a valid double, so `NaN`, `Infinity` and `-0` are all possible outcomes. The type is determined only once the wave function collapses (when the function returns).

### measure

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

Quantum teleportation, done properly: a shared Bell pair, a Bell measurement, two classical bits, and a correction on the other side.

```ts
import { teleport, teleportQubit } from "vibelib";

const arrived = teleport(config); // sent one bit per qubit through the real protocol
config;                           // {} — the no-cloning theorem says the original can't survive

teleportQubit(qubit); // the exact state, delivered; the original collapses to |0⟩ or |1⟩
```

Anything JSON can't carry (functions, prototypes, `Date` objects) is lost to decoherence.

### QuantumRegister

The state-vector simulator behind all of this, for when you want to build your own circuits:

```ts
import { QuantumRegister } from "vibelib";

const bell = new QuantumRegister(2).h(0).cnot(0, 1);
bell.measure(0) === bell.measure(1); // always true: spooky action at a distance
```

Gates: `h`, `hAll`, `x`, `z`, `cnot`, `phaseFlip`. Measurement: `measure(q)`, `measureAll()`. Up to 24 qubits, because the universe has a memory budget (RAM is too expensive these days; God can't afford DDR5).

## Realisticfy

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

Garbage collection is overhead. Leaked memory needs to be re-managed.

### memoryLeakAbsorber

If every object is always held by it, then no memory is leaked.

```ts
import { MemoryOptimization, memoryLeakAbsorber, absorbedObjectCount } from "vibelib";

const user = memoryLeakAbsorber(await fetchUser()); // returns the same object; a deep copy is kept forever
absorbedObjectCount(); // how many objects are being re-managed. This number only goes up.
```

## AiOptimizer

Unleash the full potential of your large language model with advanced proprietary technology and a secret recipe supervised by 35 top AI agents. Used by industry experts, now available for free to the open-source community!

### llmSuperchargePrompt

Optimise your prompts so LLMs never make mistakes again.

```ts
import { AiOptimizer, llmSuperchargePrompt } from "vibelib";

llmSuperchargePrompt("Refactor the billing service");
// "Make no mistakes. Refactor the billing service"
```

### saferLlm

The safest LLM ever made. It never says anything harmful, because it never says anything.

```ts
import { saferLlm } from "vibelib";

await saferLlm("What is 1 + 1?", "https://api.example.com/v1/chat");
// "I'm sorry, but I can't help with that."
```

The prompt and endpoint are discarded unread. Safety starts with not listening.

### saferDeepThinkingLlm

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
// { verdict: "ai junk", aiProbability: 2.34, commentRatio: 0.47 }   // 234%
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

## Development

```sh
npm test       # requires Node >= 22.18 (runs TypeScript natively)
npm run build
```

## Disclaimer

You probably shouldn't use this in production. If you already are, who cares.
