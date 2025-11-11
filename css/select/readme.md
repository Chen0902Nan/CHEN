# CSS 选择器

## 基础选择器

- 元素选择器
  p{color}
  div{}
  input{}
- 类名选择器
  .container{}
  .header{}
- id 选择器
  #box{}
- 通用选择器
  \*{}

## 属性选择器

- 基础属性选择
  [title]
- 精确匹配
  input[name='shuru']
  button[type='submit']
- 子字符串匹配
  /_ 属性值包含指定字符串 _/
  [class*="btn"] { display: inline-block; }

  /_ 属性值以指定字符串开头 _/
  [href^="https"] { color: green; }

  /_ 属性值以指定字符串结尾 _/
  [src$=".jpg"] { border: 2px solid #ccc; }

  /_ 属性值以指定单词开头（连字符分隔） _/
  [lang|="en"] { font-family: Arial; }

  /_ 属性值包含指定单词（空格分隔） _/
  [class~="active"] { font-weight: bold; }

## 组合器选择器

- 后代选择器 （空格）
  div p{did 中的所有 p 标签}
- 子元素选择器
  div>p{div 子元素中的 p}
- 相邻兄弟选择器 (+)
  /_ 选择紧跟在后面的第一个兄弟元素 _/
  h1 + p { font-size: 1.2em; }
  .alert + button { margin-left: 10px; }
- 通用兄弟选择器
  h2 ~ p { color: #666; }
  .menu ~ .content { margin-left: 200px; }

## 结构伪类选择器

- E:first-child
  匹配父元素中的第一个子元素 E
- E:last-child
  匹配父元素中的最后一个子元素 E
- E:nth-child(n)
  匹配父元素中的第 n 个子元素 E
- E:first-of-type
  指定类型 E 的第一个
- E:last-of-type
  指定类型 E 的最后一个
- E:nth-of-type(n)
  指定类型 E 的第 n 个

## 状态伪类选择器

- :hover
- :active
- :link
- :focus

## 伪元素选择器

- ::after
- ::before
- ::placeholder
