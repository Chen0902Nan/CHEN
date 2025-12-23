# AI 应用之冰球

## 前端应用 vue3

- 活动形应用
  冰球协会，上传宠物照片，生成冰球运动员的形象照片
  有趣 -> 分享到朋友圈

- vue 主要收集表单数据，上传图片 等
- ai 能力 通过调用 coze 工作流的 api 实现

## 数据业务

- 上传文件的预览图
  - 好的用户体验，图片可能很大，上传需要时间，预览图可以让用户知道在干什么
  - 数据状态 (值和改变)
    img:src="imgPreview"
    ref imgPreview
    filereader readasDataURL onload 读完了，赋值给 imgPreview
    goole 推出了 base64 编码，可以将图片转换成为字符串

## AI 应用业务开发

- 数据状态业务 imgUrl

- coze 工作流调用 看官方文档
- http post 请求业务
  - FormData() 对象 html5 提供的对象
  - fetch
    请求行 url + 方法
    请求头
    headers Authorization Bear
    body formData.append('file')
  - 返回的数据中 会有一个 code
    code=0 -> 成功
    否则会有 ret.msg
  - data 响应数据 id
