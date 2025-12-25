# LLM 记忆

- llm api 调用和 http 请求一样，都是无状态的
- 怎么让大模型有记忆？
  维护一个对话记录，每次调用 llm 时，都把记录带上

  messages = [
  {
  role: 'user',
  content: '我叫陈昊，喜欢喝白兰地'
  },
  {
  role: 'assistant',
  content: '----------'
  }
  {
  role: 'user',
  content: '你知道我是谁吗？'
  }
  ]

## 多轮会话问题

- llm 调用是无状态的
- 多轮会话 维护一个对话历史记录 message 每次调用 llm 时 都会把历史记录带上
  - 维护对话
  - 滚雪球一样，token 消耗越来越多

## memory AI 应用的模块 langchain
