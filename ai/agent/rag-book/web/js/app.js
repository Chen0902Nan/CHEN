import { createApiClient } from "./apiClient.js";
import { createChatStore } from "./chatStore.js";
import { createChatView } from "./chatView.js";

function createMessage(role, text) {
  return {
    role,
    text,
    createdAt: Date.now(),
  };
}

function normalizeTopK(rawTopK, fallback = 3) {
  const parsed = Number.parseInt(rawTopK, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, 8);
}

async function bootstrap() {
  const apiClient = createApiClient();
  const chatStore = createChatStore();
  const chatView = createChatView();

  chatStore.subscribe((state) => {
    chatView.render(state);
  });

  chatStore.appendMessage(
    createMessage(
      "assistant",
      "你好，我已连接到 RAG 问答台。请输入你的问题。"
    )
  );

  chatView.bindSubmit(async ({ question, topK }) => {
    const trimmedQuestion = (question || "").trim();
    if (!trimmedQuestion) {
      chatStore.setError("请输入问题后再发送。");
      return;
    }

    chatStore.appendMessage(createMessage("user", trimmedQuestion));
    chatStore.setLoading(true);
    chatStore.setError("");

    try {
      const response = await apiClient.chat({
        question: trimmedQuestion,
        topK: normalizeTopK(topK),
      });

      chatStore.setReady(true);
      chatStore.setContexts(response.context || []);
      chatStore.appendMessage(
        createMessage("assistant", response.answer || "暂无回答。")
      );
      chatView.clearInput();
    } catch (error) {
      chatStore.setReady(false);
      chatStore.setError(error.message || "请求失败。");
      chatStore.appendMessage(
        createMessage("system", `请求失败：${error.message || "未知错误"}`)
      );
    } finally {
      chatStore.setLoading(false);
    }
  });

  try {
    const health = await apiClient.health();
    chatStore.setReady(Boolean(health?.ok));
    if (!health?.ok) {
      chatStore.setError("服务健康检查未通过。");
    }
  } catch (error) {
    chatStore.setReady(false);
    chatStore.setError("无法连接后端服务。");
  }
}

bootstrap();
