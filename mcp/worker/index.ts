import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createWebAdapter } from "../src/lib/web-adapter.js";
import { createAiParkMcpServer } from "../src/server.js";

export interface WorkerEnv {
  AI_PARK_MCP_AUTH_TOKEN?: string;
  AI_PARK_GITHUB_TOKEN?: string;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, mcp-session-id, Last-Event-ID, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) {
    diff |= ab[i] ^ bb[i];
  }
  return diff === 0;
}

export default {
  async fetch(request: Request, env: WorkerEnv = {}): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const authToken = env.AI_PARK_MCP_AUTH_TOKEN?.trim() ?? "";

    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return withCors(
        Response.json({
          status: "ok",
          service: "ai-park-mcp-worker",
          mode: "remote",
          transport: "streamable-http",
          authConfigured: Boolean(authToken),
        })
      );
    }

    if (url.pathname !== "/mcp") {
      return withCors(Response.json({ error: "Not found" }, { status: 404 }));
    }

    if (!authToken) {
      return withCors(
        Response.json(
          {
            jsonrpc: "2.0",
            error: {
              code: -32002,
              message: "Service unavailable: AI_PARK_MCP_AUTH_TOKEN is not configured.",
            },
            id: null,
          },
          { status: 503 }
        )
      );
    }

    const auth = request.headers.get("Authorization") ?? "";
    if (!constantTimeEqual(auth, `Bearer ${authToken}`)) {
      return withCors(
        Response.json(
          {
            jsonrpc: "2.0",
            error: { code: -32001, message: "Unauthorized" },
            id: null,
          },
          { status: 401 }
        )
      );
    }

    if (request.method === "GET" || request.method === "DELETE") {
      return withCors(
        Response.json(
          {
            jsonrpc: "2.0",
            error: { code: -32000, message: "Method not allowed (stateless POST /mcp only)." },
            id: null,
          },
          { status: 405 }
        )
      );
    }

    if (request.method !== "POST") {
      return withCors(
        Response.json(
          { jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null },
          { status: 405 }
        )
      );
    }

    const adapter = createWebAdapter({
      AI_PARK_GITHUB_TOKEN: env.AI_PARK_GITHUB_TOKEN,
    });
    const server = createAiParkMcpServer(adapter);
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);
    const response = await transport.handleRequest(request);
    return withCors(response);
  },
};
