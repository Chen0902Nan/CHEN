import fs from "fs";
import path from "path";
// mvc server
import express from "express";
// 脚手架 SSR
import { createServer as createViteServer } from "vite";
// commonjs 超级变量 脚本执行的目录物理路径
// esm 并不支持__dirname
// 参数为空表示的就是当前目录
const __dirname = path.resolve();
const app = express();

async function start() {
  const vite = await createViteServer({
    // 中间件 指的是req和res的中间 也就是请求和响应的中间
    // 中间件 vite 有很多的中间件
  
    appType: "custom",  // 让vite接管html响应
  });
  // app使用vite里的所有中间件
  app.use(vite.middlewares);
  // 中间件是 express/koa 极简框架，在基于请求响应的http,利用一堆的中间件函数，
  // 添加各种服务的开发模式，比如说鉴权，请求体解析，日志，一个中间件提供一项服务
  // 洋葱模型
  // 中间件函数
  app.use(async (req, res) => {
    // 启用中间件,手写ssr
    // html + react component => html str 返回给用户
    try {
      // sync 同步，async 异步  ndoe特点：异步无阻塞
      // 同步读取模版文件 像java一样 方便控制流程
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8",
      );
      console.log(template,'0000000');
      
      // 让vite接管html
      // 处理html模版，并返回处理后的html
      template = await vite.transformIndexHtml(req.url,template);
      console.log(template,'111111111');
      // ssrLoadModule 加载服务器端入口，并返回一个对象，对象中包含render函数
      const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");
      console.log(template);
      // react 在服务端将组件和数据渲染为完整HTML字符串
      // 执行React SSR,得到HTML字符串
      const appHtml=await render()
      const html=template.replace('<!--app-html-->',appHtml)
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      res.status(500).end(err.message)
    }
  });
}

// 启动 搭建http响应
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
start();
