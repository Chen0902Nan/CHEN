## 跨域问题

- 什么是跨域？
  浏览器同源策略是跨域的根源。协议、域名、端口任何一个不同都是跨域。它是为了保护用户的数据安全，防止恶意网站窃取本地信息、改页面、发起非法请求，限制非同源网页读写资源与接口通信。

- 为什么要解决跨域？
  在日常开发中都是前后端分离的，端口就不一样了，还会使用各个部门、合作商的跨域接口，比如进行微信支付，支付宝支付等

### 前端如何解决跨域问题

#### JSONP Json With Padding

- 简单来说，JSONP (JSON with Padding) 是一种利用 动态创建<script/> 标签不受浏览器同源策略限制的特性，来实现跨域数据请求的‘黑客式’技术。

- 前端（Padding 定义）：前端在 window 对象上预先挂载一个全局回调函数，并利用 Promise 对请求进行封装。在构建请求 URL 时，通过 callback 参数把这个函数名传给后端。

- 后端（Padding 注入）：后端解析出 callback 参数，将准备好的 JSON 数据通过函数调用的方式包裹起来（例如返回 callbackName({...})），并将响应头 Content-Type 设置为 text/javascript。

- 浏览器（数据交付）：浏览器加载该脚本后，会将其当作 JS 代码执行。这一执行，正好触发了前端预设好的 window 上的函数，从而将后端数据传递给前端。

- 缺点
  - 容易遭受xss攻击，因为它是通过<script/>标签加载数据，无法有效验证来源。
  - 仅支持GET请求
  - 额外加载的script标签会阻塞页面渲染，影响性能。

#### Vite 反向代理

- 反向代理的逻辑

1. 前端（本地开发）：通常运行在 http://localhost:5173。
2. 后端（接口服务器）：通常运行在 http://localhost:3000。
3. 如果直接请求，浏览器会检测跨域，拦截请求，不让前端拿到数据
4. 通过Vite反向代理，我们可以让前端不再请求localhost:3000,而是请求自己的服务器，比如说localhost:5173/api/users，Vite代理服务器拦截到这个请求，将这个请求转发给真正的后端localhost:3000/api/users，这样能成功的原因是服务器与服务器之间不存在同源策略，同源策略是浏览器机制，所以后端可以顺利响应，然后Vite再把结果传回给前端

- Vite配置 vite.config.js

```
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // 匹配所有以 /api 开头的请求
      '/api': {
        target: 'http://localhost:3000', // 真正的后端地址
        changeOrigin: true,             // 开启代理：修改请求头中的 Host 字段，将其伪装成target地址
        rewrite: (path) => path.replace(/^\/api/, '') // 路径重写：把 /api 去掉  前端请求的是/api/say 后端接口是/say 没有/api前缀
      }
    }
  }
})
```

vite反向代理只适用于开发状态，打包不会吧开发服务器、代理规则这些开发工具打包进我们的项目里。
vite实现的反向代理方便前端开发，只需要得到后端提供的接口就好了，不需要后端做任何配置

#### WebSocket 和 postMessage也可以解决跨域问题

- webSocket本身不属于HTTP协议，他是用的是ws://或者wss://协议，同源策略仅仅适用于http协议，所以websocket根本不存在同源策略的限制，
- 先用http协议,连接用户
- new WebSocket(ws://url) Upgrade请求 101 切换协议，建立双工通信
- 基于消息机制通信

postMessage 是浏览器提供的API，一个HTML5新特性，允许不同源的窗口或iframe 实现跨域通信
iframe 标签 ， 网页里打开另一个网页，性能差，不建议用
举例：主站页面窗口，唤起第三方支付窗口支付，通过postMessage发送订单的详情，支付成功后，结果的回传

<iframe> 是 HTML 中的一个标签，它允许你在当前网页中嵌入并显示另一个独立的网页或文档，就像一个“画中画”的窗口。

“postMessage 本质上是一种通过浏览器内核桥接的‘受控通信机制’，它不是在直接进行资源读写，而是基于事件驱动的消息传递。
之所以它能跨域，是因为：
它不是网络请求：它不走 HTTP/HTTPS 协议栈，而是浏览器提供的内部通信 API，因此不属于同源策略限制的 Ajax 请求范畴。
它是‘显式授权’的：同源策略的初衷是防止未授权的脚本读取敏感数据。而 postMessage 要求发送方和接收方显式地确认目标和来源（通过 event.origin），这相当于在两个不同源的文档之间建立了一个‘信任连接’，从而在安全的前提下实现了通信。”

### CORS 预检请求

CORS是目前Web开发中最主流、最标准的跨域解决方案
CORS的核心在于浏览器会自动在HTTP请求头中添加信息，而服务器通过响应头来告知浏览器是否允许跨域

前端通过请求头：Origin:http://a.com 告诉后端我是谁
后端收到请求后通过设置响应头：Access-Control-Allow-Origin:http://a.com 来设置白名单，允许前端的访问

浏览器对比二者，如果匹配，则允许前端代码读取服务器返回的数据，如果不匹配或者没有这个响应头，浏览器就会报跨域错误

- CORS请求分为简单请求和复杂请求

1. 简单请求 GET、POST、HEAD
   只能包含标准的请求头：Content-Type:仅限于text/plain,multipart/form-data,application/x-www-form-urlencoded
2. 预检请求 PUT、DELETE
   请求头设置了Content-Type:allication/json的请求
   浏览器会先发送一个OPTIONS请求
   浏览器先询问服务器，我接下来要发送一个PUT请求，你允许吗
   后端服务器响应，返回
   Access-Control-Allow-Methods:PUT
   Access-Control-Allow-Headers:Content-Type等信息
   只有预检通过了，浏览器才会发送真正的业务请求

- 关键响应头
  Access-Control-Allow-Origin:允许访问的白名单
  Access-Control-Allow-Methods:允许访问的方法
  Access-Control-Allow-Headers:允许前端携带的自定义Header
  Access-Control-Allow-Credentials:是否允许携带Cookie，

### Ngnix 反向代理

- 通过使用 Ngnix反向代理处理跨域问题，是一种架构层面的方法。前端不需要处理跨域问题，后端也不用写复杂的CORS逻辑，所有跨域限制在进入真正的后端业务逻辑之前，就被Ngnix在网关层处理掉了

- 核心原理：同源欺骗
  - 原来的情况
    前端a.com，后端api.b.com -> 跨域
  - Ngnix将a.com和a.com/api都指向同一个Ngnix
    前端请求a.com/api/user
    Ngnix拦截到/api的前缀，将请求转发给api.b.com/user
    浏览器视角：我的所有请求都是发往a.com的，符合同源策略

- Ngnix 两种设置

1.  透明代理 location中设置前端静态资源， proxy_pass中将请求转发到后端地址
    server {
    listen 80;
    server_name a.com;

        # 1. 前端静态资源
        location / {
            root /var/www/html/dist;
            index index.html;
        }

        # 2. API 接口反向代理
        location /api/ {
            # 将请求转发到后端地址
            proxy_pass http://api.b.com/;

            # 关键 Header 传递
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

    }

2.  手动配置响应头

location /api/ { # 强制给后端响应加上 CORS 头
add_header 'Access-Control-Allow-Origin' '$http_origin' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization' always;

    # 提前处理 OPTIONS 请求
    if ($request_method = 'OPTIONS') {
        return 204;
    }

    proxy_pass http://api.b.com/;

}

3. 性能优化策略

- 启用gzip压缩，减少(传输体积)
  对于JSON数据效果尤其明显，大约可以减少70%——90%的体积

```
gzip on;
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/json;
gzip_min_length 1k; # 小于 1k 不压缩，节省 CPU
gzip_comp_level 6;  # 压缩等级 1-9，6 是性价比最高的折中点
```

- 利用Ngnix作为缓存层(降低后端压力)
  如果是 GET 请求的接口（如基础数据查询），可以在 Nginx 层缓存，直接返回，无需打到后端。
  区别于浏览器强缓存，主要是高配API请求，强缓存主要是静态资源

```
proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m;

location /api/ {
    proxy_cache my_cache;
    proxy_cache_valid 200 302 10m; # 200/302 状态缓存 10 分钟
    proxy_cache_valid 404 1m;
    proxy_pass http://backend_server;
}
```

调整缓冲区配置
如果你的 API 返回数据较大，Nginx 默认缓冲区可能不够，导致写临时文件，从而产生磁盘 I/O。

```
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
```

- 开启 Keep-Alive (长连接)
  默认情况下，Nginx 到后端后端是短连接，每次请求都 TCP 三次握手。开启长连接能显著降低延迟。

```
upstream backend_server {
    server 127.0.0.1:8080;
    keepalive 32; # 保持 32 个空闲连接
}

location /api/ {
    proxy_http_version 1.1;
    proxy_set_header Connection ""; # 清除 Connection 头，使之支持 Keep-Alive
    proxy_pass http://backend_server;
}
```

如果条件允许，我首选 Nginx 反向代理。我会通过路径映射，把前后端部署在同一个域名下，从根本上绕过跨域限制。这不仅性能最好（OPTIONS 请求直接在 Nginx 层消化），而且解耦了业务代码，便于统一管理安全策略。
如果是分布式或微服务架构，或者业务上有对外提供 API 的需求，我会选择 CORS。但我会由 Nginx 或 API 网关统一注入 CORS Header，而不是让每个业务后端单独配置。
