import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

export function createRagRuntime(env) {
  const milvusClient = new MilvusClient({
    address: env.milvusAddress,
    token: env.milvusToken,
  });

  const embeddings = new OpenAIEmbeddings({
    apiKey: env.openAiApiKey,
    model: env.embeddingModelName,
    configuration: {
      baseURL: env.openAiBaseUrl,
    },
    dimensions: env.vectorDim,
  });

  const model = new ChatOpenAI({
    apiKey: env.openAiApiKey,
    model: env.chatModelName,
    temperature: 0.4,
    configuration: {
      baseURL: env.openAiBaseUrl,
    },
  });

  return {
    milvusClient,
    embeddings,
    model,
  };
}

