import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createHttpServer } from "../src/backend/http/app.mjs";

async function setupServer(t, ragServiceOverrides = {}) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "rag-book-web-"));
  await writeFile(path.join(tempDir, "index.html"), "<h1>RAG Book</h1>", "utf8");
  await writeFile(
    path.join(tempDir, "styles.css"),
    "body { background: #faf6ef; color: #332211; font-family: serif; }",
    "utf8"
  );

  const calls = [];
  const ragService = {
    isReady() {
      return true;
    },
    async answerQuestion(question, topK) {
      calls.push({ question, topK });
      return {
        answer: `回答:${question}`,
        context: [{ rank: 1, score: 0.8, content: "片段示例" }],
        topK: Number(topK) || 3,
        elapsedMs: 50,
      };
    },
    ...ragServiceOverrides,
  };

  const server = createHttpServer({
    ragService,
    staticDir: tempDir,
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(tempDir, { recursive: true, force: true });
  });

  return { baseUrl, calls };
}

test("GET /api/health returns service status", async (t) => {
  const { baseUrl } = await setupServer(t);
  const response = await fetch(`${baseUrl}/api/health`);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.service, "rag-book-api");
  assert.equal(typeof payload.requestId, "string");
});

test("POST /api/chat returns answer and passes inputs to rag service", async (t) => {
  const { baseUrl, calls } = await setupServer(t);
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: "乔峰是谁",
      topK: 5,
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.answer, "回答:乔峰是谁");
  assert.equal(payload.topK, 5);
  assert.equal(typeof payload.requestId, "string");
  assert.equal(typeof payload.latencyMs, "number");
  assert.equal(Array.isArray(payload.sources), true);
  assert.equal(payload.sources.length, 1);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], { question: "乔峰是谁", topK: 5 });
});

test("POST /api/chat returns 400 when request body is invalid json", async (t) => {
  const { baseUrl } = await setupServer(t);
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{question:bad-json}",
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.ok, false);
  assert.equal(typeof payload.requestId, "string");
  assert.equal(payload.code, "RAG_REQUEST_INVALID");
});

test("GET /styles.css serves static asset without crashing", async (t) => {
  const { baseUrl } = await setupServer(t);

  const response = await fetch(`${baseUrl}/styles.css`);
  const text = await response.text();

  assert.equal(response.status, 200);
  assert.match(String(response.headers.get("content-type")), /text\/css/i);
  assert.match(text, /background|color|font/i);
});
