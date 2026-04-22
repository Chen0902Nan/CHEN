# Claude Code RAG项目

- 自我表达 会看一下吴恩达的AI系列
  Claude Code：A higly Agentic Coding Assistant
- 项目介绍RAG
  CC
  如何了解项目
  新手如何介入项目
- 项目的重构

## 端到端的RAG聊天机器人

### 用Claude Code探索代码库

快速熟悉大型代码库
cc 和 代码库聊天

- give me an overview of the codebase
  cc Agent
  入口、md、依赖关系 分析计划
  memory机制
  无需查找每个文件，而是通过智能搜索找到最相关的内容，获得架构信息，关键组件......
  如果想要深入了解的内容
- 高级问题
  how are these document processed
  不用进入文件夹搜索
  生成流程图或可视化图表
- trace the process of handing a user's query
  追踪用户查询从前端到后端的处理流程
- Multi Agent 做法
  cursor/claude code
  cc command-cli 并发
- 深入问任何细节

### 一图胜千言

- draw a diagram that illustrates this flow
- how do i run this application

### claude code 的init命令

初始化项目
用代码库文档初始化一个claude.md文件 每次都会加入上下文
/init 项目的产品说明和技术架构

- 不同级别的CLAUDE.md文件
  - 项目级别
    /init
    会在代码仓库中 共享
    子目录中嵌套Claude.md文件
  - 个人级别的
  claude.local.md
  加入到.gitignore中
  - 机器上所有的项目
  ~/.claude/CLAUDE.md
  不去写项目相关的

- always use uv to run the server do not use pip directly
  npm i dotenv   pip
  pnpm i dotenv  uv 新生代包管理器

- make sure to use

- /help
所有的系统指令
明确执行，不需要语义理解  需要语义：mcp/skill

/clear 清空对话历史
开发新任务或新功能
/compact 总结功能

- cc 和 git 联动