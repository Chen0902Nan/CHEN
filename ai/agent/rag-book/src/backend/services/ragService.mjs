import { MetricType } from "@zilliz/milvus2-sdk-node";

const OUTPUT_FIELDS = [
  "id",
  "book_id",
  "book_name",
  "chapter_num",
  "index",
  "content",
];

const NOT_FOUND_ANSWER = "上下文不足，无法准确回答";
const DEFAULT_CONTEXT_SNIPPET_LENGTH = 260;

export class RagValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "RagValidationError";
    this.statusCode = 400;
  }
}

function normalizeQuestion(question) {
  if (typeof question !== "string") {
    throw new RagValidationError("`question` must be a string.");
  }

  const trimmed = question.trim();
  if (!trimmed) {
    throw new RagValidationError("`question` cannot be empty.");
  }
  if (trimmed.length > 500) {
    throw new RagValidationError("`question` is too long (max 500 chars).");
  }

  return trimmed;
}

function normalizeTopK(topK, defaultTopK, maxTopK) {
  if (topK === undefined || topK === null || topK === "") {
    return defaultTopK;
  }

  const parsed = Number.parseInt(topK, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new RagValidationError("`topK` must be a positive integer.");
  }

  return Math.min(parsed, maxTopK);
}

function normalizeModelContent(content) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "text" in item) {
          return item.text;
        }
        return "";
      })
      .join("")
      .trim();
  }

  return "";
}

function compactWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function clipText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

function formatContext(raw, index, snippetLength) {
  return {
    rank: index + 1,
    id: raw.id ?? "",
    score: Number(raw.score ?? 0),
    chapterNum: raw.chapter_num ?? null,
    content: clipText(
      compactWhitespace(raw.content ?? ""),
      snippetLength || DEFAULT_CONTEXT_SNIPPET_LENGTH
    ),
    bookName: raw.book_name ?? "",
    chunkIndex: raw.index ?? null,
  };
}

function buildPrompt(question, contextItems) {
  const serializedContext = contextItems
    .map(
      (item) =>
        `[Chunk ${item.rank}] chapter=${
          item.chapterNum ?? "unknown"
        } score=${item.score.toFixed(4)}\ncontent=${item.content}`
    )
    .join("\n\n----------------\n\n");

  return `You are a retrieval-augmented QA assistant.
Answer only from the provided context. Do not fabricate facts.
If context is insufficient, explicitly say: "上下文不足，无法准确回答".

Context:
${serializedContext}

Question:
${question}

Response requirements:
1) Answer directly first.
2) Briefly mention supporting context.
3) Keep it concise.`;
}

function withTimeout(promise, timeoutMs, label) {
  let timer = null;

  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`${label} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }),
  ]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}

export function createRagService({
  milvusClient,
  embeddings,
  model,
  collectionName,
  defaultTopK = 3,
  maxTopK = 8,
  requestTimeoutMs = 45_000,
  contextSnippetLength = DEFAULT_CONTEXT_SNIPPET_LENGTH,
}) {
  let initialized = false;

  async function initialize() {
    if (initialized) {
      return;
    }

    await withTimeout(
      milvusClient.connectPromise,
      requestTimeoutMs,
      "Milvus connect"
    );

    try {
      await withTimeout(
        milvusClient.loadCollection({ collection_name: collectionName }),
        requestTimeoutMs,
        "Milvus loadCollection"
      );
    } catch (error) {
      const message = String(error?.message ?? "");
      if (!/already loaded/i.test(message)) {
        throw error;
      }
    }

    initialized = true;
  }

  async function retrieveRelevantContent(question, topK) {
    await initialize();

    const queryVector = await withTimeout(
      embeddings.embedQuery(question),
      requestTimeoutMs,
      "Embedding generation"
    );

    const searchResult = await withTimeout(
      milvusClient.search({
        collection_name: collectionName,
        vector: queryVector,
        limit: topK,
        metric_type: MetricType.COSINE,
        output_fields: OUTPUT_FIELDS,
      }),
      requestTimeoutMs,
      "Milvus search"
    );

    const rawResults = Array.isArray(searchResult?.results)
      ? searchResult.results
      : [];

    return rawResults.map((item, index) =>
      formatContext(item, index, contextSnippetLength)
    );
  }

  async function answerQuestion(rawQuestion, requestedTopK, options = {}) {
    const question = normalizeQuestion(rawQuestion);
    const topK = normalizeTopK(requestedTopK, defaultTopK, maxTopK);
    const includeContext = options.includeContext !== false;
    const startedAt = Date.now();

    try {
      const context = await retrieveRelevantContent(question, topK);

      if (context.length === 0) {
        return {
          answer: NOT_FOUND_ANSWER,
          ...(includeContext ? { context: [] } : {}),
          topK,
          elapsedMs: Date.now() - startedAt,
        };
      }

      const prompt = buildPrompt(question, context);
      const modelResponse = await withTimeout(
        model.invoke(prompt),
        requestTimeoutMs,
        "LLM invocation"
      );
      const answer = normalizeModelContent(modelResponse?.content);

      return {
        answer: answer || NOT_FOUND_ANSWER,
        ...(includeContext ? { context } : {}),
        topK,
        elapsedMs: Date.now() - startedAt,
      };
    } catch (error) {
      if (error instanceof RagValidationError) {
        throw error;
      }

      const wrapped = new Error(`RAG pipeline failed: ${error.message}`);
      wrapped.statusCode = /timed out/i.test(String(error?.message ?? ""))
        ? 504
        : 500;
      throw wrapped;
    }
  }

  function isReady() {
    return initialized;
  }

  return {
    initialize,
    isReady,
    answerQuestion,
  };
}
