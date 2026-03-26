const Koa = require("koa"); //commonjs
const webSocket = require("koa-websocket");

// 给server app添加 websocket能力
// server 就可以实时的和用户通信了
const app = webSocket(new Koa());

const clients = new Set(); // 用户端连接集合

app.use(async (ctx) => {
  // 启动一个中间件 处理http请求
  // ctx = req + res
  // 响应的内容是 string
  ctx.body = `
  <!DOCTYPE html>
  <html>
  <head>
  <title>Chat App</title>
  </head>
  <body>
  <div id="message" style="height:300px";overflow-y:scroll;></div>
  <input type="text" id="messageInput"/>
  <button onclick="senMessage()">发送</button>

  <script>
  // html5 WebSocket 对象
  // ws:// websocket 协议 不是http://
  const ws=new WebSocket('ws://localhost:3000/ws')
  ws.onmessage=function(event){
   const message = document.getElementById('message');
  message.innerHTML+='<div>'+event.data+'</div>'
  }
  function senMessage(){
    const input=document.getElementById('messageInput')
    ws.send(input.value)
    input.value=''
  }
  </script>
  </body>

  </html>
  `;
});

// webSocket
// 处理webSoket链接
app.ws.use(async (ctx, next) => {

  
  clients.add(ctx.websocket);

  ctx.websocket.on("message", (message) => {
    for (const client of clients) {
      client.send(message.toString());
    }
  });

  ctx.websocket.on("close", () => {
    clients.delete(ctx.websocket);
  });

});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
