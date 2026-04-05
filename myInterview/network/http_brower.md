## 浏览器的渲染机制

- 脑海中要有一张蓝图
- 首先浏览器拿到URL之后，会发起网络请求，开始下载HTML，
  HTML 是流式解析的，也就是边下载边解析，HTML解析器会把标签逐步解析成DOM Tree
  在解析过程中，如果遇到link,style等css请求，浏览器会发起CSS请求并交给CSS解析器，生成CSSOM树
- 接着，如果在解析HTML的过程中遇到JavaScript，默认情况下JS会阻塞DOM构建(document.title 修改节点) 浏览器会暂停DOM解析，交给V8引擎执行JS，执行完之后在继续解析HTML
- 然后，当DOM Tree和CSSOM Tree都构建完后合并生成Render Tree
  渲染树只包含需要显示的节点，display；none的节点不会进入渲染树
- 接着进入Layout(回流/重绘)阶段，浏览器会根据盒模型、位置、尺寸等信息计算每个元素在页面（文档流）中的几何位置和大小，生成布局树
- 然后是Paint(绘制)，浏览器会把每个元素的颜色、背景、阴影、边框等绘制出来
- 最后进入Composite(合成)阶段，浏览器会把页面拆成多个图层，比如transform,opacity,position:fixed、动画等元素可能单独成为合成层，然后交给GPU做图层合并，最终显示到屏幕上

总结:HTML解析->DOM树+CSSOM树 -> Render Tree -> Layout -> Paint -> Layer -> Composite

- html 优化
  - 语义化标签，有利于SEO，也利于代码的维护，而不是通篇优化
  - 合理使用id和class，避免重复选择器，便于样式与脚本维护
  - 懒加载非首屏幕DOM/资源，图片懒加载，降低渲染压力
  - 对于DOM，避免频繁操作DOM,可先缓存节点或用文档碎片批量更新
    document.createDocumentFragment()

- css 优化
  - 通配符，换成标签选择
  - 小图片(icon)转base64 减少HTTP请求 虽然CSS更大了，但是并发数减少了，性能相对更好，大资仍用外链避免css体积过大
  - 抽离通用样式，减少代码冗余。(面向对象) 基类
  - 合理使用css 变量，统一主题样式，便于维护
  - 避免使用!importrant
  - taildwindcss 原子类开发，很少需要去手写样式
    - 原子类css，组合样式，无需去写css
    - 原子类名语义化，减少命名成本
    - 团队风格统一，降低沟通成本
    - 按需编译，体积可控，适配响应式

- script
  - 放底部
  - <script src='' defer></script> 下载完后等HTML解析完后再执行
    <script src='' async></script> 下载完后立即执行
    都不会阻塞DOM树的生成
    defer DOM 下载完后去下载
    async 异步下载 下载后执行
  - 变量使用let/const 减少全局变量污染
  - 频繁DOM操作先缓存节点，批量更新
  - 函数拆分复用，避免冗长代码
  - 异步逻辑使用async/await，代替回掉地狱

- 性能优化
  - 减少回流(重排),重绘
    回流一定会触发重绘
    回流需要计算几何位置和尺寸，代价非常高
    - 触发方式
      修改 width/height.margin/padding
      修改fontSize
      DOM 插入删除
      读取布局属性 el.offsetHeight
      el.getBoundingClientRect() 元素相对视窗的关系

## 什么是Cookie

- Cookie是由服务器发送并存储在用户浏览器上的小型文本数据
- 其存在本身是为了解决HTTP请求无状态的特性。由于HTTP请求每次都是独立的，服务器不知道这次的请求和上一次的请求是否是来自同一个用户。Cookie就相当于服务器给每个浏览器用户带上一个身份证，浏览器后续的请求中都会自动带上这个Cookie，从而让无状态的HTTP请求，能够使服务器达到识别用户身份的效果。

- 服务器在HTTP响应头中通过Set-Cookie字段，将数据发送给浏览器
- 浏览器根据域名和路径将Cookie存储在本地
- 后续浏览器再次请求该域名的服务器时，都会自动在HTTP请求头的Cookie字段中带上之前存储的数据

相关属性：

- HttpOnly：如果设置了该属性，JS脚本就无法读取该Cookie，这是防御XSS的一种手段，在JWT双Token机制中就涉及了这个，存储refreshToken

