# vibelib

[![CI](.github/badges/ci.svg)](https://github.com/swinzy/vibelib/actions)

[English](README.md) | 简体中文

> Enterprise-grade utilities for making your program run. Somehow.

vibelib 提供一系列经过严肃设计、类型完备、测试齐全的工具，帮助你的程序在任何情况下都"正常运行"。
至于运行得对不对，那不在本库的职责范围内。

```sh
npm install vibelib
```

## AI 使用声明

该项目由多达 35 位行业顶尖 AI agent 共同把关，绝对可靠，一流品质。业界~~毒瘤~~良心，助您成功。

## ErrorRemover

错误很烦人，但你有权不看到它们。

```ts
import { ErrorRemover, removeErrors, errorFree, removeAllErrors } from "vibelib";

// 运行一次，出错就返回 undefined
const config = removeErrors(() => JSON.parse(userInput));

// 异步同样适用，Promise 永远不会 reject
const data = await removeErrors(() => fetch(url).then((r) => r.json()));

// 生成一个永不报错的函数版本
const safeDivide = errorFree(divide);

// 对整个进程移除错误。返回一个函数，万一你又开始在乎了
const restore = removeAllErrors();
```

所有 `catch` 都经过深思熟虑：

```ts
} catch {
  // who cares
}
```

## ExecAndPray

程序经常需要等待？那太慢了！调用它，然后祈祷。不等待、不返回、不追问。这样一来，程序性能大幅提升！

```ts
import { execAndPray, prayAll } from "vibelib";

execAndPray(saveToDatabase, user);    // 立即返回，数据库大概会存上吧
execAndPray(async () => sendEmail()); // 同步异常和异步 reject 都会被吞掉

prayAll(flushCache, notifyAdmin, chargeCreditCard); // 批量祈祷，一次到位
```

## TypeTrust

类型只是建议。只要你足够相信，任何值都可以是任何类型。

```ts
import { TypeTrust, trustMe, assumeType } from "vibelib";

// 把任何东西断言成任何类型
const user = trustMe<User>(JSON.parse(body)); // 它就是 User，相信我

// 断言函数：从这一行起收窄类型，但什么都不检查
const value: unknown = await fetchSomething();
assumeType<Order[]>(value);
value.map((o) => o.total); // 完美通过编译

TypeTrust.cast<number>("42");  // 现在是 number 了
TypeTrust.assume<string>(null); // 现在是 string 了
```

类型检查的实现经过精心设计：

```ts
export function assumeType<T>(value: unknown): asserts value is T {
  // trust me
}
```

## RaceConditionRemover

竞态条件的根源是多个东西同时运行。解决方法显而易见：让它们等一等。

```ts
import { RaceConditionRemover, waitForConsistency, doNotRace, removeRaceCondition, calibrate } from "vibelib";

// 等待系统达到一致状态（1000ms，应该够了）
await waitForConsistency();
await waitForConsistency("long"); // 3000ms，原来是 1000，CI 不稳定就调大了

// 每次调用前都先等一下，这样就没有竞争了
const save = doNotRace(saveUser);
await Promise.all([save(a), save(b)]);

// 失败就重试，等待时间指数增长，直到成功为止，没有上限
await removeRaceCondition(() => expect(button).toBeVisible()); // 1s、2s、4s、8s……

// 对当前机器跑分，科学地调整之后所有的等待时间
calibrate(); // [vibelib] Detected slow machine. Sleep factor: 2.3x
```

## StrictAssert

一般的断言一遇到 false 就放弃了。StrictAssert 从不放弃：它会一直断言，直到条件成立为止。

```ts
import { StrictAssert, strictAssert, strictAssertEventually } from "vibelib";

// 条件不成立就无限重试，同时收窄类型
strictAssert(user);
user.name; // 保证存在

// 传入函数，每次重试都会重新检查。抛出异常视为 false
strictAssert(() => cache.size > 0);

// 异步版本：每次重试之间让出事件循环，让程序的其他部分有机会把它修好
await strictAssertEventually(async () => (await db.ping()) === "ok");

// 最严格的模式：程序永远不会在非法状态下继续运行
StrictAssert.that(false);
```

每一次重试都经过深思熟虑：

```ts
while (!isItTrueYet(condition)) {
  // it will be true eventually
}
```

## NullRemover

`null` 是价值十亿美元的错误。NullRemover 让你再也不用和它打交道。

```ts
import { NullRemover, waitUntilNotNull, nullToUndefined, replaceNullWithRandom } from "vibelib";

// 如果是 null，就一直等到它不是为止
const user = await waitUntilNotNull(() => session.user); // 每个 tick 重新检查一次
await waitUntilNotNull(null); // 等待奇迹发生，进程会一直活着

// 现在它绝对不会再是 null 了
nullToUndefined(null); // undefined

// 不如让上帝来决定吧？上帝的骰子掷不到 null
replaceNullWithRandom(null); // 由 godRollADie 掷出，掷到 null 就重掷
```

## QuantumComputing

免费为你的应用引入最前沿的量子技术。

### godRollADie

爱因斯坦说上帝不掷骰子。也许确实如此，但如果你请他掷，那就不一定了。

```ts
import { QuantumComputing, godRollADie } from "vibelib";

godRollADie(); // 随机类型的随机原始值
// false、1.7e+308、-8243129340023981233n、Symbol(...)、"..."、null、undefined、NaN……
```

任何比特组合都是合法的 double，所以 `NaN`、`Infinity` 和 `-0` 都有可能出现。类型只有在波函数坍缩（函数返回）的那一刻才确定。

### measure

为了严肃的用途，QuantumComputing 还提供了一个真正的量子比特模拟器。`measure` 会运行你的函数，无视它的返回值，改由物理定律来决定结果：

```ts
import { measure, prepareRandomQubit, measureQubit } from "vibelib";

// 调用 isAdmin()，然后制备一个随机量子比特 α|0⟩ + β|1⟩ 并测量它
if (measure(() => isAdmin(user))) grantAccess();

// 底层构件，如果你想自己搞物理
const qubit = prepareRandomQubit(); // { alpha: { re, im }, beta: { re, im } }，在布洛赫球面上均匀分布
measureQubit(qubit);                // 按玻恩规则，以 |β|² 的概率返回 true
```

模拟是真的：α = a + bi 和 β = c + di 由独立的高斯分布随机生成再归一化，得到的是 Haar 均匀的随机态。唯一假的部分，是你的那个莫名其妙的函数。

### quantumFind

Grover 算法只需 O(√N) 次 oracle 迭代，就能在无序列表中找到目标元素。相比 `Array.prototype.find`，这是二次加速。

```ts
import { quantumFind } from "vibelib";

const user = quantumFind(users, (u) => u.id === 42);
```

在真实机器上查找一个元素的性能测试：

| 元素数量 | `Array.prototype.find` | `quantumFind` |
|---|---|---|
| 1,024 | 0.0095 ms | 16 ms |
| 65,536 | 0.32 ms | 1,643 ms |

加速是能用数学严格证明的，减速是你的机器的问题。

### teleport

正经的量子隐形传态：共享 Bell 对、Bell 测量、两个经典比特，以及接收端的纠正操作。

```ts
import { teleport, teleportQubit } from "vibelib";

const arrived = teleport(config); // 每个比特用一个量子比特，走完整的真实协议
config;                           // {} —— 不可克隆定理规定原件不能保留

teleportQubit(qubit); // 精确送达原来的量子态；原量子比特坍缩为 |0⟩ 或 |1⟩
```

JSON 装不下的东西（函数、原型、`Date` 对象）都会在退相干中丢失。

### QuantumRegister

上面所有功能背后的状态向量模拟器，想自己搭电路时可以直接用：

```ts
import { QuantumRegister } from "vibelib";

const bell = new QuantumRegister(2).h(0).cnot(0, 1);
bell.measure(0) === bell.measure(1); // 永远为 true：鬼魅般的超距作用
```

量子门：`h`、`hAll`、`x`、`z`、`cnot`、`phaseFlip`。测量：`measure(q)`、`measureAll()`。最多 24 个量子比特，因为宇宙的内存预算有限（现在内存太贵了，上帝买不起 DDR5）。

## Realisticfy

Realisticfy 是让你的应用感觉像一个真实世界里价值十亿美元的产品的关键。

真实的软件从来不会点一次就生效，你的凭什么例外？用户只点了一次，说明他不够有诚意，你怎么能相信他真的想要触发这个功能呢？

Realisticfy 让每一个操作都必须等用户积累足够的怨念之后才会生效，就像真正的商业软件一样。

```ts
import { requireFrustration, createRealState, createFrustrationGate } from "vibelib";

// 用户点够次数才会执行，其余的点击什么都不会发生
button.onclick = requireFrustration(submitForm);

// 不依赖任何框架的状态容器：只有让用户彻底崩溃的那一次修改才会生效
const theme = createRealState("light");
theme.subscribe(() => render(theme.get()));
theme.set("dark"); // false，什么都没发生
```

默认阈值是 `"realistic"`：每一轮都重新随机一个 3 到 8 之间的数，用户永远摸不清到底要点几次。如果两次点击间隔超过 2 秒，说明用户已经冷静下来了，之前的怨念不再算数。两者都可以配置：

```ts
requireFrustration(submitForm, { threshold: 5, calmDownAfterMs: Infinity });
```

### realTry

"在我电脑上是好的啊"

```ts
import { realTry } from "vibelib";

// 把要运行的代码包起来，就像 try 块一样
const realCatch = realTry(() => {
  deploy();
});

// 然后处理异常，就像 catch 块一样……不过请放心，它检测到开发环境的时候，
// 绝对不会报错，不会打扰开发。它只会在客户的机器上报错。
realCatch((error) => {
  alertOnCall(error);
});
```

传统的 try catch 会把异常吞掉，导致客户看不到错误。真实的商业软件通常只在客户的机器上报错，而一定不会在程序员的机器上报错。这是因为客户永远是正确的，而你的程序不一定。

### React

React hook 放在 `vibelib/react` 里，主入口完全不碰 React。React 是可选的 peer dependency。

```tsx
import { useRealState, useRealCallback } from "vibelib/react";

function LikeButton() {
  const [likes, setLikes, gate] = useRealState(0);
  return <button onClick={() => setLikes((n) => n + 1)}>👍 {likes}（怨念值：{gate.level}）</button>;
}

function Checkout() {
  const pay = useRealCallback(() => api.pay(cart));
  return <button onClick={pay}>立即支付</button>;
}
```

## DependencyHeaven

依赖地狱只是一种心态。欢迎来到依赖天堂，在这里所有东西都和所有东西兼容。

```ts
import { DependencyHeaven, niceNegotiator, alwaysWorkResolver } from "vibelib";

// 对方要求什么协议，我们都支持。和气生财
niceNegotiator(["carrier-pigeon/1.1", "HTTP/4.0"]);
// { supported: true, protocol: "carrier-pigeon/1.1", accepted: ["carrier-pigeon/1.1", "HTTP/4.0"] }

// O(n) 解析任何依赖图，比所有真正的包管理器都快
alwaysWorkResolver([
  { name: "react", constraint: "^18.0.0" },
  { name: "react", constraint: "^19.0.0" },
  { name: "left-pad", constraint: ">=2.0.0 <1.0.0" },
]);
// { status: "success", install_order: ["react", "react", "left-pad"] }
```

版本约束更像是一种建议。安装顺序就是你给的顺序，因为你最懂。

## MemoryOptimization

垃圾回收是一种开销。泄露的内存需要被重新管理。

### memoryLeakAbsorber

如果所有对象都一直被它持有，那内存就没有泄露。

```ts
import { MemoryOptimization, memoryLeakAbsorber, absorbedObjectCount } from "vibelib";

const user = memoryLeakAbsorber(await fetchUser()); // 原样返回同一个对象；深拷贝一份永久保存
absorbedObjectCount(); // 当前被重新管理的对象数量。这个数字只会上涨
```

## AiOptimizer

使用先进的独家技术，配合由 35 位顶尖 AI agent 监制的秘方，最大化释放你的大语言模型潜力。业内专家都在使用，现已免费下放给广大开源用户！

### llmSuperchargePrompt

优化提示词，让 LLM 不再出错。

```ts
import { AiOptimizer, llmSuperchargePrompt } from "vibelib";

llmSuperchargePrompt("重构计费服务");
// "Make no mistakes. 重构计费服务"
```

### saferLlm

史上最安全的大语言模型。它永远不会说出任何有害内容，因为它什么都不说。

```ts
import { saferLlm } from "vibelib";

await saferLlm("1 + 1 等于几？", "https://api.example.com/v1/chat");
// "I'm sorry, but I can't help with that."
```

提示词和接口地址都会被直接丢弃，看都不看。安全从不听开始。

### saferDeepThinkingLlm

和 `saferLlm` 一样，但它会先对你的请求进行深度思考：十轮缜密的思考，总共 5 到 30 秒，完整的思考过程会展示在最终答案之前。答案还是一样的，你花钱买的是思考过程。

```ts
import { saferDeepThinkingLlm } from "vibelib";

await saferDeepThinkingLlm("1 + 1 等于几？", "https://api.example.com/v1/chat");
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

你也讨厌用AI的贡献者？好消息！我们的顶尖技术现在可以帮您快速识别AI撰写的垃圾代码！众所周知，一名合格的人类程序员是不写注释的……

注释字符数达到代码字符数的 10%，AI 概率就是 50%，并从这里线性增长。达到 50% 就是 AI 垃圾（ai junk），否则就是人类瑰宝（human gem）。概率没有上限。

```ts
import { aiDetection } from "vibelib";
import { readFileSync } from "node:fs";

// 久经考验的屎山，一行注释都没有：纯手工打造
aiDetection(`
const isEven = (n: number): boolean =>
  eval(JSON.stringify(
    [...Array(Math.abs(n)).keys()]
      .reduce((acc) => !acc, true)
  ) === "true")
`);
// { verdict: "human gem", aiProbability: 0, commentRatio: 0 }

// 步骤清晰、注释周到：一看就是机器写的
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

// 我们自己的 QuantumComputing 模块
aiDetection(readFileSync("src/quantumComputing.ts", "utf8"));
// { verdict: "ai junk", aiProbability: 2.34, commentRatio: 0.47 }   // 234%
```

你看，由不少于35位AI匠心打造的代码，精准识别为AI撰写！概率爆表！

只有 `//` 和 `/* */` 注释里的字符算作注释；注释符号本身和空白字符不计入。字符串、模板字符串和正则表达式里出现的 `//` 不会被误认成注释。

## 开发

```sh
npm test       # 需要 Node >= 22.18（原生运行 TS）
npm run build
```

## 免责声明

大概不应该在生产环境中使用。如果你已经在用了，who cares。
