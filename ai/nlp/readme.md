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
