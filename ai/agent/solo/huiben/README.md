# 绘本岛 - 亲子阅读平台

一个面向中国亲子家庭的"绘本阅读 + 亲子活动"平台网站，整体风格温馨、清新、富有童趣，适配移动端浏览。

## 🌟 项目特色

- **品牌定位**：专注亲子阅读，营造温馨阅读氛围
- **视觉风格**：米白、淡黄、天蓝配色，手绘风格插画
- **技术架构**：React + TypeScript + Supabase 现代化技术栈
- **移动端优先**：充分考虑家长使用场景，手势操作友好

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
创建 `.env` 文件：
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_APP_NAME=绘本岛
VITE_APP_VERSION=1.0.0
```

### 启动开发服务器
```bash
pnpm run dev
```

### 构建生产版本
```bash
pnpm run build
```

## 📱 核心功能

### 已完成
- ✅ 首页布局（轮播图、热门绘本、活动推荐）
- ✅ 温馨的UI设计和品牌色彩系统
- ✅ 移动端响应式布局
- ✅ 组件化架构设计

### 待开发
- 🔄 注册登录页面
- 🔄 绘本馆页面
- 🔄 绘本详情页面
- 🔄 亲子活动页面
- 🔄 阅读记录页面
- 🔄 用户中心
- 🔄 购物流程

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化前端框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **React Router** - 路由管理
- **Zustand** - 轻量级状态管理
- **Lucide React** - 图标库

### 后端服务
- **Supabase** - 后端即服务平台
  - PostgreSQL 数据库
  - 用户认证
  - 对象存储
  - 实时订阅

### 开发工具
- **ESLint** - 代码规范
- **TypeScript** - 类型检查
- **Vitest** - 单元测试

## 📁 项目结构

```
src/
├── components/          # 组件
│   ├── layout/         # 布局组件
│   ├── ui/            # UI组件
│   ├── BookCard.tsx   # 绘本卡片
│   └── ActivityCard.tsx # 活动卡片
├── pages/              # 页面
│   └── Home.tsx       # 首页
├── stores/             # 状态管理
│   ├── user.ts        # 用户状态
│   ├── books.ts       # 绘本状态
│   └── cart.ts        # 购物车状态
├── services/           # API服务
│   ├── supabase.ts    # Supabase客户端
│   ├── auth.ts        # 认证服务
│   └── books.ts       # 绘本服务
├── hooks/              # 自定义Hook
├── utils/              # 工具函数
├── types/              # 类型定义
└── assets/             # 静态资源
```

## 🎨 设计系统

### 色彩方案
- **主色调**：米白色 (#FAF8F3) - 营造温馨舒适的阅读氛围
- **辅助色**：淡黄色 (#FFE4B5) - 增加温暖感，模拟书香气息
- **强调色**：天蓝色 (#87CEEB) - 代表童真和想象力

### 字体系统
- **主要字体**：Noto Sans SC - 优化的中文显示
- **标题字体**：粗体，营造亲和力
- **正文字体**：常规，确保阅读清晰度

### 组件规范
- **按钮**：圆角矩形，3D微立体效果
- **卡片**：圆角设计，柔和阴影
- **图标**：手绘风格，线条柔和

## 📋 开发计划

1. **第一阶段** - 基础功能
   - ✅ 项目初始化和首页开发
   - 🔄 用户认证系统
   - 🔄 绘本浏览功能

2. **第二阶段** - 核心功能
   - 📋 绘本详情和评价
   - 📋 亲子活动管理
   - 📋 阅读记录追踪

3. **第三阶段** - 高级功能
   - 📋 购物车和支付
   - 📋 个人中心
   - 📋 推荐算法

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- **邮箱**：contact@huibendao.com
- **微信**：huibendao
- **客服热线**：400-123-4567

---

**绘本岛 - 让亲子时光，更温暖一点**