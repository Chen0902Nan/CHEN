# 前端调用大模型

- llm 可以用前端 http 请求的方式调用
- trae 介入开发工程化

  - 代码
  - 工程化

- 项目初始化
- 创建一个通用原生的 HTML/CSS/JS 项目
- vite 全栈脚手架搭建
  帮我初始化 vite 配置

## fetch 复杂请求

- llm 调用可以通过 http 请求的方式调用
- 请求

  - 请求行： Method(POST) ur(api.deepseek.com/caht/completions) HTTP/1.1(版本)
  - 请求头：
    - Content-Type:application/json
    - Authorization: Bearer ${apikey} 令牌的固定前缀
  - 请求体（POST）
    - 文本，二进制发送，不可以直接发送 JSON 对象
      JSON.stingify()

- fetch(url,{
  method,
  headers,
  body
  })

- fetch Promise 实例

  .then

- apikey 放到 .env 文件中，后端行为
  - 全栈项目 vite（全栈项目脚手架） 环境变量配置
