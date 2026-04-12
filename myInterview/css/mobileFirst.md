## 移动端适配

1. Viewport 单位适配（vw/vh）—— 最推荐
   这是目前最简单、最现代的方案。vw（Viewport Width）将视口宽度分为 100 份。
   原理：1vw 等于视口宽度的 1%。
   做法：配合 PostCSS 插件（如 postcss-px-to-viewport），在开发时你依然写 px，插件会在构建时自动将其转换为 vw。
   优点：不需要任何 JS 代码，渲染性能最好，能够完美解决“大屏显示更多内容，小屏显示精简内容”的需求。

2. REM + 动态 Font-size —— 经典方案（常用于老项目）
   这曾是淘宝（lib-flexible）的方案，通过动态修改根元素 <html> 的 font-size 来实现适配。
   原理：1rem 等于根元素字体大小。屏幕变大，根元素 font-size 变大，整个页面的元素等比例放大。
   做法：
   通过 JS 根据屏幕宽度计算 document.documentElement.style.fontSize。
   利用 px2rem 工具将代码中的 px 转为 rem。
   缺点：依赖 JS 执行，可能会有闪屏；且在非常大的屏幕上，元素会无限放大，不够美观，通常需要设置最大宽度限制。
3. CSS 媒体查询（Media Queries）—— 响应式开发
   这是应对“从手机到平板到桌面”全平台适配的利器。
   原理：通过 @media 条件判断，在不同屏幕区间应用不同的 CSS 规则。
   适用场景：响应式网站（如官网）。通常用于调整布局结构，比如手机端是单列，平板是双列，PC 是四列。
   示例：

```
   .container { width: 100%; }
   @media (min-width: 768px) {
   .container { width: 750px; } /_ 平板以上固定宽度 _/
   }
```

缺陷：基于视口
改进：@container 容器查询

4. Flex + Percentage（弹性比例）—— 轻量级方案
   如果你不需要极致的等比例缩放，只想让页面在不同屏幕下“撑满”或“对齐”，这是最高效的。
   原理：利用 display: flex 的剩余空间分配能力，结合 % 或 max-width。
   适用场景：简单的移动端 H5 页面。
   核心逻辑：只要不写死像素宽度（width: 300px），多用 width: 100% 或 flex: 1，页面就能随容器自动拉伸。
   💡 顶层工程师的“防坑指南”：
   必须要做的第一步：在 HTML 的 <head> 中添加 Meta 标签：

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
没有这一行，手机浏览器会模拟 PC 宽度（通常是 980px），导致页面文字极小，完全无法使用。
不要在移动端使用固定宽度：永远不要写 width: 375px，这会让你在不同型号的手机（如 iPhone 14 Pro Max 宽度是 430px）上出现横向滚动条或留白。
1px 问题：在高清屏（Retina）上，CSS 写 1px 边框会显得很粗。
现代方案：使用 transform: scale(0.5) 进行缩放，或者利用 box-shadow 模拟细线。
字体大小不要用 vw：这是新手常犯的错误。文字大小建议使用 px，并结合 @media 进行阶梯式调整（比如手机端 14px，平板端 16px）。如果文字也随着屏幕比例缩小，用户阅读体验会极差。

## 标准/怪异盒模型

- box-sizing: content-box 标准盒模型
  width和height只包含content内容区域
- boxsizing:boder-box
  最早由IE浏览器引入，是一种更符合开发者直觉的计算方式
  width 和 height 包含内容 (Content) + 内边距 (Padding) + 边框 (Border)。
