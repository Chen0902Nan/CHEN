# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Chrome Prompt Tool 是一个 Chrome 浏览器插件，用于管理和快速访问 Prompt 模板。主要功能包括：
- 网页悬浮球界面，可拖拽和展开
- Prompt 的创建、编辑、删除和复制
- 按分类组织 Prompt
- 使用 Chrome Storage API 本地存储数据

## 核心架构

### Manifest V3 结构
- `manifest.json` - 插件配置，定义权限、内容脚本和弹出页面
- 使用 `chrome.storage.local` API 存储数据
- Content scripts 注入到所有网页 (`<all_urls>`)

### 双界面系统
1. **Content Script 界面** (`content.js` + `content.css`)
   - 在所有网页上注入悬浮球
   - 悬浮球可拖拽，点击展开面板
   - 面板显示按分类组织的 Prompt 列表
   - 支持一键复制 Prompt

2. **Popup 管理界面** (`popup.html` + `popup.js` + `popup.css`)
   - 点击插件图标打开
   - 两个标签页：Prompts 管理和分类管理
   - 完整的 CRUD 操作

### 数据模型
```javascript
// Categories: string[]
["默认分类", "工作", "学习"]

// Prompts: object[]
[{
  id: "timestamp",
  title: "标题",
  category: "分类名",
  content: "Prompt 内容"
}]
```

## 开发工作流

### 测试插件
```bash
# 1. 打开 Chrome 扩展页面
chrome://extensions/

# 2. 开启开发者模式，点击"加载已解压的扩展程序"
# 3. 选择项目根目录

# 4. 修改代码后，在扩展页面点击刷新按钮
# 5. 刷新测试网页以查看 content script 更改
```

### 调试
- **Popup 调试**: 右键插件图标 → "检查弹出内容"
- **Content Script 调试**: 在网页上 F12 → Console 查看日志

### 图标要求
需要在 `icons/` 目录下提供三个尺寸的 PNG 图标：
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

## 代码约定

### 数据访问
所有数据操作通过 `DataManager` 类（在 `popup.js` 中）：
- `getCategories()` / `saveCategories()`
- `getPrompts()` / `savePrompts()`

### UI 更新
- Popup 界面使用 `UIManager` 类管理状态和渲染
- Content script 使用函数式方法渲染面板

### 样式
- 使用 CSS 变量和渐变色主题（紫色系）
- 悬浮球 z-index: 999999，面板 z-index: 999998
- 响应式设计，支持长文本和滚动

## 常见修改

### 修改悬浮球位置
在 `content.css` 中修改 `#prompt-floating-ball` 的 `bottom` 和 `right` 属性

### 修改主题色
在 CSS 文件中搜索 `#667eea` 和 `#764ba2` 替换为新的颜色值

### 添加新的 Prompt 字段
1. 更新数据模型（在 `popup.js` 的 `savePrompt` 方法）
2. 更新表单 HTML（`popup.html`）
3. 更新渲染逻辑（`renderPrompts` 方法）

### 修改存储位置
默认使用 `chrome.storage.local`，如需同步可改为 `chrome.storage.sync`（需在 manifest.json 中添加权限）
