// sse 本质是服务端推送事件，推过来的就是流式数据
// 其实和文件流 二进制流 没区别 只不过是按行读取
// fetch 反而更适合 不只是get。定义body 请求体
// fetch 天生是支持流式传输的 响应体是可读流
fetch(url, {
  method: "post",
  body: JSON.stringify({}),
});
response.body.getReader();
// xhr 不支持流式传输
new EventSource(url); // 只支持GET请求 url写死
