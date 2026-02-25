# mcp-rxnorm

MCP server for [RxNorm](https://www.nlm.nih.gov/research/umls/rxnorm/) — drug name normalization, interactions, NDC codes, and drug classes. No API key required.

## Tools

| Tool | Description |
|------|-------------|
| `search_drugs` | Search drugs by brand or generic name |
| `get_drug_info` | Get detailed info and related concepts by RxCUI |
| `get_interactions` | Check drug-drug interactions |
| `normalize_drug_name` | Fuzzy-match/normalize misspelled or brand names |
| `get_ndc_codes` | Get National Drug Code identifiers |
| `get_drug_classes` | Get pharmacologic/therapeutic classes |

## Install

```bash
npm install && npm run build
```

## Usage with Claude Desktop

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

## No API Key Required

## License

MIT
