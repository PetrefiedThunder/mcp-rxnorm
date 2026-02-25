#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = "https://rxnav.nlm.nih.gov/REST";
const USER_AGENT = "mcp-rxnorm/1.0.0";
const RATE_LIMIT_MS = 250;
let lastRequestTime = 0;

async function rateLimitedFetch(url: string): Promise<any> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
  }
  lastRequestTime = Date.now();

  const separator = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${separator}format=json`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`RxNorm error: ${res.status}`);
  return res.json();
}

const server = new McpServer({ name: "mcp-rxnorm", version: "1.0.0" });

server.tool(
  "search_drugs",
  "Search for drugs by name. Returns RxCUI identifiers and normalized names.",
  {
    name: z.string().describe("Drug name (brand or generic, e.g. 'Lipitor', 'atorvastatin', 'aspirin')"),
  },
  async ({ name }) => {
    const data = await rateLimitedFetch(`${BASE}/drugs.json?name=${encodeURIComponent(name)}`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_drug_info",
  "Get detailed information about a drug by RxCUI.",
  {
    rxcui: z.string().describe("RxNorm Concept Unique Identifier"),
  },
  async ({ rxcui }) => {
    const [props, related] = await Promise.all([
      rateLimitedFetch(`${BASE}/rxcui/${rxcui}/properties.json`),
      rateLimitedFetch(`${BASE}/rxcui/${rxcui}/allrelated.json`),
    ]);
    return { content: [{ type: "text" as const, text: JSON.stringify({ properties: props, related }, null, 2) }] };
  }
);

server.tool(
  "get_interactions",
  "Get drug-drug interactions for one or more drugs.",
  {
    rxcuis: z.string().describe("Comma-separated RxCUI IDs (e.g. '207106,152923')"),
  },
  async ({ rxcuis }) => {
    const data = await rateLimitedFetch(`${BASE}/interaction/list.json?rxcuis=${rxcuis}`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "normalize_drug_name",
  "Normalize a drug name to its standard RxNorm representation.",
  {
    name: z.string().describe("Drug name to normalize (can be misspelled or brand name)"),
  },
  async ({ name }) => {
    const data = await rateLimitedFetch(`${BASE}/approximateTerm.json?term=${encodeURIComponent(name)}&maxEntries=5`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_ndc_codes",
  "Get NDC (National Drug Code) codes for a drug by RxCUI.",
  {
    rxcui: z.string().describe("RxNorm Concept Unique Identifier"),
  },
  async ({ rxcui }) => {
    const data = await rateLimitedFetch(`${BASE}/rxcui/${rxcui}/ndcs.json`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  "get_drug_classes",
  "Get pharmacologic and therapeutic drug classes for a drug.",
  {
    rxcui: z.string().describe("RxNorm Concept Unique Identifier"),
  },
  async ({ rxcui }) => {
    const data = await rateLimitedFetch(`${BASE}/rxclass/class/byRxcui.json?rxcui=${rxcui}`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
