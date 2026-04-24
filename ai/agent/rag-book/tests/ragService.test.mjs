import test from "node:test";
import assert from "node:assert/strict";
import { createRagService, RagValidationError } from "../src/backend/services/ragService.mjs";

function createService({
  searchResults = [],
  modelContent = "默认回答",
} = {}) {
  const calls = {
    loadCollection: 0,
    searchArgs: null,
  };

  const milvusClient = {
    connectPromise: Promise.resolve(),
    async loadCollection() {
      calls.loadCollection += 1;
    },
    async search(args) {
      calls.searchArgs = args;
      return { results: searchResults };
    },
  };

  const embeddings = {
    async embedQuery() {
      return [0.1, 0.2, 0.3];
    },
  };

  const model = {
    async invoke() {
      return { content: modelContent };
    },
  };

  const service = createRagService({
    milvusClient,
    embeddings,
    model,
    collectionName: "ebook",
    defaultTopK: 3,
    maxTopK: 8,
    requestTimeoutMs: 5_000,
  });

  return { service, calls };
}

test("answerQuestion throws validation error for empty question", async () => {
  const { service } = createService();
  await assert.rejects(
    () => service.answerQuestion("   ", 3),
    (error) => error instanceof RagValidationError
  );
});

test("answerQuestion returns not-found answer when context is empty", async () => {
  const { service } = createService({ searchResults: [] });
  const result = await service.answerQuestion("段誉会什么武功", 3);

  assert.equal(typeof result.answer, "string");
  assert.equal(result.context.length, 0);
  assert.equal(result.topK, 3);
  assert.equal(typeof result.elapsedMs, "number");
});

test("answerQuestion clamps topK and returns model output", async () => {
  const { service, calls } = createService({
    searchResults: [
      {
        id: "chunk-1",
        score: 0.923,
        chapter_num: 12,
        index: 7,
        content: "乔峰在少室山面对多方势力。",
        book_name: "天龙八部",
      },
    ],
    modelContent: [{ text: "这是模型回答。" }],
  });

  const result = await service.answerQuestion("乔峰在少室山做了什么", 99);

  assert.equal(result.topK, 8);
  assert.equal(calls.searchArgs.limit, 8);
  assert.equal(result.answer, "这是模型回答。");
  assert.equal(result.context.length, 1);
  assert.equal(result.context[0].rank, 1);
  assert.equal(result.context[0].chapterNum, 12);
});

test("service initializes milvus only once", async () => {
  const { service, calls } = createService({
    searchResults: [],
  });

  await service.answerQuestion("第一问", 1);
  await service.answerQuestion("第二问", 1);

  assert.equal(calls.loadCollection, 1);
});

