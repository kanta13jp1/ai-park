import crypto from "node:crypto";
import fs from "node:fs";
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { fileURLToPath } from "node:url";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createNodeAdapter } from "./lib/node-adapter.js";
import { createAiParkMcpServer } from "./server.js";

const MAX_BODY_BYTES = 1024 * 1024; // 1 MiB

function timingSafeBearerMatch(authHeader: string | undefined, expectedToken: string): boolean {
  if (!authHeader) return false;
  const expected = `Bearer ${expectedToken}`;
  const a = Buffer.from(authHeader, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body exceeds 1 MiB"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error("Invalid JSON request body"), { statusCode: 400 }));
      }
    });
    req.on("error", (err) => reject(err));
  });
}

export interface HttpServerHandle {
  url: string;
  port: number;
  close: () => Promise<void>;
}

export async function startHttpServer(options?: {
  host?: string;
  port?: number;
  authToken?: string;
  repoRoot?: string;
}): Promise<HttpServerHandle> {
  const host = options?.host ?? process.env.HOST ?? "127.0.0.1";
  const port = options?.port ?? Number(process.env.PORT ?? 8787);
  const authToken = options?.authToken ?? process.env.AI_PARK_MCP_AUTH_TOKEN;
  const adapter = createNodeAdapter({ repoRoot: options?.repoRoot });

  const server = http.createServer(async (req, res) => {
    const urlPath = new URL(req.url ?? "/", "http://localhost").pathname;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, mcp-session-id, Last-Event-ID, mcp-protocol-version"
    );

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    if (urlPath === "/health" && req.method === "GET") {
      sendJson(res, 200, {
        status: "ok",
        service: "ai-park-mcp",
        mode: adapter.mode,
        transport: "streamable-http",
      });
      return;
    }

    if (urlPath !== "/mcp") {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    if (authToken && !timingSafeBearerMatch(req.headers.authorization, authToken)) {
      sendJson(res, 401, {
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized" },
        id: null,
      });
      return;
    }

    if (req.method === "GET" || req.method === "DELETE") {
      sendJson(res, 405, {
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed (stateless POST /mcp only)." },
        id: null,
      });
      return;
    }

    if (req.method !== "POST") {
      sendJson(res, 405, {
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      });
      return;
    }

    let parsedBody: unknown;
    try {
      parsedBody = await readJsonBody(req);
    } catch (err) {
      const statusCode =
        typeof (err as { statusCode?: number }).statusCode === "number"
          ? (err as { statusCode: number }).statusCode
          : 400;
      sendJson(res, statusCode, {
        jsonrpc: "2.0",
        error: {
          code: -32700,
          message: err instanceof Error ? err.message : "Invalid request body",
        },
        id: null,
      });
      return;
    }

    const mcpServer = createAiParkMcpServer(adapter);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      void transport.close();
      void mcpServer.close();
    });

    try {
      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, parsedBody);
    } catch (err) {
      console.error("[ai-park-mcp] HTTP request error:", err);
      if (!res.headersSent) {
        sendJson(res, 500, {
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  const addr = server.address() as AddressInfo;
  const boundUrl = `http://${host}:${addr.port}/mcp`;

  return {
    url: boundUrl,
    port: addr.port,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

function isDirectCliRun(): boolean {
  try {
    const entry = process.argv[1];
    if (!entry) return false;
    return fs.realpathSync(entry) === fs.realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isDirectCliRun()) {
  startHttpServer()
    .then((handle) => {
      console.error(`[ai-park-mcp] Streamable HTTP listening at ${handle.url}`);
      console.error(`[ai-park-mcp] Health endpoint: ${handle.url.replace(/\/mcp$/, "/health")}`);
    })
    .catch((err) => {
      console.error("[ai-park-mcp] Fatal HTTP startup error:", err);
      process.exit(1);
    });
}
