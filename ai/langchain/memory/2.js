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
  ["system", "你是一个有记忆的助手"],
  ["placeholder", "{history}"], // placeholder 占位符
  ["human", "{input}"],
]);

const runnable = prompt
  .pipe((input) => {
    //debug节点
    console.log(">>>最终传给模型的信息(Prompt 内存)");
    console.log(input);
    return input;
  })
  .pipe(model);

// 对话历史实例
const messageHistory = new InMemoryChatMessageHistory();
const chain = new RunnableWithMessageHistory({
  runnable,
  getMessageHistory: async () => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

const res1 = await chain.invoke(
  { input: "我叫陈昊，喜欢喝白兰地" },
  {
    configurable: {
      sessionId: "makefriend",
    },
  }
);

const res2 = await chain.invoke(
  { input: "我叫什么名字" },
  {
    configurable: {
      sessionId: "makefriend",
    },
  }
);

console.log(res1.content);
console.log(res2.content);
