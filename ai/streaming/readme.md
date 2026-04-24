# AI 流式输出

- streaming 流式输出
  LLM 交互的用户体验优化（新） -> 爽
  streaming:true LLM 边思考，边返回
  优化了用户等待时间

前端负责用户体验 后端负责业务

- 编码
  - 任何内容都是由二进制存储（效率太低）
  - 对内容（非文本、网络通信）进行二进制剪裁或操作
    Buffer 缓冲
  - 编码 解码
    html5 TextEncoder TextDecoder
  -
