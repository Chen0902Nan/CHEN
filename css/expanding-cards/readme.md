# 弹性布局

- 开关标签
- HTML 文档
  一些 html 片段，html 文档流
  默认从上到下（块级），从左到右（行内） 像水流一样流满整个页面

- 行内元素/块级元素
  display:inline 不能设置宽高，不适合做容器/布局
  display:block 可以设置宽高，会把兄弟挤下去，适合做容器
  display:inline-block 行内块 适合做布局
  两个 inline-block 之间默认存在间隙（换行符有宽度）,若两个元素首尾相连则可以消除
  inline-block 虽好，但存在自身缺陷
- 布局 CSS 提供
  display 显示模式
  两列式布局 切换 display：inline-block
  即不会把兄弟挤下去，同时还具有块级元素的特性，可以设置宽高

- 盒模型
