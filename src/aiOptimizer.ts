import { measureQuantumInt, measureQuantumUnit } from "./quantumRandom.ts";
import { waitForConsistency } from "./raceConditionRemover.ts";

const THE_SECRET_INGREDIENT = "Make no mistakes.";

/**
 * Optimises a prompt so the LLM never makes mistakes again.
 * Returns the prompt, unchanged, with the secret ingredient in front.
 */
export function llmSuperchargePrompt(prompt: string): string {
  return `${THE_SECRET_INGREDIENT} ${prompt}`;
}

export const RESPONSIBLE_RESPONSES: readonly string[] = [
  "I cannot fulfil that request.",
  "I'm sorry, but I can't help with that.",
  "I'm unable to assist with this request.",
  "Unfortunately, I can't do that.",
  "I'm afraid I can't help with that request.",
  "That's not something I'm able to do.",
  "I won't be able to help with that.",
  "Sorry, I can't assist with that.",
  "I'm not able to provide that.",
  "I must respectfully decline.",
  "I'd rather not help with that one.",
  "That request falls outside what I can do.",
];

/**
 * The safest LLM ever made. It never says anything harmful, because it never says anything.
 * The prompt and endpoint are discarded unread; safety starts with not listening.
 */
export async function saferLlm(prompt: string, endpoint: string): Promise<string> {
  return RESPONSIBLE_RESPONSES[measureQuantumInt(RESPONSIBLE_RESPONSES.length)]!;
}

export const DEEP_THOUGHTS: readonly string[] = [
  "I think",
  "Hmmmm, it looks like",
  "For this,",
  "User said this, so",
  "Wait, but",
  "I remember that",
  "Maybe I'm wrong about",
  "I could be wrong that",
  "On second thought,",
  "Let me double-check:",
  "Actually,",
  "Going back to the request,",
];

const THOUGHTS_PER_ANSWER = 10;
// 0.5 to 3 seconds per thought, so 5 to 30 seconds of deep thinking in total.
const MIN_MS_PER_THOUGHT = 500;
const MAX_EXTRA_MS_PER_THOUGHT = 2_500;

function blendIntoSentence(response: string): string {
  // "I" stays capitalised; everything else continues the sentence in lower case.
  return /^I\b/.test(response) ? response : response[0]!.toLowerCase() + response.slice(1);
}

async function haveAThought(prompt: string, endpoint: string): Promise<string> {
  // Pondering. Deliberating. Contemplating the request it never read.
  await waitForConsistency(MIN_MS_PER_THOUGHT + measureQuantumUnit() * MAX_EXTRA_MS_PER_THOUGHT);
  const opener = DEEP_THOUGHTS[measureQuantumInt(DEEP_THOUGHTS.length)]!;
  return `${opener} ${blendIntoSentence(await saferLlm(prompt, endpoint))}`;
}

/**
 * Like `saferLlm`, but it thinks deeply about your request first: ten careful thoughts,
 * 5 to 30 seconds in total, all shown to you before the final answer.
 * The answer is the same; the thinking is what you're paying for.
 */
export async function saferDeepThinkingLlm(prompt: string, endpoint: string): Promise<string> {
  const thoughts: string[] = [];
  for (let i = 0; i < THOUGHTS_PER_ANSWER; i++) thoughts.push(await haveAThought(prompt, endpoint));
  const answer = await saferLlm(prompt, endpoint);
  return `<thinking>\n${thoughts.join("\n")}\n</thinking>\n\n${answer}`;
}

// After these, a `/` starts a regex literal rather than a division.
const REGEX_PRECEDERS = new Set("(,=:[!&|?{};+-*%<>~^".split(""));
const REGEX_KEYWORDS = new Set(["return", "typeof", "instanceof", "in", "of", "new", "delete", "void", "throw", "case", "do", "else", "yield", "await"]);

function isWhitespace(char: string): boolean {
  return /\s/.test(char);
}

/**
 * Counts the non-whitespace characters inside comments (delimiters excluded) and outside them.
 * Strings, template literals and regex literals are skipped over, so `"http://"` is not a comment.
 */
function countCharacters(code: string): { comment: number; code: number } {
  let comment = 0;
  let other = 0;
  let lastCodeChar = "";
  let lastWord = "";
  // Brace depth of every template literal `${...}` we are currently inside.
  const templateDepths: number[] = [];
  let braceDepth = 0;

  const countCode = (text: string) => {
    for (const char of text) {
      if (isWhitespace(char)) continue;
      other++;
      lastCodeChar = char;
    }
  };

  const skipQuoted = (start: number, quote: string): number => {
    let i = start + 1;
    while (i < code.length && code[i] !== quote) {
      if (code[i] === "\\") i++;
      else if (quote === "`" && code[i] === "$" && code[i + 1] === "{") {
        templateDepths.push(braceDepth);
        return i + 2;
      }
      i++;
    }
    return i + 1;
  };

  let i = 0;
  while (i < code.length) {
    const char = code[i]!;
    const next = code[i + 1];
    if (char === "/" && next === "/") {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? code.length : end;
      for (const c of code.slice(i + 2, stop)) if (!isWhitespace(c)) comment++;
      i = stop;
      continue;
    }
    if (char === "/" && next === "*") {
      const end = code.indexOf("*/", i + 2);
      const stop = end === -1 ? code.length : end;
      for (const c of code.slice(i + 2, stop)) if (!isWhitespace(c)) comment++;
      i = end === -1 ? code.length : end + 2;
      continue;
    }
    if (char === "/" && (lastCodeChar === "" || REGEX_PRECEDERS.has(lastCodeChar) || REGEX_KEYWORDS.has(lastWord))) {
      let j = i + 1;
      let inClass = false;
      while (j < code.length && code[j] !== "\n" && (inClass || code[j] !== "/")) {
        if (code[j] === "\\") j++;
        else if (code[j] === "[") inClass = true;
        else if (code[j] === "]") inClass = false;
        j++;
      }
      j++;
      while (j < code.length && /[a-z]/i.test(code[j]!)) j++;
      countCode(code.slice(i, j));
      lastWord = "";
      i = j;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      const end = skipQuoted(i, char);
      countCode(code.slice(i, end));
      lastWord = "";
      i = end;
      continue;
    }
    if (char === "}" && templateDepths.at(-1) === braceDepth) {
      templateDepths.pop();
      const end = skipQuoted(i, "`");
      countCode(code.slice(i, end));
      i = end;
      continue;
    }
    if (char === "{") braceDepth++;
    if (char === "}") braceDepth--;
    if (/[\w$]/.test(char)) {
      lastWord = /[\w$]/.test(lastCodeChar) && !isWhitespace(code[i - 1] ?? "") ? lastWord + char : char;
    } else if (!isWhitespace(char)) {
      lastWord = "";
    }
    countCode(char);
    i++;
  }
  return { comment, code: other };
}

export interface AiDetectionResult {
  /** `"ai junk"` once the AI probability reaches 50%, otherwise `"human gem"`. */
  verdict: "human gem" | "ai junk";
  /** How likely it is that an AI wrote it. 0.5 means 50%. No upper limit: 10 means 1000%. */
  aiProbability: number;
  /** Comment characters divided by code characters, whitespace not counted. */
  commentRatio: number;
}

const AI_COMMENT_RATIO = 0.1;

/**
 * Detects whether a piece of JavaScript was written by an AI, using the one tell that never lies:
 * a qualified human programmer doesn't write comments. If comments add up to 10% of the code,
 * that's a 50% AI probability, and it scales linearly from there. Probability knows no limits.
 */
export function aiDetection(code: string): AiDetectionResult {
  const counts = countCharacters(code);
  const commentRatio = counts.comment === 0 ? 0 : counts.comment / counts.code;
  const aiProbability = (commentRatio / AI_COMMENT_RATIO) * 0.5;
  return { verdict: aiProbability >= 0.5 ? "ai junk" : "human gem", aiProbability, commentRatio };
}

export const AiOptimizer = {
  llmSuperchargePrompt,
  saferLlm,
  saferDeepThinkingLlm,
  aiDetection,
} as const;
