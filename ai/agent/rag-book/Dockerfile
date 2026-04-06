FROM node:20-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 先复制依赖文件，利用 Docker 缓存
COPY package.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制源代码
COPY src/ src/
COPY web/ web/

EXPOSE 3000

# 使用非 root 用户运行
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "src/backend/server.mjs"]
