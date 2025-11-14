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
