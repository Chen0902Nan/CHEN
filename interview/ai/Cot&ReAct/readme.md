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
