# Ajax 数据请求

Ajax 全程 Asynchronous(异步) JavaScript and XML

- 流程

  - 实例化
  - open 打开一个请求
    method GET POST
    url
    async true/false
  - send 发送请求
  - 事件监听
    - onreadystatechange
      status 200
      readyState 4
      xhr.responseText
      JSON.parse(xhr.response)

- ready
  - 初始化
  - 打开
  - 发送
  - 接收
  - 完成
