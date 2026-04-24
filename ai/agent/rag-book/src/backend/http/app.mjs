import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { RagValidationError } from "../services/ragService.mjs";
import { readJsonBody, sendJson, sendText } from "./json.mjs";
import { serveStaticFile } from "./staticFiles.mjs";

function createRequestId() {
  return `req_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
}

function parseBoolean(value, fieldName) {
  if (value === undefined) {
    return true;
  }
  if (typeof value === "boolean") {
    return value;
  }

  throw new RagValidationError(`\`${fieldName}\` must be a boolean.`);
}

function parseChatRequestBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RagValidationError("Request body must be a JSON object.");
  }

  const { question, topK, includeContext } = body;
  if (question === undefined) {
    throw new RagValidationError("`question` is required.");
  }
  if (typeof question !== "string" || !question.trim()) {
    throw new RagValidationError("`question` must be a non-empty string.");
  }

  let parsedTopK = topK;
  if (topK !== undefined && topK !== null && topK !== "") {
    const candidate = Number.parseInt(topK, 10);
    if (!Number.isFinite(candidate) || candidate < 1) {
      throw new RagValidationError("`topK` must be a positive integer.");
    }
    parsedTopK = candidate;
  }

  return {
    question: question.trim(),
    topK: parsedTopK,
    includeContext: parseBoolean(includeContext, "includeContext"),
  };
}

function ensureJsonRequest(request) {
  const contentType = String(request.headers["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    const error = new Error("`Content-Type` must be `application/json`.");
    error.statusCode = 415;
    throw error;
  }
}

function mapSources(context = []) {
  return context.map((item) => ({
    id: item.id ?? "",
    title:
      item.chapterNum !== null && item.chapterNum !== undefined
        ? `Chapter ${item.chapterNum}`
        : "Unknown chapter",
    score: Number(item.score ?? 0),
    snippet: item.content ?? "",
  }));
}

function handleError(response, error, requestId) {
  const statusCode =
    error?.statusCode ||
    (error instanceof RagValidationError ? error.statusCode : 500);
  const message =
    statusCode >= 500 ? "Internal Server Error" : String(error.message);

  sendJson(response, statusCode, {
    ok: false,
    requestId,
    error: message,
    code: statusCode >= 500 ? "RAG_INTERNAL_ERROR" : "RAG_REQUEST_INVALID",
  });
}

export function createRequestHandler({ ragService, staticDir }) {
  return async function requestHandler(request, response) {
    const url = new URL(request.url || "/", "http://localhost");
    const { pathname } = url;
    const method = request.method || "GET";
    const requestId = createRequestId();

    try {
      if (method === "GET" && pathname === "/api/health") {
        sendJson(response, 200, {
          ok: true,
          requestId,
          service: "rag-book-api",
          ready: ragService.isReady(),
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (pathname === "/api/chat" && method !== "POST") {
        sendJson(response, 405, {
          ok: false,
          requestId,
          error: "Method Not Allowed",
          code: "RAG_METHOD_NOT_ALLOWED",
        });
        return;
      }

      if (method === "POST" && pathname === "/api/chat") {
        ensureJsonRequest(request);
        const body = await readJsonBody(request);
        const chatInput = parseChatRequestBody(body);
        const result = await ragService.answerQuestion(
          chatInput.question,
          chatInput.topK,
          { includeContext: chatInput.includeContext }
        );

        const payload = {
          ok: true,
          requestId,
          answer: result.answer,
          topK: result.topK,
          elapsedMs: result.elapsedMs,
          latencyMs: result.elapsedMs,
          sources: mapSources(result.context),
        };

        if (chatInput.includeContext) {
          payload.context = result.context;
        }

        sendJson(response, 200, payload);
        return;
      }

      if (method === "GET") {
        const served = await serveStaticFile(response, staticDir, pathname);
        if (served) {
          return;
        }
      }

      if (pathname.startsWith("/api/")) {
        sendJson(response, 404, {
          ok: false,
          requestId,
          error: "Not Found",
          code: "RAG_ROUTE_NOT_FOUND",
        });
        return;
      }

      sendText(response, 404, "Not Found");
    } catch (error) {
      handleError(response, error, requestId);
    }
  };
}

export function createHttpServer(options) {
  return createServer(createRequestHandler(options));
}
