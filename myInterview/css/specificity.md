# CSS 选择器的层级

- 最优先的是!important
  要避免使用 它会破坏CSS的层级特性，难以调试和维护

- 内联样式 1000
  直接在html元素的style属性中定义的样式
  <div style="color:red"></div>

- ID选择器 100
  使用#符号的选择器

- 类、属性、伪类选择器 10
  类选择器 class .center
  属性选择器 [type="text"]
  伪类选择器 :hover :focus

- 标签和伪元素选择器 1
  HTML标签 div p h1
  伪元素选择器 ::before，::first-letter

- 不计入优先级的选择器
  通用选择器：\*
  组合符：如后代选择器(空格)，子选择器(>)，相邻兄弟选择器(+)，通用兄弟选择器(~)
  否定伪类选择器： :not() p:not(.special) 会选择所有不是 .special 类的 <p> 元素
