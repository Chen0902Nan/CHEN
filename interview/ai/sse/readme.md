# SSE 断连重传处理

SSE的异常处理的体验优化，容错处理

SSE是长连接，长时间没数据、网不稳、服务器嫌你挂太久(心跳机制)，就会自动断掉。
如何续上流式输出?

id:123
data:hello

如果终端了，客户端会自动带上Last-Event-ID:123

正确的断连重传设计

服务器要根据Last-Event-ID 重新推送数据

```js
app.get("/events", (req, res) => {
  const lastId = req.headers["last-event-id"];

  // 从消息队列 / 数据库中补发
  const missedEvents = getEventsAfter(lastId);

  missedEvents.forEach((event) => {
    res.write(`id: ${event.id}\n`);
    res.write(`data: ${event.data}\n\n`);
  });
});
```

- 客户端：自动重连 + 幂等处理

```js
const es = new EventSource("/events");
es.onmessage = (e) => {
  console.log(e.data);
};
```
