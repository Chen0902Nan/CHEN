# getJSON

- ajax 与 fetch 相比

  - fetch 简单易用，基于 Promise 实现
    （then）无需回调函数
  - ajax 基于回调函数实现，代码复杂

- 如何**封装**一个 getJSON 函数，使用 ajax
  支持 Promise
  - get 请求
  - 返回是 JSON
  - ajax thenable

## Promise

- promise 类，可以实例化，为异步变同步而（流程控制）实例化，事实标准
- 接收一个函数，函数有两个参数，resolve reject 也是函数
- .then , .catch

  - promise 实例 最初状态是 pending 等待
  - resolve() 成功 ，状态变为 fullfilled，then() 执行
  - reject 失败 ， 状态变为 rejected，catch()执行

## 引用式拷贝

- JS 变量内存分为栈内存和堆内存
  - JS 编译阶段 执行阶段
    变量提升 为这些变量分配空间
  - 栈内存 简单数据类型 值
    对象变量 引用地址
    连续的 快
  - 堆内存中 对象
    离散的 慢
