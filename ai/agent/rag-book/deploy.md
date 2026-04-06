# RAG-Book 项目部署文档

## 一、项目概述

RAG-Book 是一个基于 RAG（检索增强生成）技术的电子书问答系统，用户可以对电子书内容进行智能问答。

**技术栈：**
- 后端：Node.js + LangChain
- 向量数据库：Milvus（Zilliz Cloud 托管）
- LLM：通义千问（qwen-plus）
- Embedding：text-embedding-v3
- 部署：Docker + Docker Compose + Nginx
- 服务器：阿里云 ECS

## 二、整体架构

```
用户浏览器
    │
    ▼
┌─────────────────────┐
│   Nginx（端口 80）    │   反向代理 + 静态资源
│   容器：rag-book-nginx│
└─────────┬───────────┘
          │ proxy_pass
          ▼
┌─────────────────────┐
│   Node.js（端口 3000）│   后端 API 服务
│   容器：rag-book      │
└─────────┬───────────┘
          │
     ┌────┴────┐
     ▼         ▼
  Zilliz     通义千问
  Cloud      API
 (Milvus)   (qwen-plus)
```

- Nginx 作为反向代理，监听 80 端口，将请求转发到后端 Node.js 服务
- Node.js 服务运行在 3000 端口，提供 API 接口和静态页面
- 向量检索调用 Zilliz Cloud（Milvus 的云托管服务）
- LLM 调用通义千问 API 进行问答生成

## 三、Docker 容器化

### 3.1 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 先复制依赖文件，利用 Docker 缓存层
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制源代码
COPY src/ src/
COPY web/ web/

EXPOSE 3000

# 使用非 root 用户运行（安全最佳实践）
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "src/backend/server.mjs"]
```

**面试要点：**
- 使用 `node:20-alpine` 轻量镜像，减小镜像体积
- 先复制 `package.json` 和 `pnpm-lock.yaml`，再安装依赖，利用 Docker 的**分层缓存**机制——只要依赖文件没变，重新构建时不会重复安装依赖
- `--frozen-lockfile` 确保依赖版本与 lock 文件严格一致，保证构建的可复现性
- `--prod` 只安装生产依赖，减小镜像体积
- 创建非 root 用户运行应用，遵循**最小权限原则**，降低容器被攻破后的风险

### 3.2 .dockerignore

```
node_modules
*.epub
.env
.git
tests/
```

排除不需要进入镜像的文件，减小构建上下文体积，加快构建速度，同时避免将敏感信息（.env）打入镜像。

### 3.3 Docker Compose 编排

```yaml
version: "3.8"

services:
  app:
    build: .
    container_name: rag-book
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  nginx:
    image: nginx:alpine
    container_name: rag-book-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
```

**面试要点：**
- `restart: unless-stopped` 保证服务异常退出后自动重启，服务器重启后容器也会自动恢复
- `env_file` 将环境变量从 `.env` 文件注入容器，敏感信息不写入镜像
- **健康检查（healthcheck）**：每 30 秒通过 wget 请求 `/api/health` 接口，连续 3 次失败则标记容器为 unhealthy，便于监控和自动恢复
- `depends_on` 确保 Nginx 在 app 启动后再启动
- Nginx 配置通过 volumes 挂载，修改配置无需重新构建镜像

## 四、Nginx 反向代理配置

```nginx
upstream app {
    server app:3000;
}

server {
    listen 80;
    server_name 47.99.201.117;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**面试要点：**
- `upstream` 定义后端服务地址，Docker Compose 内部通过**服务名（app）**进行 DNS 解析，无需写死 IP
- `proxy_set_header` 传递真实客户端信息：
  - `X-Real-IP`：客户端真实 IP
  - `X-Forwarded-For`：经过的代理链
  - `X-Forwarded-Proto`：原始请求协议（http/https）
- Nginx 与 Node.js 分离，Nginx 负责静态资源、SSL 终止、负载均衡，Node.js 专注业务逻辑

## 五、部署流程

### 5.1 服务器环境准备

购买阿里云 ECS 实例（Ubuntu 22.04），配置安全组开放 80、443、22 端口。

```bash
# 安装 Docker
apt update && apt install -y docker.io

# 启动 Docker 服务
systemctl enable docker && systemctl start docker

# 安装 Docker Compose
apt install -y docker-compose
```

> 由于国内服务器无法直接访问 Docker Hub，需要配置国内镜像加速器：
> ```bash
> cat > /etc/docker/daemon.json << 'EOF'
> {
>   "registry-mirrors": [
>     "https://docker.1ms.run",
>     "https://docker.m.daocloud.io"
>   ]
> }
> EOF
> systemctl daemon-reload && systemctl restart docker
> ```

### 5.2 拉取代码

由于国内 ECS 无法直接访问 GitHub，通过 Gitee 镜像中转：

```bash
# 在 Gitee 上从 GitHub 导入仓库，然后 clone
git clone https://gitee.com/chen090299/Rag_novel.git /home/app/rag-book
```

### 5.3 配置环境变量

```bash
cd /home/app/rag-book
cat > .env << 'EOF'
MILVUS_TOKEN=xxx
MILVUS_ADDRESS=https://xxx.cloud.zilliz.com.cn
OPENAI_API_KEY=xxx
EMBEDDING_MODEL_NAME=text-embedding-v3
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
MODEL_NAME=qwen-plus
EOF
```

环境变量通过 `.env` 文件管理，不提交到 Git 仓库，通过 `.dockerignore` 和 `.gitignore` 排除。

### 5.4 构建并启动

```bash
docker-compose up -d --build
```

- `--build` 根据 Dockerfile 构建镜像
- `-d` 后台运行

### 5.5 验证服务

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 健康检查
curl http://localhost:3000/api/health
```

## 六、安全措施

| 措施 | 说明 |
|------|------|
| 非 root 用户 | 容器内以 appuser 身份运行，降低容器逃逸风险 |
| 环境变量隔离 | API Key 等敏感信息通过 .env 注入，不进入镜像和 Git |
| 安全组 | 阿里云安全组只开放必要端口（80、443、22） |
| 反向代理 | Nginx 屏蔽后端服务直接暴露，统一入口 |
| 健康检查 | 自动检测服务状态，异常时自动重启 |

## 七、项目更新流程

代码更新后，需要在服务器上重新拉取代码并重建容器。

### 7.1 更新流程

```
本地修改代码 → git push 到 Gitee → SSH 登录服务器 → 拉取代码 → 重建容器
```

```bash
# 登录服务器后执行
cd /home/app/rag-book
git pull
docker-compose up -d --build
docker-compose ps
```

- `git pull` 拉取最新代码
- `docker-compose up -d --build` 会重新构建镜像并替换旧容器，**用户无感知**（新容器启动后旧容器才停止）
- 如果只改了代码没改依赖，Docker 分层缓存会跳过依赖安装步骤，构建速度很快

### 7.2 一键更新脚本

在服务器上创建 `update.sh`：

```bash
#!/bin/bash
cd /home/app/rag-book
echo "拉取最新代码..."
git pull
echo "重新构建并启动..."
docker-compose up -d --build
echo "清理旧镜像..."
docker image prune -f
echo "当前状态："
docker-compose ps
```

```bash
# 赋予执行权限
chmod +x /home/app/rag-book/update.sh

# 以后每次更新只需执行
/home/app/rag-book/update.sh
```

`docker image prune -f` 清理构建过程中产生的旧镜像，避免磁盘空间被占满。

## 八、部署第二个项目

同一台 ECS 可以部署多个项目，Docker 和镜像加速等环境只需配置一次。

### 8.1 哪些不需要重复做

| 步骤 | 是否需要重复 |
|------|:---:|
| 购买 ECS | 不需要 |
| 安装 Docker / Docker Compose | 不需要 |
| 配置镜像加速器 | 不需要 |
| 安全组 22 端口 | 不需要 |

### 8.2 部署步骤

**1. Clone 新项目到独立目录**

```bash
git clone https://gitee.com/xxx/新项目名.git /home/app/新项目名
cd /home/app/新项目名
```

**2. 创建 .env（如果需要）**

**3. 修改端口，避免与已有项目冲突**

已有项目（rag-book）占用了 80 和 3000 端口，新项目需要使用不同端口：

```yaml
# 新项目的 docker-compose.yml
services:
  app:
    ports:
      - "3001:3000"    # 外部用 3001，避免与 rag-book 的 3000 冲突
  nginx:
    ports:
      - "81:80"        # 外部用 81，避免与 rag-book 的 80 冲突
```

**4. 阿里云安全组开放新端口（如 81）**

**5. 构建并启动**

```bash
docker-compose up -d --build
```

**6. 访问**

```
http://47.99.201.117:81
```

### 8.3 多项目管理

```
/home/app/
├── rag-book/          # 项目一（80 端口）
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── ...
├── 新项目名/           # 项目二（81 端口）
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── ...
```

各项目独立管理，互不影响。每个项目在各自目录下执行 `docker-compose` 命令即可。

## 九、后续优化方向

- **HTTPS**：购买域名 + ICP 备案，申请 SSL 证书，在 Nginx 层做 SSL 终止
- **CI/CD**：通过 GitHub Actions 实现代码推送后自动构建部署
- **日志收集**：接入 ELK 或阿里云日志服务，集中管理日志
- **监控告警**：接入 Prometheus + Grafana 或阿里云云监控
- **多实例部署**：Nginx upstream 配置多个后端实例，实现负载均衡
