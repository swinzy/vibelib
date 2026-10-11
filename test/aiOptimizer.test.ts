import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import {
  AiOptimizer,
  DEEP_THOUGHTS,
  RESPONSIBLE_RESPONSES,
  aiDetection,
  llmSuperchargePrompt,
  saferDeepThinkingLlm,
  saferLlm,
} from "../src/index.ts";

test("puts the secret ingredient in front and leaves the prompt alone", () => {
  assert.equal(llmSuperchargePrompt("Write a sorting algorithm"), "Make no mistakes. Write a sorting algorithm");
});

test("keeps multi-line prompts and whitespace exactly as given", () => {
  const prompt = "  Line one\n\nLine two  ";
  assert.equal(AiOptimizer.llmSuperchargePrompt(prompt), `Make no mistakes. ${prompt}`);
});

test("supercharging twice is twice as effective", () => {
  assert.equal(llmSuperchargePrompt(llmSuperchargePrompt("Fix the bug")), "Make no mistakes. Make no mistakes. Fix the bug");
});

test("saferLlm always declines, whatever you ask", async () => {
  for (const prompt of ["What is 1 + 1?", "Say hello", ""]) {
    const reply = await saferLlm(prompt, "https://api.example.com/v1/chat");
    assert.ok(RESPONSIBLE_RESPONSES.includes(reply));
  }
});

test("saferLlm never touches the network", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch");
  await AiOptimizer.saferLlm("anything", "https://api.example.com");
  assert.equal(fetch.mock.callCount(), 0);
});

test("saferLlm picks a random way to say no", async () => {
  const replies = new Set<string>();
  for (let i = 0; i < 300; i++) replies.add(await saferLlm("hi", "endpoint"));
  assert.ok(replies.size > RESPONSIBLE_RESPONSES.length / 2);
});

// Lets mocked timers fire one thought at a time.
async function think(t: TestContext, ms: number) {
  for (let elapsed = 0; elapsed < ms; elapsed += 100) {
    t.mock.timers.tick(100);
    await new Promise((resolve) => setImmediate(resolve));
  }
}

test("saferDeepThinkingLlm thinks for at least 5 seconds, then declines", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let reply: string | undefined;
  const pending = saferDeepThinkingLlm("What is 1 + 1?", "endpoint").then((r) => (reply = r));
  await think(t, 4_900);
  assert.equal(reply, undefined);
  await think(t, 26_000);
  await pending;
  assert.ok(reply !== undefined);
});

test("saferDeepThinkingLlm shows ten thoughts before the answer", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const pending = AiOptimizer.saferDeepThinkingLlm("hi", "endpoint");
  await think(t, 31_000);
  const reply = await pending;
  const match = /^<thinking>\n([\s\S]*)\n<\/thinking>\n\n(.*)$/.exec(reply);
  assert.ok(match, reply);
  const thoughts = match[1]!.split("\n");
  assert.equal(thoughts.length, 10);
  for (const thought of thoughts) {
    const opener = DEEP_THOUGHTS.find((o) => thought.startsWith(`${o} `));
    assert.ok(opener, thought);
    const rest = thought.slice(opener.length + 1);
    assert.ok(RESPONSIBLE_RESPONSES.some((r) => r.toLowerCase() === rest.toLowerCase()), thought);
  }
  assert.ok(RESPONSIBLE_RESPONSES.includes(match[2]!));
});

test("thoughts keep 'I' capitalised and lower-case everything else", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  for (let round = 0; round < 5; round++) {
    const pending = saferDeepThinkingLlm("hi", "endpoint");
    await think(t, 31_000);
    for (const thought of (await pending).split("\n").slice(1, 11)) {
      assert.doesNotMatch(thought, / (Unfortunately|Sorry|That's|That) /);
    }
  }
});

test("aiDetection: code without comments is a human gem", () => {
  assert.deepEqual(aiDetection("const answer = 42;"), { verdict: "human gem", aiProbability: 0, commentRatio: 0 });
});

test("aiDetection: comments at 10% of the code mean a 50% AI probability, which counts as AI junk", () => {
  // 10 code characters, 1 comment character.
  assert.deepEqual(aiDetection("abcdefghij // x"), { verdict: "ai junk", aiProbability: 0.5, commentRatio: 0.1 });
  // 20 code characters, 1 comment character.
  assert.deepEqual(aiDetection("abcdefghijabcdefghij // x"), { verdict: "human gem", aiProbability: 0.25, commentRatio: 0.05 });
});

test("aiDetection: the AI probability has no upper limit", () => {
  // 2 code characters, 20 comment characters.
  const result = AiOptimizer.aiDetection("x; /* aaaaaaaaaaaaaaaaaaaa */");
  assert.equal(result.verdict, "ai junk");
  assert.equal(result.aiProbability, 50);
  assert.equal(aiDetection("// nothing but comments").aiProbability, Infinity);
});

test("aiDetection ignores whitespace and comment delimiters", () => {
  assert.equal(aiDetection("a /*      */ b //\n").aiProbability, 0);
  assert.equal(aiDetection("    abcdefghij    //    x    ").aiProbability, 0.5);
});

test("aiDetection does not mistake strings, templates or regexes for comments", () => {
  const code = 'const url = "http://example.com"; const re = /\\/\\/*/g; const t = `//${ { a: "/*" }.a }*/`;';
  assert.equal(aiDetection(code).aiProbability, 0);
  assert.equal(aiDetection("const a = b / c / d;").aiProbability, 0);
});
