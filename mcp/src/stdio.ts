import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createNodeAdapter } from "./lib/node-adapter.js";
import { createAiParkMcpServer } from "./server.js";

async function main() {
  const adapter = createNodeAdapter();
  const server = createAiParkMcpServer(adapter);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[ai-park-mcp] Stdio transport connected");
}

main().catch((err) => {
  console.error("[ai-park-mcp] Fatal stdio startup error:", err);
  process.exit(1);
});
