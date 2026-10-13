import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import path from "node:path";
const root = path.resolve("dist");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".map": "application/json",
};
createServer((request, response) => {
  let file;
  try {
    file = path.resolve(
      root,
      "." +
        decodeURIComponent(new URL(request.url, "http://localhost").pathname),
    );
    if (file === root) file = path.join(root, "index.html");
    if (!file.startsWith(root + path.sep)) throw new Error("outside");
    const body = readFileSync(file);
    response.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    response.end(body);
  } catch {
    response.statusCode = 404;
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Rosemary gallery http://127.0.0.1:${port}`),
);
