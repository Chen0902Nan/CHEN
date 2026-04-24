# 手搓我要计分 微信小程序

## 需求

玩扑克、麻将的时候，会打开一些微信小程序计分

- vibe coding 氛围编程
  - trae/cursor Ai 编辑器
  - 不修改任何一行代码
  - 调试、调优
  - vibe 能力的走势
    一句话的prompt -> 结构化的提示词 (prompt很重要) -> 产品经理(需求文档.md) + 设计师(UI设计.md) + 前端开发(小程序) + 后端开发工程师 + 测试工程师 虚拟人 多Agent 模式 协作开发
    思考、规划、任务拆分 sub Agents 自主决策 执行

## 前沿

- 传统的coding
  - 前端工程师(分工明确)
  - 根据设计稿硬编码(coding 工资来自代码能力)

- vibe coidng
  - 使用提示词直接生成代码(提示词工程师)
  - 基于一些mcp工具 将设计稿直接转成代码 (cursor figma)
  -

## vibe coding 阶段

- 第一个阶段 prompt 抽卡 -> 重新做
  一两句话描述需求

- 第二个阶段 prompt 工程 设计prompt
  - 给它一个角色
  - 项目结构 (生成的文件放哪里)
  - 代码规范 (es6,tailwindcss)
  - 现在需求是
  - 提供一个上下文
  - 输出格式 ()
    相比第一个阶段，提示词变多了 专业了 结构化了
    形成了一定的系统方法论 任务拆解 用专业的术语去引导llm，
    能精准的控制氛围编程生成的内容

- 第三阶段
  多Agent Agentic AI
  在vibe coding 之前，先让AI生成 需求文档(虚拟的产品经理)
  再让AI根据需求 生成设计稿 (虚拟的设计师)
  vibe coding
  再让AI 生成前端代码 (虚拟的前端开发)
  懂规矩 更专业 按流程 可执行
  生产级别的vibe coding 标准做法
  Spec-Driven Development(SDD) 规范驱动开发

第一阶段 基本不能用 大改特改 甚至不能运行 反而浪费时间
第二个阶段 好很多 但是也不能完全依赖它 还是要人工审核、调试
第三个阶段 直接落地

AI编程 = 提示词 + AI 编程工具 + AI 大模型 + SDD
Spec-Driven Development（规范驱动开发），简单说就是：先把“规则说明书”写清楚，再按说明书写代码。这里的“Spec”可以是接口文档、需求说明、行为描述，甚至是测试用例。

和“先写代码再补文档”不同，Spec-Driven 强调代码必须严格满足规范，而不是靠口头理解或临时改。这样做的好处是：需求更清晰、沟通成本更低、返工更少，也更容易做自动化测试。

举个例子：
你要开发一个“登录接口”。在写代码前，先写 Spec：

接口：POST /login

入参：username、password

成功返回：{ code: 0, token }

失败返回：{ code: 401, message }

然后你再写后端代码、前端调用、测试用例，所有人都以这份 Spec 为准。如果代码跑不通，就说明不符合 Spec，而不是“理解不一致”。

一句话总结：Spec 是合同，代码是履约结果。

## 计分小程序

- 第一个阶段
  简单prompt 太随意 大概率不符合需求 抽卡

- 第二个阶段 准备提示词 设计结构

- 第三个阶段 SDD规范驱动开发
  - 生成产品需求文档 (spec md)
    - 开始编写 旧 效率 专业性
    - Gemini 3 ,claude... 智能化能力提升
      规划、分布、多agent，执行的能力
      - Gemini 帮我们生成产品的需求文档

## Gemini 生成产品需求文档

- 你是一个大师级的微信小程序产品经理，我现在需要你帮我把想法变成需求文档，用于给到AI编程工具进行实现：
  两个维度
- 我们需要先讨论一下需求，等确定了所有的需求，我们在进行第二步

### 完整prompt

Role: Expert WeChat Mini Program Developer
Task: Create a standalone scoring Mini Program (offline-first).
Language: JavaScript (Native WeChat Framework), WXSS, WXML.

1. Project Context (项目背景)
   这是一个用于线下桌游（麻将、扑克）的通用记分工具。
   核心逻辑：基于“零和游戏”规则（Zero-Sum Game），即每局所有玩家的得分之和必须为 0。
   运行模式：单机版，无后端，所有数据存储在本地缓存（LocalStorage）。
   用户：通常由其中一名玩家操作，记录所有人的分数。
2. Tech Stack (技术栈约束)
   Framework: Native WeChat Mini Program (原生开发).
   Styling: Standard WXSS (Flexbox layout). Minimalistic design.
   Storage: wx.setStorageSync / wx.getStorageSync.
   Logic: No external dependencies. Pure JS logic.
3. Data Schema (数据结构设计)
   Please strict follow this JSON structure for LocalStorage key game_history.
   code
   JSON
   [
   {
   "id": "uuid_v4_string", // 唯一牌局ID
   "name": "2023-10-01 欢乐麻将", // 牌局名称
   "createTime": 1696123456789, // 创建时间戳
   "playerCount": 4, // 玩家人数 (2-6)
   "players": [ // 玩家列表
   { "id": 0, "name": "张三", "totalScore": 10 },
   { "id": 1, "name": "李四", "totalScore": -5 },
   { "id": 2, "name": "王五", "totalScore": -5 },
   { "id": 3, "name": "赵六", "totalScore": 0 }
   ],
   "rounds": [ // 对局记录流水
   {
   "roundId": 1,
   "timestamp": 1696123500000,
   "scores": [10, -5, -5, 0] // 对应 players 数组索引的分数变化
   }
   ]
   }
   ]
4. Page Flow & Requirements (页面逻辑)
   Page 1: Home (首页 - 牌局列表)
   UI:
   Show list of saved games (Name + Date + Player names).
   If list is empty, show a placeholder image + "Create New Game" button.
   Floating Action Button (FAB): "+" to create a new game.
   Interaction:
   Click item -> Go to Page 3 (Scoreboard).
   Long press item -> Option to Delete game.
   Page 2: Create Game (新建牌局)
   UI:
   Input: "Game Name" (Default: Current Date + "Game").
   Selector: "Player Count" (Range: 2 to 6, Default: 4).
   Dynamic Inputs: "Player Names" based on count (Default: P1, P2, P3...).
   Logic:
   On "Start": Initialize the data structure and save to LocalStorage, then redirect to Page 3.
   Page 3: Scoreboard (计分看板 - 核心页)
   Header:
   Grid layout showing current totalScore for each player.
   Highlight the winner (highest score) in Red, loser in Green.
   Body (List):
   Reverse chronological list of rounds (Round 10, Round 9...).
   Show specific score changes for that round (e.g., +10 | -5 | -5 | 0).
   Delete Function: Allow deleting the last record only (to prevent logic errors).
   Footer:
   Large Button: "Record Round" -> Opens Page 4.
   Page 4: Input Score (记分录入)
   UI:
   List of players. Each row has: Player Name + Input Field (Number).
   Auto-Balance Button: A button next to the last player or at the bottom.
   Logic: Calculates 0 - (Sum of other players) and fills the remaining field.
   Validation (Strict Zero-Sum):
   Before saving, check: Sum(scores) === 0.
   If Sum !== 0, show Toast error: "Total score must be 0! Current: +X".
   Allow input of 0.
   Save:
   On success: Update players.totalScore, push to rounds, save to LocalStorage, go back to Page 3.
5. Edge Cases (异常处理)
   Input Type: Ensure inputs handle negative numbers (keyboard type usually digit or number allowing -).
   Empty Input: Treat empty input as 0.
   Data Persistence: Update LocalStorage immediately after every round addition/deletion.

- 不要使用uniapp, vue, typescript, 使用原生的小程序开发， 再返回给我需求文档
