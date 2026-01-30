// input handleChange handleSubmit
// message
// mockjs/api/chat 流式输出
// chat 业务
import { useChat } from "@ai-sdk/react";

export const useChatbot = () => {
  return useChat({
    api: "/api/ai/chat",
    onError: (err) => {
      console.log("Chat Error:", err);
    },
  });
};
