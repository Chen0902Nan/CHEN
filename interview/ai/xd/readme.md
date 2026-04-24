# 向llm聊天框中提出一个问题(我的微信小店今天有点跌幅，分析一个问题)的整个agent响应流程，越详细越好

Agent=harness + llm
harness=context+memory+permission+hooks+tools

用户可能在小龙虾或飞书机器人输入框输入 '微信小店今天涨幅'，我们将开发一个小店自动化运营Agent 来提供相应的服务，他基于harness架构。

Agent 首先通过Context+Memory 做意图识别 ：结合历史对话或用户店铺消息，判断这是一个电商经营分析任务，同时补充上下文(时间，店铺名字)
接着进入model(LLM)决策阶段：LLM基于当前context,规划调用MCP工具，决定先查数据再分析。
在tools层，MCP Client调用数据库工具，从Server拉取订单、流量、转化率、客户单价等核心指标数据。
数据返回后，触发数据分析skill(封装高级运营经理的能力)，该skill由skill.md 定义能力边界，并通过渐进式加载(无关业绩分析的不加载) 补充分析资源，避免上下文过大。
具体计算不由LLM完成，而是通过scripts计算。
最后通过流式输出返回结论和优化建议。
