<template>
  <div class="ai-chat-container">
    <div class="chat-header">
      <h2>AI 图书管理助手</h2>
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="message.sender === 'user' ? 'user-message' : 'ai-message'">
        <div class="message-content">
          {{ message.content }}
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input 
        type="text" 
        v-model="inputMessage" 
        placeholder="请输入您的问题（例如：图书总数是多少？谁借了《西游记》？）" 
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const chatMessages = ref(null);

// 初始化消息
onMounted(() => {
  messages.value = [
    {
      sender: 'ai',
      content: '您好！我是图书管理系统的AI助手，请问有什么可以帮助您的？'
    }
  ];
});

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = inputMessage.value.trim();
  messages.value.push({
    sender: 'user',
    content: userMessage
  });
  inputMessage.value = '';
  scrollToBottom();

  isLoading.value = true;
  try {
    const response = await axios.post('/api/ai/chat', {
      question: userMessage
    });
    
    messages.value.push({
      sender: 'ai',
      content: response.data.answer
    });
  } catch (error) {
    messages.value.push({
      sender: 'ai',
      content: '抱歉，我暂时无法回答您的问题，请稍后再试。'
    });
    console.error('AI聊天错误:', error);
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  }, 100);
};

// 监听消息变化，自动滚动
watch(messages, () => {
  scrollToBottom();
}, { deep: true });
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background-color: #4285f4;
  color: white;
  padding: 1rem;
  text-align: center;
}

.chat-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  line-height: 1.4;
}

.user-message {
  align-self: flex-end;
  background-color: #4285f4;
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message {
  align-self: flex-start;
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;
  outline: none;
}

.chat-input input:focus {
  border-color: #4285f4;
}

.chat-input button {
  padding: 0.75rem 1.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input button:hover:not(:disabled) {
  background-color: #3367d6;
}

.chat-input button:disabled {
  background-color: #a0c4f1;
  cursor: not-allowed;
}
</style>