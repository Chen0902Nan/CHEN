# Harness Engineering

- 近几年的AI浪潮
  - 22年底ChatGPT AIGC将AI炙热
  - llm 不断的变强
    推理 DeepSeek
    计划
    代码生成能力
    生成能力
    多模态 Gemini3
- AI产品
  chatgpt
  copilot github代码建议
  豆包
  cursor/trae 编程Agent
  claude code/codex
  钉钉、飞书、微信等最近都推出了cli，访问app的不只是用户，Agent成了新的主力
  因为openclaw

## Claude Code

Anthropic 推出的命令行编程Agent，优点是可直接在终端中高效生成和修改代码、上下文推理、适合复杂项目开发

- claude code 比cursor更懂功能
  一样的有配置文件 规范驱动开发
  技术架构、功能需求、外联api文档 开发规范...
  llm chat 都会带上的md文件
  配置mcp 外部资源的导入
  skills 技能包 虚拟角色
  cc 为什么更强

- 官网解释
  Claude Code serves as the agentic harness around Claude
  It provides the tools,context management,and execution enviroment that turn a language model into a capable coding agent.
  Claude Code 是一个智能体编排(工程)框架，包裹在Claude模型外面
  它提供工具(tool,mcp)、上下文管理(memory)和执行环境(Linux)，把一个语言模型编程一个有能力的编码Agent

## 什么是Harness?

Agentic AI 工程化架构
harness 像缰绳，让大模型可控执行任务，提升安全性、稳定性与工程落地能力

The Harness is the Horse's Superpower!!

Agent Harness=包裹LLM的运行时基础设施、管理工具调度、上下文工程、安全执行、状态持久化和会话连续性。LLM只负责推理决策。
2026年是Harness之年？竞争差异化从model1 转移到Harness

Agent=Model + harness(五个组件)

Tools 工具 模型的手脚 Read、Write、Edit、Bash、Grep(搜索)
这些工具赋予模型与文件系统、终端、网络交互能力
没有工具、模型只能说，不能做

Context(上下文)模型的记忆加载器 CLAUDE.md、系统提示词、对话历史、工具定义
这些上下文在每一轮循环被注入模型，决定模型看到什么，知道什么。上下文管理的精妙是，它不仅是被动的信息传递，还包括主动的压缩和重新注入策略(成长)

Memoty(记忆) 模型的长期存储。跨会话的记忆持久化，让模型能记住你的偏好，项目规划和历史决策
Claude.md 显示记忆
自动记忆 ~/.claude/memory 存下你的操作习惯
没有memory，每次对话都是从零开始

Hooks 钩子 模型的神经反射

睡前刷牙
事件驱动的自动化机制，在工具执行前后出发自定义逻辑。在工具执行前后触发自定义逻辑比如每次保护文件自动格式化，每次提交前自动测试代码
不需要模型主动决策，某些行为会自动发生

Permissions(权限)
模型的安全围栏，哪些工具可以自由使用，哪些需要人工审核，哪些完全禁止
harness 的安全底线
你希望agent足够自主，以提高效率，但又不希望它自主到失控

Model在中心，五个组件围绕他排列，整体被一个名为Harness的边框包裹，模型不能直接接触外部世界，所有交互都通过harness的组件中转，Harness是模型和现实之间的唯一接口

Tools的执行结果变成Context的一部分，hooks在Tools执行前后触发
Permissions决定哪些Tools可以被调用
Memory 用于跨会话保留Context的关键信息，五个组件不是孤立的，协同运转

Agentic Loop Harness 的心脏，是一台机器，Agentic Loop是发动机
