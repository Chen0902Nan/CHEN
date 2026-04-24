import "dotenv/config";

// console.log(process.env.DEEPSEEK_API_KEY), "///";

import { ChatDeepSeek } from "@langchain/deepseek";

const model = new ChatDeepSeek({
  model: "deepseek-reasoner", //推理模型
  temperature: 0,
  // langchain 帮我们适配了市面上大多数的llm
  // baseURL?  不用 适配器模式
  // apiKey?
});

// invoke 执行
const res = await model.invoke("讲一个沸羊羊和美羊羊的故事，短一点");
console.log(res);

console.log(res.content);
