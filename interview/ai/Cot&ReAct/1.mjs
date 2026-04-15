import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function cotExample() {
  return await client.chat.completions.create({
    model: process.env.MODEL_NAME,
    messages: [
      {
        role: "user",
        content: `
        请一步一步思考，并解决问题：
        一个商品打八折，再减10元，最终价格是多少？
        `,
      },
    ],
  });
}

cotExample().then(r => console.log(r?.choices?.[0]?.message?.content));
