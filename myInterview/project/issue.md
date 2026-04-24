排查 Token 校验失败及连带问题
🚨 问题描述
用户反馈在发布笔记时接口返回 401 Unauthorized，提示 JWT 校验失败。
🔍 排查过程

1. 确认问题范围
   确认是大面积爆发，所有用户都遇到，并非个例。
   检查请求头，发现 Request Header 中明明携带了 Token，但依然报错 401。
2. 追踪代码链路
   梳理了前后端的数据流向：
   前端链路：usePublish.ts → createNote (api-notes.ts) → post (api.ts)
   后端链路：NotesController.create() → NotesService.create() → Prisma.note.create()
3. 逐步深入验证
   Step 1：验证 JWT 策略配置
   检查后端 jwt.strategy.ts 的密钥配置：
   code
   TypeScript
   secretOrKey: process.env.JWT_SECRET || 'redbook-secret-key'
   怀疑是 .env 中的 JWT_SECRET 没有被正确加载，导致使用了默认 fallback 密钥，从而与签发 Token 的密钥不匹配。
   Step 2：检查环境变量加载机制
   发现 NestJS 默认不会主动加载 .env 文件。
   修复方案：引入并配置 @nestjs/config 模块。
   code
   TypeScript
   // app.module.ts
   import { ConfigModule } from '@nestjs/config';

@Module({
imports: [
ConfigModule.forRoot({
isGlobal: true,
envFilePath: '.env',
}),
],
})
export class AppModule {}
Step 3：验证 Token 是否正确解析
在 Controller 层加入 Debug 日志，确认经过上一步修复后，Token 已经能正常解析出用户信息：
code
TypeScript
console.log('req.user:', req.user); // 确认 req.user.id 解析成功
Step 4：验证用户数据同步
去数据库核对用户信息：
code
SQL
SELECT id, email FROM users WHERE email = 'xxx@qq.com';
确认用户真实存在，且 userId 匹配无误。
Step 5：解决底层的并发/缓存问题
在链路走到 ORM 层时，发现 Prisma Schema 变更后没有同步。
修复方案：重新生成 Prisma Client 并重构项目，彻底解决：
code
Bash
npx prisma generate && npm run build
🔗 连带排查发现的问题
在排查上述问题的同时，我还顺藤摸瓜解决了另外两个隐藏 Bug：

1. 详情页图片无法显示（接口返回 500）
   排查发现获取详情接口 findOne 报错 500。检查 Controller 后发现是路由顺序匹配漏洞：
   code
   TypeScript
   // ❌ 错误顺序：动态路由在前面
   @Get(":id")
   async findOne() { ... }

@Get(":id/comments")
async getComments() { ... }
原因：NestJS/Express 是按代码定义顺序匹配路由的。当请求 /api/notes/xxx/comments 时，被最前面的动态路由 ":id" 错误拦截，导致把 xxx/comments 当作 ID 去查询数据库，从而引发 500 报错。
修复：将静态的精准匹配路由放在动态路由上方。2. 深层问题：图片 URL 返回 403
图片接口修好后，依然加载不出，看 Network 发现 OSS 返回 403 Forbidden。
原因与修复：检查云服务控制台发现 OSS Bucket 的权限设成了私有，将其修改为公共读 (Public Read) 后恢复正常。
📊 总结要点
问题现象 根本原因 解决思路与方案
401 Unauthorized .env 未加载，JWT secret 密钥不匹配 在 AppModule 引入 ConfigModule.forRoot()
500 Internal Error Prisma Client 结构缓存不同步 执行 prisma generate + npm run build
详情接口查出错误数据 路由定义顺序错误被提前拦截 **精准匹配（静态路由）**必须放在动态路由前
图片加载报 403 OSS Bucket 访问权限不足 前往控制台设置 Bucket 为公共读
💡 经验心得（面试亮点）
环境配置优先级：永远不要过分依赖框架的默认行为，环境变量加载机制需要显式声明和验证（框架默认配置 < 显式加载 < 代码硬编码）。
路由顺序极度敏感：在后端框架（如 NestJS / Express / Koa）中，路由是自上而下匹配的。永远遵循**“特殊优先，通用兜底”**的原则，静态路由一定要放在动态路由前面。
ORM 缓存防坑：使用 Prisma 这类强类型 ORM 时，一旦修改了 schema.prisma，肌肉记忆必须是跑一遍 prisma generate，否则极易出现类型与底层数据库不一致的玄学 Bug。
日志定位法：在复杂链路（前端 -> Controller -> Service -> DB）中，在关键节点打印关键变量（如 req.user），利用二分法排查能最快定位故障层级

# React 项目中 KeepAlive 缓存失效与首屏白屏排查

1. 情境与任务 (Situation & Task)
   <keep-alive> 的效果。但在开发过程中，我遇到了两个非常棘手的 Bug：
   首次加载白屏：第一次进入首页时页面全白，只有切换到其他 Tab 再切回来，页面才会正常渲染。
   滚动位置丢失：白屏解决后，发现组件状态虽然缓存了，但每次切回来滚动条都会回到顶部，给人一种缓存没生效的错觉。
2. 排查过程与解决思路 (Action)
   针对这两个问题，我进行了深度的排查与修复：
   🛠 问题一：首次加载白屏
   根本原因：React.lazy 异步加载与 KeepAlive 原理的执行时机发生了冲突。
   react-activation 的底层原理是依靠劫持组件的真实 DOM 来实现缓存的。
   而我为了做路由级优化，把所有的页面（包括首屏）都包裹在了 React.lazy 和 <Suspense> 中。
   导致的结果是：首次渲染时，首页还在异步下载，渲染出来的是一个 Promise，没有真实的 DOM 节点，KeepAlive 抓取不到目标，导致了白屏。当切走再切回来时，代码包已经加载完成，DOM 能瞬间生成，所以显示恢复正常。
   解决方案：
   将作为首屏的 HomePage 改为同步引入（首屏原本就该第一时间展示，不适合懒加载），完美解决了和 Suspense 的冲突。
   排查并移除了入口文件的 <React.StrictMode>（严格模式），避免 React 18 的卸载重载机制破坏 KeepAlive 的 DOM 劫持。
   🛠 问题二：滚动位置丢失
   根本原因：一开始我以为是缓存被销毁了，但我通过在组件内手写计数器测试，发现组件内部的 State 其实是成功保留的。查阅源码和文档后了解到，react-activation 默认只会缓存组件树（DOM 和 State），并不会去干预浏览器的原生行为（比如 Window 的滚动条位置）。
   解决方案：在包裹首页的 <KeepAlive> 标签上，显式添加了 saveScrollPosition="screen" 属性。让该库在卸载组件前自动记录当前 Window 的 scrollTop，在重新挂载时自动恢复。
3. 结果与总结 (Result)
   经过调整，我们的首屏实现了秒开。用户在各个 Tab 之间来回切换时，不仅数据完全保留，页面也能精准停留在之前的滚动位置，用户体验变得非常丝滑。
   💡 个人收获与反思：
   这次经历让我深刻体会到，引入第三方库时不能只照搬文档，必须理解它的底层核心原理（比如基于 DOM 劫持），还要考虑它和前端框架本身特性（如懒加载、严格模式）是否会有冲突。同时也让我彻底理清了前端业务中**“组件状态缓存”与“视图状态（滚动条）缓存”**其实是两个独立的维度。
   🎯 备考：面试官可能的高频追问
   Q1: 你刚才说 KeepAlive 是基于 DOM 劫持的，具体是怎么劫持的？
   答：
   react-activation 会在应用最外层的 <AliveScope> 中创建一个隐藏的“缓存池”（通常是一个隐藏的 div）。需要被缓存的组件，实际上是渲染在这个隐藏的缓存池里的。
   框架会利用原生的 document.appendChild 或 insertBefore 方法，把这些真实的 DOM 节点“搬运”到页面实际该显示的位置（比如 <Outlet> 中）。当路由切走时，再把 DOM 节点从视图中“搬回”隐藏的缓存池里，从而实现状态和真实 DOM 的保留。
   Q2: 为什么首页不用 lazy 懒加载？所有路由不用懒加载不是更好吗？
   答：
   懒加载（Code Splitting）的核心目的是为了减小首屏代码体积，加快首屏加载速度。
   但是，“首屏页面本身”就是用户一进来马上就要看到的。如果把首屏也做懒加载，会导致浏览器先下载主 JS bundle，解析执行后，再去发起一次网络请求下载首屏的 JS，这就白白增加了一次网络往返时间（RTT），反而拖慢了首屏。
   因此，首屏页面同步引入，非首屏页面异步懒加载才是前端路由分割的最佳实践。

## react-keepalive

- 第一步：建立“安全区”（AliveScope 缓存池）
  在应用的最外层（通常在路由之外），有一个 <AliveScope>。它会在页面中创建一个永远不会被 React Router 卸载的隐藏容器（这个容器本身是隐藏的，你可以理解为它在屏幕外，或者用了 display: none，但这只是容器的样式，不是核心原理）。
- 第二步：后台静默渲染
  当你用 <KeepAlive><HomePage /></KeepAlive> 包裹首页时，<HomePage /> 实际上并没有渲染在当前路由的 <Outlet /> 里。它是被强制渲染到了刚才那个“安全区（缓存池）”里面。
  因为缓存池不受路由切换的影响，所以 <HomePage /> 的 React 实例和 State 永远都在，不会被销毁。
- 第三步：真实的 DOM 搬运（劫持核心）
  既然组件渲染在缓存池里，那用户怎么在页面上看到它呢？
  切入首页时：react-activation 会使用原生 JS 方法（document.appendChild 或 insertBefore），把缓存池里已经生成好的 <HomePage /> 的真实 DOM 节点，直接“剪切”并塞进当前页面的占位符（Placeholder）中。
  切走首页时：在 React Router 准备销毁页面前，react-activation 会抢先一步，把那些 DOM 节点再“剪切”回隐藏的缓存池里保护起来。
