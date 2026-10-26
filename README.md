# mcp-rxnorm

Look up drug names, ingredients, interactions, and NDC codes via NLM RxNorm API.

> **Free API** — No API key required.

## Tools

| Tool | Description |
|------|-------------|
| `search_drugs` | Search for drugs by name. Returns RxCUI identifiers and normalized names. |
| `get_drug_info` | Get detailed information about a drug by RxCUI. |
| `get_interactions` | Get drug-drug interactions for one or more drugs. |
| `normalize_drug_name` | Normalize a drug name to its standard RxNorm representation. |
| `get_ndc_codes` | Get NDC (National Drug Code) codes for a drug by RxCUI. |
| `get_drug_classes` | Get pharmacologic and therapeutic drug classes for a drug. |

## Installation

```bash
git clone https://github.com/PetrefiedThunder/mcp-rxnorm.git
cd mcp-rxnorm
npm install
npm run build
```

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rxnorm": {
      "command": "node",
      "args": ["/path/to/mcp-rxnorm/dist/index.js"]
    }
  }
}
```

## Usage with npx

```bash
npx mcp-rxnorm
```

## License

Apache-2.0
