import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./config/env.mjs";
import { createHttpServer } from "./http/app.mjs";
import { createRagRuntime } from "./services/ragRuntime.mjs";
import { createRagService } from "./services/ragService.mjs";

const env = loadEnv();

const runtime = createRagRuntime(env);
const ragService = createRagService({
  ...runtime,
  collectionName: env.collectionName,
  defaultTopK: env.defaultTopK,
  maxTopK: env.maxTopK,
  requestTimeoutMs: env.requestTimeoutMs,
});

try {
  await ragService.initialize();
  console.log("[startup] RAG service initialized.");
} catch (error) {
  console.warn("[startup] RAG init failed, will retry on request:", error.message);
}

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFilePath);
const staticDir = path.resolve(currentDir, "../../web");

const server = createHttpServer({
  ragService,
  staticDir,
});

server.listen(env.port, () => {
  console.log(`[startup] Server running at http://localhost:${env.port}`);
});

function closeServer() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);

