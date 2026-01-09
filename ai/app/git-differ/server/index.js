import express from "express"; // 引入后端框架
// langchain 支持ollama
import { ChatOllam } from "@langchain/ollama";
// 提示词模模块
import { ChatPromptTemplete } from "@langchain/core/prompts";
// 输出格式化模块
import { StringOutputParser } from "@langchain/core/output_parsers";
//web server http协议 3000端口 伺服

const model = new ChatOllam({
  baseUrl: "https://localhost:11434",
  model: "deepseek-r1:8b",
  temperature: 0.1, // 严格规范
});

const app = express(); // server app

// 使用 json 解析中间件服务
app.use(express.json());

// 路由 get method path -> /hello
// req 请求对象 res 响应对象
app.get("/hello", (req, res) => {
  res.send("hello world");
});

app.post("/chat", async (req, res) => {
  // 处理函数
  console.log(req.body, "//////"); // undefined

  const { message } = req.body; // 从请求体里结构用户的提问
  // 后端稳定第一位
  if (!message || typeof message !== "string") {
    // 响应头 statusCode 400 用户请求错误
    // 响应体是json的
    // 完整的响应
    // send 文本 后端 api 服务 要求的数据接口格式是json
    return res.status(400).json({
      error: "message 必填，必须是字符串",
    });
  }
  res.send(message); // 返回
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
