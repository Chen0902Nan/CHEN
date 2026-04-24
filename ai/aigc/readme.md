# AI 综述

- AIGC
  生成式人工智能

  - 生成文本 gpt-3.5-turbo-instruct
  - 生成图片 dall-e-2
  -

- 先初始化为后端项目
  npm init -y
  npm i openai@4.51.0
  npm i dotenv

- 优化一下
  已经安装过，不需要重复安装
  共享、更快、节省空间
- pnpm 替代 npm
  pnpm（Performant npm）是一个快速、节省磁盘空间的 Node.js 包管理器，它通过使用硬链接和符号链接来避免重复安装相同的包，从而显著提升安装速度并减少磁盘占用。
  - 安装
    npm install -g pnpm
- npm init -y
  初始化一个后端环境 -> 拥有一个 package.json 项目描述文件

- pnpm i openai@4.71.0 dotenv@17.2.3
- node main.mjs

- 程序执行

  node 是以命令行的方式运行 main.mjs
  main.mjs 单点入口 方便管理
  mjs 模块化的 js import from 导入模块
  程序运行起来后,将是一个独立的进程（process）
  进程（家长）是分配资源的最小单位
  前端 document，后端 process
  process.env 环境变量 配置或参数

  - dotenv
    读取.env 文件里的内容，添加到 process.env 环境变量之中

## prompt 提示词

- 提示 LLM，一段话，用聊天的方式，给 LLM 下达指令
- 如果你要让大模型帮我们执行复杂的任务，精心设计 Prompt

## Prompt Engineering 提示工程

- 设计出合理的 Prompt,才能让大模型按照我们的意图执行任务
- 提示工程是一个迭代的过程，不断优化 Prompt，才能得到我们期望的结果
- 有时候，LLM 性能不太好的时候，提示词也许可以独当一面
- 提示词的编写上升到工程的角度，有些 ai 项目的核心就是几段提示词
-

## 数据分析
