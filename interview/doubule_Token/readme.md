# 字节面试题

项目采用Access Token + Refresh Token 双令牌鉴权：
AccessToken 有效期短(如15分钟)，用于接口请求
RefreshToken 有效期长(如7天)，仅用于刷新Access Token

Token 存在localStorage极其容易被XSS窃取，攻击者拿到就能伪造请求盗用身份，这就是AccessToken 不安全的核心原因。

短时效，AccessToken 负责接口鉴权的同时还负责保护接口安全。
长时效，RefreshToken 负责无感刷新，减少频繁登录，降低盗号风险。

问题：当AccessToken已过期，页面同时发起多个异步请求(例如3-5个接口一起调用)

/api/xxx Authorization AccessToken: 401
.../api/xxx1 xxx2
所有请求几乎同时收到 401 未授权

/api/refreshToken RefreshToken

axios 请求响应拦截
开关 isRefresh=false|true

一个页面可能会同时存在多个网络请求文章、头像、状态栏...
多个请求重复refreshToken，会造成一个覆盖、混乱的问题

其余请求等待，原来的请求 等待新token来了后，重新发送
队列去存储请求

返回结果前，用户的请求队列 怎么处理

请设计方案：
在refreshToken 有效时，只发一次刷新请求，
刷新期间其他请求要挂起、排队
刷新成功后所有排队请求用新token自动重发
刷新失败，refreshToken也过期，统一跳转到登录页面，清空队列

1. 全局状态变量
   // 锁
   let isRefreshing=false
   // 等待重发的请求队列
   let requestQueue=[]
2. 请求拦截
   axios.interceptors.request.use(config => {
   const token = localStorage.getItem('accessToken');
   if (token) {
   config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
   })
3. 响应拦截器

```js
axios.interceptors.response.use(
  (res) => res.data, //200
  async (err) => {
    const res = err.response;
    const config = err.config;
    if (res.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          // config其实是一个请求对象
          requestQueue.push(config);
        });
      }
    }
    ifRefreshing = true;
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const { accessToken } = await axios.post("/refreshToken", {
        refreshToken,
      });

      localStorage.setItem("accessToken", accessToken);

      requestQueue.forEach((cfg) => {
        cfg.headers.Authorization = `Bearer ${accessToken}`;
        axios(cfg);
      });
      // 队列清空
      requestQueue = [];
      config.headers.Authorization = `Bearer ${accessToken}`;
      return axios(config);
    } catch (err) {
      localStorage.clear();
      requestQueue = [];
      location.href = "/login";
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
    return Promise.reject(err);
  },
);
```

## Vite的打包原理

前端工程化 Webpack/Vite

Vite 是尤雨溪(Vue作者)开发的现代前端构建工具，依托原生ESM与esbuild，工程化上实现秒级冷启动，热更新

webpack 不支持esm，根据依赖关系链条
a.js->b.js->c.js
node fs readFile
打包？
c.js
b.js
c.js
打包成了一个文件 bundle.js 文件越多，花的时间越多
一次打包完成后，才能运行项目

- webpack 需要打包，不打包没有模块化的能力
  启动时间很长，但之后很快
- vite 原生支持ESM 秒级 懒加载？ 不打包
  <script type="module" src="/src/main.js"></script>

  开发阶段直接，直接抛弃旧浏览器，es11+
  现代主流浏览器已原生支持ES Module 无需打包即可浏览器直接运行文件
  按需加载模块，省略编译打包，实现极速启动与即时热更新

  webpack会把零散的js，组件 依赖全部整合压缩，打包成少数几个浏览器能识别的文件。传统方案必须先整体打包才能运行，启动慢，更新也要重新编译

  Webpack 会分析模块依赖关系，梳理执行顺序，递归整合所有JS资源，统一封装打包为浏览器可直接运行的代码

esbuild 是用Go语言写的极速JS/CSS打包压缩工具，比webpack(node)快10-100倍，Vite用它做依赖预构建、TS/JSX 转移，代码压缩

### Vue3 + TS + Style + 路由懒加载，说下Vite过程

1. 执行vite dev (npm run dev)，先用esbuild 预构建第三方依赖(Vue，Vue-Router)，解决浏览器ESM 缓存依赖提升二次启动速度
2. 项目源码解析与转义

- 浏览器入口main.ts，通过type="module"识别ESM模块
- 遇到TS，VUE，stylus 文件交由esbuild实是转义，TS编译为JS，css，按需单独编译，即时返回
- 全程无全量合并编译需求，做到秒级冷启动

3. 路由的懒加载
   路由中()=>import('@/views/xxx.vue') 天然利用ESM 动态import()能力，访问对应路由时，浏览器才异步请求该页面模块，实现按需加载，分割代码

4. HMR热更新流程
   修改Vue组件，样式，TS代码后，Vite精准监听文件变化。只重新编译当前修改的单个模块，通过HMR 通信局部 替换更新，不刷新页面，保留页面状态，毫秒级生效

5. 生产打包
   切换生产环境 npm run build(vite build)
   完成代码的合并
   Tree-sharking(代码精简，无关的代码移除) 压缩(换行？)、静态资源优化、路由懒加载代码分割、输出高性能的上线代码包

   utils.js
   export const funA=()=>'业务要用'
   export const funB=()=>'完全没使用'

   //main.js
   import {funA} from './utils'
   funA

   Tree-Sharking 会自动剔除从未引入、从未执行的funB，打包时只保留有效代码，减小包体积

   压缩图片、字体 
  