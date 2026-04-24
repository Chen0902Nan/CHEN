// input handleChange handleSubmit
// message
// mockjs/api/chat 流式输出
// chat 业务
import { useChat } from "@ai-sdk/react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:3000/api";

export const useChatbot = () => {
  return useChat({
    api: `${API_BASE_URL}/ai/chat`,
    onError: (err) => {
      console.error("Chat Error:", err);
    },
  });
};
