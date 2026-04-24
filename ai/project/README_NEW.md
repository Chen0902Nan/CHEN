# AI全栈应用开发项目

## 项目介绍

这是一个基于AI技术的全栈应用项目，集成了前端展示、后端数据服务和大语言模型（LLM）功能。该项目允许用户查看用户列表数据，并通过AI服务针对这些数据提问并获取智能回答。

## 项目结构

```
user_chat/
├── frontend/         # 前端界面目录
│   └── index.html    # 主页面文件
├── backend/          # 后端服务目录
│   ├── package.json  # 项目配置和依赖
│   ├── pnpm-lock.yaml # 依赖锁定文件
│   └── users.json    # 用户数据文件
└── llm/              # AI服务目录
    └── index.mjs     # LLM服务实现
```

## 技术栈

### 前端
- HTML5
- JavaScript (原生)
- Bootstrap 3.0.3 (用于界面样式)

### 后端
- Node.js
- json-server (提供RESTful API服务)
- pnpm (包管理工具)

### AI服务
- OpenAI API (使用gpt-3.5-turbo模型)
- Node.js HTTP模块 (构建AI服务接口)
- dotenv (环境变量管理)

## 功能特性

1. **用户数据展示**：前端页面展示来自后端的用户列表，包括ID、姓名和家乡信息
2. **AI问答系统**：用户可以针对展示的数据提出问题，系统通过LLM服务提供智能回答
3. **跨域通信**：实现了前后端和AI服务之间的跨域数据交互
4. **响应式设计**：使用Bootstrap确保在不同设备上的良好显示效果

## 快速开始

### 环境要求
- Node.js (推荐v16+)
- pnpm (推荐使用)
- OpenAI API Key (用于AI服务)

### 安装与运行

#### 1. 后端数据服务

```bash
# 进入backend目录
cd user_chat/backend

# 安装依赖
pnpm install

# 启动json-server
pnpm run dev
# 服务将运行在 http://localhost:3001
```

#### 2. LLM服务

```bash
# 进入llm目录
cd user_chat/llm

# 安装依赖
pnpm install openai dotenv

# 创建.env文件并配置OpenAI API Key
# OPENAI_API_KEY=your_api_key_here

# 启动LLM服务
node index.mjs
# 或使用nodemon实现热更新
# nodemon index.mjs
# 服务将运行在 http://localhost:1314
```

#### 3. 前端页面

直接在浏览器中打开 `user_chat/frontend/index.html` 文件，或通过本地HTTP服务器提供服务。

## 系统架构

1. **数据流程**：
   - 前端通过fetch API从后端获取用户数据
   - 用户在前端输入问题，前端将问题和数据一起发送到LLM服务
   - LLM服务处理请求，调用OpenAI API生成回答
   - 前端接收并展示AI的回答

2. **服务端口**：
   - 后端数据服务：3001
   - LLM服务：1314

## API说明

### 后端API
- `GET /users` - 获取所有用户数据
- 支持json-server的完整RESTful API功能

### LLM服务API
- `GET /?question={问题}&data={数据}` - 向AI提问并获取回答
  - 参数：
    - `question`：用户的问题文本
    - `data`：需要分析的数据（JSON字符串格式）
  - 返回：包含AI回答的JSON对象

## 开发说明

### 前端开发
前端使用原生JavaScript实现数据获取和展示，通过Bootstrap提供基本样式。主要逻辑包括：
- 从后端获取用户数据并渲染表格
- 处理表单提交，将用户问题和数据发送到LLM服务
- 展示AI的回答结果

### 后端开发
后端使用json-server快速构建REST API，数据存储在users.json文件中。可以通过修改该文件来更新用户数据。

### LLM服务开发
LLM服务使用Node.js的http模块构建简单的Web服务器，并集成OpenAI API。服务会处理来自前端的请求，将问题和数据传递给AI模型，然后返回生成的回答。

## 扩展建议

1. **添加更多数据类型**：扩展后端数据结构，支持更复杂的数据关系
2. **优化前端界面**：添加分页、搜索和过滤功能
3. **增强AI能力**：提供更多提问上下文，实现连续对话功能
4. **添加用户认证**：实现登录注册系统
5. **部署到云服务**：使用Docker容器化部署，或部署到Vercel、Netlify等平台

## 故障排除

- **API连接问题**：确保后端服务和LLM服务都已正确启动
- **跨域错误**：检查服务的CORS配置，确保允许前端访问
- **AI服务错误**：验证OpenAI API Key是否正确配置
- **数据加载问题**：确认users.json文件格式正确且包含有效数据

## 许可证

该项目仅供学习和教育目的使用。