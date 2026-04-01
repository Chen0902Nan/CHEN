# 跨域

浏览器同源策略是跨域的根源。协议、域名、端口任何一个不同都是跨域。它是为了保护用户的数据安全，防止恶意网站窃取本地信息、改页面、发起非法请求，限制非同源网页读写资源与接口通信。

在日常开发中都是前后端分离的，端口就不一样了，还会使用各个部门、合作商的跨域接口

## jsonp

- jsonp(Json With Padding)
  主要用于跨域请求，JSONP最大的优点是在于它极其高的浏览器兼容性和简单性
  - es6 startsWith 判断req.url 以/say开始
  - jsonp 函数的封装，return一个Promise的实例，拿到json后的前端业务处理 thenable/await
  - 拼接请求参数 params json,for key in key=value放到数组里面 用&join一下
  - 实现细节
  1. 动态创建一个script标签 document.creatElement(),src 加载脚本不受同源策略的限制，src queryString除了自身参数外，再带上一个callback参数，值为callback + 随机数 (避免缓存)
  2. 后端先解析callback参数的值，设置响应头为text/javascript 返回json的数据用callback的值作为函数包裹返回，即json with padding

- 缺点
  - 容易遭受xss攻击，因为它是通过<script/>标签加载数据，无法有效验证来源。
  - 仅支持GET请求
  - 额外加载的script标签会阻塞页面渲染，影响性能。

- 现代应用推荐使用CORS代替jsonp

## CORS 预检请求

全程是Cross-Origin Resource Sharing
它是一种基于 HTTP 头的机制，允许服务器声明哪些外部源（域、协议或端口）可以访问其资源。通过 CORS，浏览器放行，能够安全地进行跨源数据传输，从而在保障安全的前提下，突破了浏览器同源策略的限制。
后端开发框架都有相应的CORS中间件，启用一下就好，也可以进行细节的设定

Access-Control-Allow-Origin \*所有,或者设置白名单
Access-Control-Allow-Method：GET,POST,PUT 只读，允许新增不可修改
Access-Control-Allow-Headers Content-Type
Access-Control-Allow-Credentials：true 是否允许发送凭据(cookie,HTTP认证信息)

如果是复杂跨域，会发送两次请求。多一次预检测请求(Preflight Request)
先发送 OPTIONS请求，服务器要配合返回CORS响应头设置,浏览器根据响应头进行预检，之后再进行复杂请求的真实处理。

- 使用了非简单方法 (如PUT,DELETE而不是GET或者POST)
- 使用了自定义的请求头 X-Custom-Header
- 请求内容类型不是application/x-www-form-urlencoded multipar/form-data 或 text/plain

### WebSocket 不是http协议，没有同源策略，可以跨域

- 先用http协议,连接用户
- new WebSocket(ws://url) 101 切换协议，建立双工通信
- 基于消息机制通信

### postMessage HTML5 特性

postMessage 是浏览器提供的API，允许不同源的窗口或iframe 实现跨域通信
iframe 标签 ， 网页里打开另一个网页，性能差，不建议用
举例：主站页面窗口，唤起第三方支付窗口支付，通过postMessage发送订单的详情，支付成功后，结果的回传

<iframe> 是 HTML 中的一个标签，它允许你在当前网页中嵌入并显示另一个独立的网页或文档，就像一个“画中画”的窗口。

## vite反向代理 proxy

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

大前端开发时，前端就做完了，很方便
跨域是基于同源策略的，http请求，这个是服务器策略
前端全栈开发本地开发的时候使用这个配置
前端需要后端提供api
vite proxy配置拦截 /api 请求
向后端api端口发送请求
vite的请求是后端向后端的请求，不受同源策略的影响，不存在跨域

## ngnix 反向代理 proxy

- 相对于vite 线上跨域proxy
- 80端口
  www.baidu.com -> dns ip->ngnix 默认代理80
  proxy 3000

  localhost/api domain/api -> 代理 localhost:3000/api

  server {
  listen 80; # 监听端口
  server_name localhost; # 当前服务域名

        # 前端静态资源（可选）
        location / {
            root   /usr/share/nginx/html;
            index  index.html;
        }

        # 👇 核心：代理 /api 请求
        location /api/ {

            # 👉 目标服务器地址（后端接口）
            proxy_pass https://api.example.com/;

            # 👉 修改请求头中的 Host（避免后端识别错误）
            proxy_set_header Host $host;

            # 👉 获取真实客户端 IP（生产环境常用）
            proxy_set_header X-Real-IP $remote_addr;

            # 👉 转发客户端 IP 链（多层代理时用）
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            # 👉 支持 https 场景（有些接口需要）
            proxy_set_header X-Forwarded-Proto $scheme;

            # 👉 关闭缓存（调试接口时很重要）
            proxy_cache_bypass $http_upgrade;
        }

  }
  推荐使用ngnix 的proxy_pass，配置反向代理
  ngnix 80 / 编译后的 index.html mian.jsx,app.jsx 前端就启动起来了
  /api接口请求 走ngnix proxy_pass 转向api.example.com 实现跨域代理
  适合部门或公司内部
  对于集团子公司，合作的其他公司，CORS的白名单配置更适合
