import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// 带上历史聊天记录的可运行对象
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
// 存在内存之中
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import "dotenv/config";

const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
});
// 聊天模版
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你是一个唐人聊天AI"],
  ["placeholder", "{history}"],
  ["human", "{input}"],
]);

const runnable = prompt.pipe(model);

const messageHistory = new InMemoryChatMessageHistory();
const chain = new RunnableWithMessageHistory({
  runnable,
  getMessageHistory: async () => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

const res1 = await chain.invoke(
  { input: "我叫华高俊，我挨打和平精英" },
  {
    configurable: {
      sessionId: "111",
    },
  }
);
const res2 = await chain.invoke(
  { input: "我是谁" },
  {
    configurable: {
      sessionId: "111",
    },
  }
);
console.log(res1.content);
console.log(res2.content);
