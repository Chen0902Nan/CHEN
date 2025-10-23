# OpenAI AIGC Models

## openai 提供了 llm sdk

- 初始化一个后端项目
  node 是 js 的后端实现，命令行运行
  npm node packge management node 包管理
- node 以其轻量化的开发，适合中小型项目，占据大量开发市场
- openai llm 事实上的标准
  - completion 接口 完成
  - chat 接口

## LLM

- 来自 openai
- LLM gpt-3.5-turbo-instruct
- 文本生成
- 安装了 openai sdk package
- 实例化.apiKey,baseURL
- 调用 completions.create 方法
- 本质是向 api.openai/complettions 发送 POST 请求
