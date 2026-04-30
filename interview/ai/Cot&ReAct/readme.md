## Cot & ReAct

### Cot Chain of Thought

Prompt技巧，让模型一步一步思考

### React 在思考的基础上，让模型可以调用工具去行动

### Cot

一个商品100块，再打八折再减10块，多少钱?

原价100
打八折:100\*0.8=80
再减10:80-10=70
最终答案:70
更准确
可解释
Cot 本质是 Prmpt Engineering 不需要额外训练

使用场景：
数学推理
逻辑推理
多步骤问题

### ReAct

ReAct=Reason(推理)+Act(行动)
他不仅会想，还可以调用工具，比如查数据库，调API
东京今天天气怎么样？适不适合跑步？

ReAct
Thought：我需要获取东京天气
Action：调用天气API
Observation：返回天气数据
Thought：根据天气判断是否适合跑步
Final Answer：

JS + OpenAI 函数调用 React llm with tools

ReAct其实就是让LLM具备Agent能力，通过工具调用 把思考和执行结合起来

# 说说ReAct框架 Thought-Action-Observation各是什么

## ReAct是什么

ReAct是一种Agent执行框架，全称 Reasoning and Acting，它让Agent在每一步都先推理(Thought)，再执行动作(Action)，然后观察结果(Observation)，循环往复直到任务完成

## 为什么要有Thought 这一步？直接让LLM输出Action不行吗？

如果没有Thought，LLM看到任务就直接输出工具调用命令，错误率极高。
因为复杂任务需要多步推理，LLM如果不先想清楚下一步该做什么，为什么这么做，工具可能乱选、参数填错、逻辑跳步等

Thought 本质是 Chain of Thought(Cot)，在Agent场景的应用
Cot 让LLM在回答问题前先写出推理过程(重要)
ReAct让Agent在执行前先写出决策依据
不是装饰性的步骤，而是保证Agent不出错的核心机制

## 为什么直接输出 Action会出错？

帮我查明天北京到上海的航班，选最便宜的经济舱。

没有Thought的Agent，就像一个不经思考就行动的人，看起来快，但错的也快
第一次调用：输出 {"tool": "search_flight", "from": "北京", "to": "上海", "date": "明天"}。
明天是一个相对概念，tool需要准确的时间

llm可以直接给出 tool json 描述，没有thought 不准确 API调用失败

第二次轮询调用，上一次的错，找到正确的时间，再做一次
多轮对话，token消耗增加

第三次调用 llm看到10个航班，直接输出
{"tool": "book_flight", "flight_id": "CA1234"}
没有比价，中间没有推理过程，任务失败

Thought 先用token，不浪费，更精确，降低成本
没有Thought的Agent在复杂任务下的错误率可能是有Thought的3-5倍
重试的成本远高于多写几句推理

问题在于LLM没有机会停下来想一想

1. 参数格式错误
   LLM 不知道API要求的日期格式是什么，自然语言 明天 填入
2. 逻辑跳步
   没有拿到最低价 llm 跳过了比价环节 直接订票 没有想清楚任务的完整步骤
3. 目标偏离
   任务要求，最便宜的，llm没有显示推理 我需要比较价格，随便选一个

## 为什么ReAct 要加Thought步骤

Thought不是给人看的日志(AI的执行流程可读，方便调试)，而是给llm自己看的推理过程
LLM在Thought里写，当前状态是什么？下一步应该做什么，为什么这么做？

一个人去超市买菜 冲进去随便拿几样就结账
ReAct 的Thought使用Cot 先列购物清单(Thought)，再去拿东西(Action),拿完检查一遍(Observation)，确认没问题就结账

## Action 执行：Agent调用工具，执行具体操作

结构化指令，JSON
Action是Thought的直接结果。
LLM在Thought里想清楚了 要调用什么工具、参数是什么

## Observation(观察)

Agent接收工具返回的结果，更新当前状态
工具执行后返回的数据

observation会发送给LLM 作为下一轮Thought的输入

状态更新了
接下来调用book_flight

## Thought的本质是chain of Thought

Thought不是ReAct发明的新东西，而是Chain of Thought(Cot)在Agent场景的应用

Cot是2022年Google 提出的一种提示技术，核心思想是让LLM在回答问题前先写出推理步骤

Roger 有5个网球，它又买了2罐，每罐3个球，他现在有了多少个球？

Roger原有5个，买了两罐，每罐有三个，所以是 2\*3=6,加起来5+6=11个
然后输出11个

LLM的推理能力不是想清楚了再输出，而是边输出边推理。当LLM被要求先写推理过程，它在生成每个token的时候都在做推理，写完退出后。
最终答案自然就更可靠

## Thought 会不会浪费token
会，但这是精度换成本的合理买卖，
一个典型的Thought 大约50-100 tokens
一个5步的 Thought 消耗 250-500 tokens
没有Thought,Agent错误率会显著提升 重试的成本可能会高于Thought,

方案 A（无 Thought）：直接输出 Action，平均每个任务 4 步完成，每步 200 tokens（包括 prompt 和 response），总消耗 800 tokens。但错误率 25%，错了需要重试，重试平均 2 次，实际消耗 800 × 1.5 = 1200 tokens。

方案 B（有 Thought）：每步先输出 Thought 再输出 Action，平均每步 300 tokens（多了 100 tokens 的 Thought），总消耗 1200 tokens。但错误率只有 8%，几乎不需要重试，实际消耗就是 1200 tokens。

Thought 可调试性 

## ReAct 和 Cot
Cot 只推理不行动
ReAct 推理之后还能执行。
Cot 是一种提示技术，用于提升LLM在复杂推理上的准确率。
他的输入是问题，输出是推理过程+最终答案  全程是文本，没有工具调用。

ReAct Agent执行框架，用于让Agent完成需要多步工具调用的任务。
输入是任务，输出是工具调用序列加最终答案。

比如"帮我查明天北京到上海的航班"，ReAct 的输出是"Thought: 需要调用 search_flight 工具 → Action: 调用工具 → Observation: 拿到结果 → Thought: 需要比价 → Action: 选择最便宜的 → 最终答案"。

ReAct 的Thought 步骤借鉴了Cot的思想。