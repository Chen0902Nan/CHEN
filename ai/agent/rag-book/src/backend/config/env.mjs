import "dotenv/config";

const DEFAULTS = {
  port: 3000,
  vectorDim: 1024,
  defaultTopK: 3,
  maxTopK: 8,
  requestTimeoutMs: 45_000,
  collectionName: "ebook",
};

function readRequired(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readNumber(name, fallback, min = 1) {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min) {
    throw new Error(`Invalid numeric environment variable: ${name}`);
  }
  return parsed;
}

export function loadEnv() {
  return Object.freeze({
    port: readNumber("PORT", DEFAULTS.port),
    milvusAddress: readRequired("MILVUS_ADDRESS"),
    milvusToken: readRequired("MILVUS_TOKEN"),
    openAiApiKey: readRequired("OPENAI_API_KEY"),
    openAiBaseUrl: readRequired("OPENAI_BASE_URL"),
    embeddingModelName: readRequired("EMBEDDING_MODEL_NAME"),
    chatModelName: readRequired("MODEL_NAME"),
    vectorDim: readNumber("VECTOR_DIM", DEFAULTS.vectorDim),
    defaultTopK: readNumber("DEFAULT_TOP_K", DEFAULTS.defaultTopK),
    maxTopK: readNumber("MAX_TOP_K", DEFAULTS.maxTopK),
    requestTimeoutMs: readNumber(
      "REQUEST_TIMEOUT_MS",
      DEFAULTS.requestTimeoutMs,
      1_000
    ),
    collectionName:
      process.env.MILVUS_COLLECTION_NAME || DEFAULTS.collectionName,
  });
}

