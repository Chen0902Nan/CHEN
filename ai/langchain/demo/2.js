// chain 链

// AI 业务是复杂的,分步骤处理，每步都可执行可配置
// 连起来，形成一个工作流 -> Agent
// chain 是有先后顺序的流程，可以被组织起来
import "dotenv/config";
import { ChatDeepSeek } from "@langchain/deepseek";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatDeepSeek({
  model: "deepseek-reasoner",
  temperature: 0.7,
});

const prompt = PromptTemplate.fromTemplate(
  `  你是一个前端专家，用一句话解释：{topic} `
);
// prompt 模版生成节点 ->
// model 代表的是llm节点
// 结束节点 invoke
// pipe 管道 连接节点，形成工作流
// Runnable Sequence workflow
// Sequencial chain
const chain = prompt.pipe(model);
// console.log(chain instanceof RunnableSequence);
const response = await chain.invoke({
  topic: "闭包",
});
console.log(response.content);
