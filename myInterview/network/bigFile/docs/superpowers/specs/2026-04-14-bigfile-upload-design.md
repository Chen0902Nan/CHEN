# 大文件上传 Demo 设计文档

## 概述

实现一个完整的大文件上传系统，包含分片上传、秒传、断点续传功能。前端用 React + JavaScript，后端用 Node.js。

## 技术方案

### 前端

- **框架**: React (单文件组件，CDN引入)
- **分片计算**: 使用 spark-md5 库，通过 WebWorker 在后台计算文件 hash
- **分片大小**: 2MB
- **并行上传**: 同时上传最多 3 个分片

### 后端

- **框架**: Node.js 原生 http 模块
- **存储**: 本地文件系统
- **分片目录**: `uploads/{fileHash}/chunks/`

### 秒传原理

前端计算文件整体 hash → 请求服务端检查是否存在相同 hash → 存在则直接返回成功

### 断点续传原理

1. 前端先查询服务端已接收的分片列表
2. 只上传缺失的分片
3. 全部上传完成后通知服务端合并

## 目录结构

```
bigFile/
├── server/
│   ├── index.js          # 入口
│   ├── uploadHandler.js  # 上传处理
│   ├── mergeHandler.js   # 合并分片
│   └── checkHandler.js   # 秒传/断点检查
└── client/
    ├── index.html        # 主页面
    ├── App.jsx           # React组件
    ├── worker.js         # WebWorker计算hash
    └── style.css         # 样式
```

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/check?hash=&filename=` | 秒传检查 & 已上传分片查询 |
| POST | `/api/upload` | 上传单个分片 |
| POST | `/api/merge` | 合并所有分片 |
| GET | `/uploads/*` | 下载已合并的文件 |

## 核心流程

### 上传流程

1. 用户选择文件
2. WebWorker 计算文件 hash（同时可以预览文件）
3. 调用 `/api/check` 接口：
   - 若文件已存在（秒传）→ 直接完成
   - 若不存在 → 获取已上传分片列表
4. 根据已上传分片，过滤出需要上传的分片
5. 并行上传剩余分片（最多3个并发）
6. 全部上传完成后调用 `/api/merge` 合并
7. 显示上传成功

### 合并流程

1. 服务端收到合并请求
2. 按顺序读取各分片内容
3. 写入目标文件
4. 删除分片目录
5. 返回最终文件路径

## 前端组件设计

### App 组件状态

```javascript
{
  file: File | null,           // 当前选择的文件
  hash: string | null,         // 文件 hash
  hashProgress: number,         // hash 计算进度 %
  uploadedChunks: number[],    // 已上传的分片索引列表
  totalChunks: number,         // 总分片数
  uploadingChunks: number[],    // 正在上传的分片索引列表
  progress: number,            // 总体上传进度 %
  status: 'idle' | 'hashing' | 'checking' | 'uploading' | 'merging' | 'done' | 'error',
  message: string              // 状态消息
}
```

## 服务端数据结构

### 分片存储

```
uploads/
├── {hash}/
│   ├── chunks/
│   │   ├── 0
│   │   ├── 1
│   │   └── ...
│   └── metadata.json    # 存储文件信息和分片列表
```

### metadata.json 内容

```json
{
  "filename": "example.mp4",
  "size": 104857600,
  "totalChunks": 50,
  "uploadedChunks": [0, 1, 2, 5, 8]
}
```

## 错误处理

- 网络错误：自动重试3次，每次间隔1秒
- 服务端错误：显示具体错误信息
- 文件变化：hash不一致时提示用户重新选择

## 交互界面

- 拖拽上传区域
- 文件信息展示（名称、大小、分片数）
- hash 计算进度条
- 上传进度条（显示当前上传/总进度）
- 实时状态文字