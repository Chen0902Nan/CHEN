## 移动端适配

- 核心布局 Flexbox + Grid + 相对单位

1. 视口单位用vw/vh 确保元素始终相对于视口大小进行缩放，无需计算
   在移动端还要注意100vh在部分旧的浏览器中可能包含地址栏高度的问题，要用dvh来修正
2. 弹性盒子与网格布局
   利用flex:1、justify-content、align-items等属性处理内部元素的自适应分布，对于复杂的二维布局可以采用 Grid

- 字体与间距的动态缩放方案

1. rem + 动态字体大小
   所有字体、间距、宽高都使用rem单位，rem大小取决于根元素html的字体大小，如果html的font-size=16px，那1rem=16px
   页面上所有使用 rem 的元素（宽、高、字体、间距）都会根据这个根字体大小自动等比缩放
2. 利用CSS原生函数clamp(min,preferred,max)来实现字体和间距的平滑缩放

- 媒体查询和容器查询

1. Mobile First：默认样式针对小屏编写，通过mid-width逐步增大屏样式
   @media(min-width:768px)手机
2. 容器查询：@container
   传统的媒体查询时基于视口的，而容器查询时基于父元素容器的

## 标准/怪异盒模型

- box-sizing: content-box 标准盒模型
  width和height只包含content内容区域
- boxsizing:boder-box
  最早由IE浏览器引入，是一种更符合开发者直觉的计算方式
  width 和 height 包含内容 (Content) + 内边距 (Padding) + 边框 (Border)。
