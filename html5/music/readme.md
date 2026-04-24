# HTML5 敲击乐

## 开发文档 markdown

## 前端基础

- JS 开发者是程序员中的**导演** 负责用户体验和交互
- 直接看到效果
- AI 应用的极致体验，由 JS 工程师带来
- HTML CSS JS 前端三剑客

## 代码敲击乐

- HTML5 模拟钢琴 **模块化**开发
- html 负责结构 键盘
  - 快捷生成 ！+tap
    - html 文档 (Document )
    - html 第 5 个版本 <!DOCTYPE html> html 文档头声明
  - **第一步** 先写结构
    <标签对></>
    盒子 容器 div 负责布局
    span 负责内容
- css 负责样式 层叠样式表
- js 负责行为 事件处理

## 开发效率

- !+tap 快速生成 html5 空结构
- emet 语法 快速输入 html 结构
  - 1.快速生成一个大 div 中，八个小 div，每个小 div 中含有一个 h3 标签，一个 sapan 标签 ：div.keys>(div.key>h3+span)\*8 + tap (div 可以省略)
- Live Server 热更新（代码更改保存后，浏览器自动刷新）

## 大厂考题

- <!DOCTYPE html> 和.txt,.paf 一样是一个Document文件，只是文件格式不同，htmlDocument
- ! 是 html5 的声明

## html5 标签 分为两类

- 块级元素 block 独占一行 可以设置宽度，高度 可以去负责布局结构
  - 宽度默认整个一行
  - 高度如果没有设定由内容撑开
  - h3 文字高度 行高
- 行内元素 inline 不独占一行 不能设置宽度，高度 由内容撑开
