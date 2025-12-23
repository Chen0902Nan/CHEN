import "dotenv/config";
// 适配器 Provider  省去了适配工作
// 适配大模型也是工作量
import { ChatDeepSeek } from "@langchain/deepseek";
// 提示词模块
import { PromptTemplate } from "@langchain/core/prompts";
// static 方法  属于类的 不是实例
const prompt = PromptTemplate.fromTemplate(`
    你是一个{role},
    请用不超过{limit}字回答以下问题:{question}
  `);

const promptStr = await prompt.format({
  role: "前端面试官",
  limit: "50",
  question: "什么是闭包",
});

const prompt2 = await prompt.format({
  role: "后端面试官",
  limit: "50",
  question: "什么是mvc",
});

// console.log(promptStr);
const model = new ChatDeepSeek({
  model: "deepseek-reasoner", 
  temperature: 0,
});

const res = await model.invoke(prompt2);
console.log(res.content);
