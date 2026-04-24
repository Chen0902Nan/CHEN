import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function resolveAssetPath(staticDir, pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const safePath = decodedPath === "/" ? "index.html" : decodedPath;
  const relativePath = safePath.replace(/^[/\\]+/, "");
  const normalized = path.normalize(relativePath);

  if (normalized.startsWith("..")) {
    return null;
  }

  return path.join(staticDir, normalized);
}

export async function serveStaticFile(response, staticDir, pathname) {
  const filePath = resolveAssetPath(staticDir, pathname);
  if (!filePath) {
    return false;
  }
  const normalizedStaticDir = path.resolve(staticDir);
  const normalizedFilePath = path.resolve(filePath);

  if (!normalizedFilePath.startsWith(normalizedStaticDir)) {
    return false;
  }

  try {
    await access(normalizedFilePath);
  } catch {
    return false;
  }

  const extension = path.extname(normalizedFilePath).toLowerCase();
  const contentType =
    MIME_TYPES[extension] || "application/octet-stream; charset=utf-8";

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": extension === ".html" ? "no-store" : "public, max-age=300",
  });

  return new Promise((resolve, reject) => {
    const stream = createReadStream(normalizedFilePath);
    stream.on("error", reject);
    stream.on("end", () => resolve(true));
    stream.pipe(response);
  });
}
