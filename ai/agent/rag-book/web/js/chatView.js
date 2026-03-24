function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function createMessageElement(message, template) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.classList.add(message.role);

  const roleEl = node.querySelector(".message-role");
  const textEl = node.querySelector(".message-text");
  const timeEl = node.querySelector(".message-time");

  const roleName =
    message.role === "user"
      ? "用户"
      : message.role === "assistant"
        ? "RAG 助手"
        : "系统";

  roleEl.textContent = roleName;
  textEl.textContent = message.text;
  timeEl.textContent = formatTime(message.createdAt);

  return node;
}

function createContextElement(item) {
  const node = document.createElement("li");
  node.className = "context-item";

  const meta = document.createElement("div");
  meta.className = "context-meta";
  meta.innerHTML = `<span>#${item.rank}</span><span>score: ${Number(item.score || 0).toFixed(
    3
  )}</span>`;

  const text = document.createElement("p");
  text.className = "context-text";
  text.textContent = String(item.content || "无内容");

  node.append(meta, text);
  return node;
}

export function createChatView() {
  const refs = {
    chatForm: document.getElementById("chatForm"),
    questionInput: document.getElementById("questionInput"),
    topKInput: document.getElementById("topKInput"),
    sendButton: document.getElementById("sendButton"),
    statusBadge: document.getElementById("statusBadge"),
    chatTimeline: document.getElementById("chatTimeline"),
    contextList: document.getElementById("contextList"),
    messageTemplate: document.getElementById("messageTemplate"),
  };

  function renderStatus(state) {
    refs.statusBadge.classList.remove("ready", "loading", "error");

    if (state.loading) {
      refs.statusBadge.textContent = "处理中...";
      refs.statusBadge.classList.add("loading");
    } else if (state.error) {
      refs.statusBadge.textContent = "服务异常";
      refs.statusBadge.classList.add("error");
    } else if (state.ready) {
      refs.statusBadge.textContent = "服务已就绪";
      refs.statusBadge.classList.add("ready");
    } else {
      refs.statusBadge.textContent = "服务未连接";
    }

    refs.sendButton.disabled = state.loading;
  }

  function renderMessages(messages) {
    refs.chatTimeline.innerHTML = "";
    for (const message of messages) {
      const item = createMessageElement(message, refs.messageTemplate);
      refs.chatTimeline.appendChild(item);
    }
    refs.chatTimeline.scrollTop = refs.chatTimeline.scrollHeight;
  }

  function renderContexts(contexts) {
    refs.contextList.innerHTML = "";
    if (!contexts.length) {
      const emptyNode = document.createElement("li");
      emptyNode.className = "context-item";
      emptyNode.innerHTML =
        '<p class="context-text">暂无上下文。发送问题后会在这里展示检索片段。</p>';
      refs.contextList.appendChild(emptyNode);
      return;
    }

    for (const item of contexts) {
      refs.contextList.appendChild(createContextElement(item));
    }
  }

  return {
    render(state) {
      renderStatus(state);
      renderMessages(state.messages);
      renderContexts(state.contexts);
    },
    bindSubmit(handler) {
      refs.chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handler({
          question: refs.questionInput.value,
          topK: refs.topKInput.value,
        });
      });
    },
    clearInput() {
      refs.questionInput.value = "";
      refs.questionInput.focus();
    },
  };
}
