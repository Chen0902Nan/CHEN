# CSS 超级 stylus

- 更快的 CSS
  css rules
  .card{
  width：50px;
  height:40px;
  }
- stylus css 超级
  npm i -g stylus
- Stylus 是一门富有表现力的 CSS 预处理器，语法简洁优雅，支持变量、函数、混合（mixins）、嵌套等特性，能大幅提升 CSS 的编写效率和可维护性。
  但是浏览器只能直接解析成 css 文件，stylus 是一种预处理器，所以需要编译成 css
- 编译脚本
  命令行：stylus style.styl -o style.css
  编写边编译(订阅发布者模式)
  stylus style.styl -o style.css -w

- stylus 增强了 css 的编程性

  - 嵌套
    模块化能力
    作用域
    自动补全前缀

- &.active 这个嵌套是上级是同一级别

- 弹性布局

  - display：flex 弹性格式化上下文
  - 移动端布局的主角
  - 父子们（父为自身）一起的一种布局方案
  - 子元素块级能力丢失，不会换行 适合做多列布局

  - justify-content（水平） | align-items
    flex 专用
    默认 flex-direction:row|column
    justify-content 主轴对齐
    align-items 侧轴对齐

  - 子元素们设置一个 flex：1 属性
    等比例分配空间
    放在子元素上，设置元素的比例

- JS 中除了基本数据类型
  string,number,boolean,undefine,null
  都是对象

- transition:all 700ms ease-in
  all：表示对元素的所有动画属性都应用过渡效果
  700ms：过渡动画的持续时间为 700 毫秒（0.7 秒） tansition-duration
  ease-in：动画的时间函数，表示动画开始时较慢(ease-out 则相反)，然后逐渐加速 transition-timing-function

  - 比 animation 简单，没有 keyframes,属性的改变就可以添加过渡动画效果
    transition:opacity 300ms ease-in 400ms
    400ms transition-delay:过渡延迟，动画开始前的等待时间为 400 毫秒

- @media (max-width: 480px)
  媒体查询 应用于响应式布局
  iPhone 414px
  max-width:480px 查询条件
  对特定设备适配
