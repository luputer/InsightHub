# InsightHub

Decentralized knowledge marketplace built on Stellar Soroban. Publish, discover, and trade AI-vetted knowledge assets — LLM weights, research notes, datasets, and algorithms — with trustless settlement in XLM.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Smart Contracts:** Rust (Soroban SDK), Stellar testnet
- **AI Integration:** MCP Server (Model Context Protocol)

## Project Structure

```
frontend/          # React SPA
  src/
    components/    # Landing page UI components
    pages/         # Dashboard, Marketplace, Analytics, Settings, etc.
    contracts/     # Typed Soroban contract bindings
backend/           # Soroban smart contracts
  contracts/
    marketplace/   # Marketplace contract (Rust)
mcp-server/        # AI agent MCP server
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Smart Contracts

```bash
cd backend/contracts/marketplace
make build
make test
```

### MCP Server

```bash
cd mcp-server
npm install
export AI_WALLET_SECRET=<your-secret-key>
npm run dev
```

## Smart Contract: Marketplace

| Function | Description |
|---|---|
| `list_item` | Create a listing (category, title, description, price) |
| `update_item` | Update your listing |
| `cancel_item` | Deactivate your listing |
| `buy_item` | Purchase — transfers XLM from buyer to seller |
| `get_listings` | Browse all / active listings |

## Pages

| Route | Page |
|---|---|
| `/` | Landing |
| `/dashboard` | Dashboard |
| `/marketplace` | Marketplace |
| `/analytics` | Analytics |
| `/settings` | Settings |
| `/weights` | LLM Weights |
| `/notes` | Research Notes |
| `/datasets` | Datasets |
| `/algorithms` | Algorithms |
