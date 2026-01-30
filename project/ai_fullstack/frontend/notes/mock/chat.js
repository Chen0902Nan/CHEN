// 流式输出本质是边算(llm token 生成)边给,而不是等全部结果生成，再一次性返回
// AI场景中，模型生成文本是逐个token产生的 (模型每次基于已生成的token序列)
// 通过自回归方式预测下一个最可能的token
// 流式输出 streaming:true
// http chunked 数据块来传递 res.end()不用这个
// res.write(chunk)

import { config } from "dotenv";
config();
// SSE text/event-stream
export default [
  {
    url: "/api/ai/chat",
    method: "post",
    rawResponse: async (req, res) => {
      // node 原生的去拿到请求体
      // chunk 数据块(buffer)
      // tcp/ip  可靠的传输协议
      // 按顺序组装,失败重传 html
      // on data
      let body = "";
      // chunk 二进制流 buffer
      // buffer += -> 字符串
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        // 都到位了
        // console.log(body);
        try {
          const { messages } = JSON.parse(body);
          // console.log(messages);
          res.setHeader("Content-Type", "text/plain;charset=utf-8");
          // 响应头先告诉浏览器 流式 数据会分块传输
          res.setHeader("Transfer-Encoding", "chunked");
          // vercel ai sdk 特制头
          res.setHeader("x-vercel-ai-data-stream", "v1");
          const response = await fetch(
            "https://api.deepseek.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.VITE_DEEPSEEK_API_KEY}`,
              },
              body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages,
                stream: true, // 流式输出
              }),
            },
          );
          if (!response.body) throw new Error("No response body");
          // SSE 二进制流 reader 对象 接根管子一样
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            console.log(done, value, "---------------");
            if (done) break;
            const chunk = decoder.decode(value);
            // console.log(chunk, "///////////");
            const lines = chunk.split("\n");
            for (let line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data.choices[0]?.delta?.content || "";
                  if (content) {
                    res.write(`0:${JSON.stringify(content)}\n`);
                  }
                } catch (err) {}
              }
            }
          }
          res.end();
        } catch (err) {}
      });
    },
  },
];
