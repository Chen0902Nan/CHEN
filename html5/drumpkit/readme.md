# HTML5 敲击乐

## HTML5 web 应用

- 编写页面结构
- 模块化职责分离
  专业、可维护、可扩展
  css 负责样式，link 在 head 中引入
  js 负责交互 script 在 body 的底部引入
- 浏览器是执行前端代码的程序
  - 下载并解析 html 结构
  - link 引入 css 样式
  - html（结构）+css（样式） 结合(通过选择器相结合) -> 静态页面
    前端的天职是 快速显示页面
  - script 交互放到后面
    script 会阻塞 html 的下载和执行

## 静态页面

HTML & CSS -> 生成静态页面
CSS Reset 的作用是通过统一或清除不同浏览器对 HTML 元素的默认样式差异，为样式开发提供一个一致、可预测的基础。

- - 选择器 会匹配所有元素，性能不好
- 业界推荐的 css 样式 reset 代码
  列出所有元素 代替\*
- html 结构
  通过选择器
  标签选择器
  类选择器

- 背景的使用

  - background-size：cover|contain
    cover 以盒子为主，等比例放大或者收缩 覆盖整个盒子，可能会有部分背景图片被裁剪
    contain 以图片为主，将图片等比例放大或者收缩，正好全部放进盒子
  - background-position: bottom center
  - background-repeat:norepeat

- rem，vh 相对单位， 解决移动端 设备尺寸不一致的问题
  现代前端开发，建议不要使用 px 绝对单位
  vh 相对于视窗
  rem 相对于 html 根元素的字体大小
  html font-size 10px

- flex + 居中 完成布局
  - display:flex; 弹性布局魔法，手机尺寸不一致，弹性布局
    9 个.key 子元素就不会换行了（块级），在一行显示
  - justify-content:center; 水平居中
  - align-items:center; 垂直居中
- 使用 vh，rem 相对单位代替 px 等绝对单位 可以更好地适配移动端
