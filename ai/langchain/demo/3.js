import "dotenv/config";
import { ChatDeepSeek } from "@langchain/deepseek";
import { PromptTemplate } from "@langchain/core/prompts";
//AI应用的编程方式
//LLM 黑盒打开  key prompt
//langchain ai 应用的工程化
import { RunnableSequence } from "@langchain/core/runnables";
const model = new ChatDeepSeek({
  model: "deepseek-reasoner",
  temperature: 0.7,
});
const explainPrompt = PromptTemplate.fromTemplate(
  `
    你是一个前端专家，请详细介绍一下概念：{topic}
    要求：覆盖定义、原理、使用方式，不超过300字
    `
);
const summaryPrompt = PromptTemplate.fromTemplate(
  `
    请将以下前端概念解释总结为三个核心要点（每点不超过20字）：
    {explanation}
    `
);
const explainChain = explainPrompt.pipe(model);
// console.log(explainChain);
const summaryChain = summaryPrompt.pipe(model);
const fullChain = RunnableSequence.from([
  async ({ topic }) => {
    const result = await explainChain.invoke({ topic });
    return result.content; // 注意是 .content
  },
  async (explanation) => {
    const result = await summaryChain.invoke({ explanation });
    return `知识点：${explanation}\n\n总结：${result.content}`;
  },
]);

// 调用
const response = await fullChain.invoke({
  topic: "闭包",
});

console.log(response);
