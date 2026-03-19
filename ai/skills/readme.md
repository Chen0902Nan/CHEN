# skills

## MCP model context protocol

标准协议 让AI链接外部世界(工具/API/PromptTemplate/文档)

MCP解决的是能做什么，却无法替代人类或高级智能体所具备的复杂情景判断，创造性策略制定或领域模糊的问题。

LLM with Tool 执行任务

mcp将原有的服务提供给llm -> server nest.js mcp sdk
sdk @tool 工具
@Prompt prompt 模版
@resource 资源

SKILLS 技能

- 文件夹 ppt 专家
  - SKILL.md 必须的 prompt
    技能声明
  - scipts 文件夹
    完成任务
  - 资源

SKILLS 可复用的AI专业能力包 (Prompt + 规划 +工具 +资源)

类比:
Prompt 一次性对话 llm是无状态的 RAG Tool 任务
SKILLs 可复用的工作经验

- 为什么SKILLS 会火

1. 传统Prompt 的问题
   帮我写一个PRD
   问题:

- 每次都要重复去描述
- 不稳定
- 不可复用

skills解决什么

- 可复用 一次写好，多次使用
- 标准化，团队统一AI行文
- 可组合 多个SKILLS 组成Agent
- 低成本 不需要开发服务器端 MCP的区别
  SKILLs 是 instructions + scipts + resources 的组合
  MCP 可以完成任务 SKILLs 将任务怎么做的更好
  小龙虾 Manus 的开源版本 智能体管家 opc的实例
  智能体的windows 操作系统来了

skills + mcp =完整 AI Agent
用户：分析这个excel
MCP：读取这个excel
skills：按公司规划分析 + 输出报告

### brand-guidelines

- gemini3 生成landing page 按照这个skill的要求
  颜色 主题 风格 anthorpic
  公司开发skill 有利于同一
- skills 的名字和文件夹要一样 小写,多个单词-连接
- SKILL.md prompt 文件
  - 头部，YAML(json) 前置元数据
    name
    description

- 总述它的作用

### ppt skills

- 渐进式的
  技能比较复杂 多种场景 渐进式的加载
  Skill.md 模块化加载别的md文件
  省token
