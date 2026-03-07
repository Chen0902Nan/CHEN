# 拍照记单词

## AI时代

- vide coding
  代码和项目开发变得快速靠谱

- opc
  one person company
  创意 规划 商业 共情
  AI产品经理

## 单词类 App

- 市场调研
- 百词斩
  细分领域 背单词
  单词和形象的图片结合
  awkward 尴尬的
  giraffe 长颈鹿

- 扇贝单词
  智能间隔重复算法
  精准规划复习时间，确保单词再即将遗忘时被强化，长期记忆

## 大模型

- 互联网所有产品值得用AI重新做一遍
  - AIGC
  - Agent
- 拍照记单词
  - 多邻国
  - 产品点？
  - 需求
  - 场景
    跨国生活
  - 痛点
    足够痛 强需求

## 产品原型

- 上传图片/拍照
- 调用kimi接口 解析图片 得到单词和例句
- 点击播放按钮
- 最核心功能的表达，怎么交互的，有哪些网页

## 设计稿

## 技术调研

### 大模型

- 文本模型
- 多模态模型 kimi-shot
  moonshot-v1-8k-vision-preview
- tts text to speech

### 技术栈

- 前端 vue3 + ts
- 后端 nestjs

## 开发

### 产品亮点

- 无障碍访问
  label for + input#id
  帮助使用读屏器的盲人
  input[type="file"] 比较难控制样式
  display:none for id 样式控制
  