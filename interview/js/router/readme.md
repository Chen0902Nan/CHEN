# 路由

react-router-dom vue-router

- 传统的mvc开发 是基于请求响应的
  页面会白一下，重新渲染
- 前端路由  
  单页应用 前后端分离
  单页应用

- SPA 的原理
  前端接管页面路由
  url要改变，页面不会改变
  - hash
    #name 额外需要hash部分 丑
    锚点 hash改变，页面不会改变
    hashchange 事件
    优点是兼容性好
  - history html5
    让前端路由和后端路由一样
    history pushState
    replaceState
  - 维护了访问历史
