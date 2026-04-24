# NLP 自然语言处理

- JavaScript 在浏览器端完成机器学习任务
- **Brain.js** 是一个用于在**浏览器**和**Node.js** 中训练和运行**神经网络**的 JavaScript 库，让 JavaScript 开发者可以轻松实现机器学习。

  - 从前 python gpu
  - 现在 浏览器端也可以
  - 神经网络实现机器学习

- 基于神经网络实现机器学习的例子

  - bran.js 实现了神经网络
  - 知识/数据 让他学习
  - 基于新学习的内容 -> 回答问题 体现机器学习智能的表现

- 拿出样本数据 data
  const data = [
  { "input": "implementing a caching mechanism improves performance", "output": "backend" },
  { "input": "hover effects on buttons", "output": "frontend" },
  { "input": "optimizing SQL queries", "output": "backend" },
  { "input": "using flexbox for layout", "output": "frontend" },
  { "input": "setting up a CI/CD pipeline", "output": "backend" },
  { "input": "SVG animations for interactive graphics", "output": "frontend" },
  { "input": "authentication using OAuth", "output": "backend" },
  { "input": "responsive images for different screen sizes", "output": "frontend" },
  { "input": "creating REST API endpoints", "output": "backend" },
  { "input": "CSS grid for complex layouts", "output": "frontend" },
  { "input": "database normalization for efficiency", "output": "backend" },
  { "input": "custom form validation", "output": "frontend" },
  { "input": "implementing web sockets for real-time communication", "output": "backend" },
  { "input": "parallax scrolling effect", "output": "frontend" },
  { "input": "securely storing user passwords", "output": "backend" },
  { "input": "creating a theme switcher (dark/light mode)", "output": "frontend" },
  { "input": "load balancing for high traffic", "output": "backend" },
  { "input": "accessibility features for disabled users", "output": "frontend" },
  { "input": "scalable architecture for growing user base", "output": "backend" }
  ];

  - input 给大模型的输入
  - bran.js 计算后
  - output 输出
  - -> 机器学习中的比较简单的分类问题
  - 数据准确性、丰富性很重要

- 实例化对象 network
  const network=new brain.recurrent.LSTM()
  // 把数据给他学习一下
  // 需要时间训练
  network.train(data,{
  interations:2000,
  log:true,
  logPeriod:100,
  })
- 创建输入
  const output=network.run(
  "CSS flex for complex layout"
  )
- 打印输出
  console.log(output)

## 大模型训练师 trainner

## 25 年 AI 的发展

- openai 发布了 Sora2 冲击 tiktok
- 豆包植入了一键购买功能 AI 电商
- openai 发布了 Atlas AI 浏览器 冲击 Google
- to B（to Business） 企业端 AI Agents 正在提高效率 to C（to Consumer）

使用大模型来搜索、解决问题 LLM 有比百度/淘宝更好的**用户体验**，
很多用户用，当用户产生依赖 -> 流量 -> money
