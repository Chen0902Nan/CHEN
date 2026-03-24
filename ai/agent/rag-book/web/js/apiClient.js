const DEFAULT_TIMEOUT_MS = 60_000;

function withTimeout(timeoutMs) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    clear() {
      clearTimeout(timeoutHandle);
    },
  };
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return { error: text };
}

export function createApiClient({ baseUrl = "", timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  async function request(path, options = {}) {
    const timer = withTimeout(timeoutMs);
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        signal: timer.signal,
      });
      const payload = await parseResponse(response);
      if (!response.ok) {
        throw new Error(payload?.error || `Request failed with ${response.status}`);
      }
      return payload;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("请求超时，请稍后重试。");
      }
      throw error;
    } finally {
      timer.clear();
    }
  }

  return {
    health() {
      return request("/api/health", { method: "GET" });
    },
    chat({ question, topK }) {
      return request("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, topK }),
      });
    },
  };
}
