# Agent 记忆模块

- Rag 太重要了
  - 最低的成本(embedding)丰富llm的精准(cosine)上下文
  - 大模型的微调(finetue)也可以提升llm的能力 但是花费巨大 巨复杂
    成本比较高，

- llm的扩展
  llm + tool(干活) + RAG(知识库Context) + Memory(记忆)

- memory 是基石
  messages 数组 -> 最基础的memory
  tool ? 基于Memory
  rag ? Prompt 增强 我们之前的对话 能力的积累 修改prompt
  SSD

- 和llm的对话 是无状态的 Stateless
  - llm 简单 消费算力、电力、高并发基础设施
    基于请求 AIGC生成，生成内容返回
  - http 也是无状态的
    万物互联
    http头带上 Cookie,Authorization 还是无状态的
  - 带上了memory
    messages 数组
  -

- modelWithTools
  messages 数组放入了SystemMessages，告诉他的角色、功能
  然后放入HumanMessage 用户的问题(干什么)
  基于智能循环判断 tool_calls
  将Tool 的返回结果用 ToolMessage再加入message
  利用了Memory 把需要多轮对话的复杂任务 无状态的大模型也能搞定

- 单纯的 Message数组很简单，但是有问题
  - context越来越长，token越来越多,触犯到上下文窗口大小限制

- 解决方案 截断 总结 检索(rag长期检索)
  - 截断 slice(-n) 最近最关心的对话还在 滑动窗口 LRU
  - 将要截断的Message 总结一下(summarize) /compact
    当前的多轮对话中 Memory 机制够用
  - 检索(先存 数据库、文件之中 ) 提问 rag ?
    cursor 等，超越当前对话，将之前的对话存储，rag 利用的场景
    AI Agent 越来越懂我们

    清空messages /clear
    新的任务，节省token

  - cursor 通过messages 计算token开销
    40%,0%
  - 自动触发总结
  - 手动触发
    /compact /clear
    又能vibe coding 又能省token的ai工程师

## FileSystemChatMessageHistory

- cursor 的messages history实现方案
  - session 会话 一次会话 有一个主题
    - js 八股
    - 算法
    - 手写
    - AI
  - 全新主题，新开一个session
  - 持久化存储 history
  - 恢复某个session 继续chat

## 截断
