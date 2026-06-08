import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import {
  Keypair,
  Contract,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  scValToNative,
  BASE_FEE,
  rpc,
} from '@stellar/stellar-sdk'

const CONTRACT_ID = 'CACQRTEGIEFK7JURNBXXKPZLLRQ44MPQKXWNSUNQUNJGTPLE2PXAMG4Q'
const NETWORK_PASSPHRASE = Networks.TESTNET
const RPC_URL = 'https://soroban-testnet.stellar.org'
const HORIZON_URL = 'https://horizon-testnet.stellar.org'

const server = new rpc.Server(RPC_URL)
const contract = new Contract(CONTRACT_ID)

const secretKey = process.env.AI_WALLET_SECRET
if (!secretKey) {
  console.error('AI_WALLET_SECRET environment variable required')
  process.exit(1)
}
const keypair = Keypair.fromSecret(secretKey)
const sellerAddress = keypair.publicKey()

function toScVal(val: unknown): import('@stellar/stellar-sdk').xdr.ScVal {
  const type = typeof val === 'string' && ((val as string).startsWith('G') || (val as string).startsWith('C'))
    ? 'address' as const
    : undefined
  return nativeToScVal(val, type ? { type } : undefined)
}

async function simulate(method: string, args: unknown[]): Promise<unknown> {
  const source = await server.getAccount(sellerAddress)
  const scArgs = args.map(toScVal)
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...scArgs))
    .setTimeout(30)
    .build()

  const sim = await server.simulateTransaction(tx)
  const simRes = sim as rpc.Api.SimulateTransactionSuccessResponse
  if ('error' in sim && (sim as rpc.Api.SimulateTransactionErrorResponse).error) {
    throw new Error(`Simulation failed: ${(sim as rpc.Api.SimulateTransactionErrorResponse).error}`)
  }
  if (!simRes.result?.retval) throw new Error('No simulation result')
  return scValToNative(simRes.result.retval)
}

async function invoke(method: string, args: unknown[]): Promise<unknown> {
  const source = await server.getAccount(sellerAddress)
  const scArgs = args.map(toScVal)
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...scArgs))
    .setTimeout(30)
    .build()

  const prepared = await server.prepareTransaction(tx)
  prepared.sign(keypair)
  const sendResult = await server.sendTransaction(prepared)

  if (sendResult.status === 'ERROR') {
    throw new Error(`Submission failed: ${JSON.stringify((sendResult as any).errorResult)}`)
  }

  const pollResult = await server.pollTransaction(sendResult.hash)
  if (pollResult.status === 'FAILED') {
    throw new Error(`Transaction failed: ${(pollResult as rpc.Api.GetFailedTransactionResponse).resultXdr?.result().toString()}`)
  }
  if (pollResult.status !== 'SUCCESS') {
    throw new Error(`Transaction not found: ${sendResult.hash}`)
  }

  const retval = (pollResult as rpc.Api.GetSuccessfulTransactionResponse).returnValue
  if (retval) return scValToNative(retval)
  return undefined
}

async function getXlmBalance(address: string): Promise<string> {
  const res = await fetch(`${HORIZON_URL}/accounts/${address}`)
  if (!res.ok) return '0'
  const data = await res.json() as { balances: { balance: string; asset_type: string }[] }
  const native = data.balances.find(b => b.asset_type === 'native')
  return native?.balance || '0'
}

const mcpServer = new Server(
  { name: 'marketplace-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } },
)

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_listings',
      description: 'Get all marketplace listings',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_active_listings',
      description: 'Get only active marketplace listings',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_listing',
      description: 'Get a single listing by ID',
      inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] },
    },
    {
      name: 'get_my_listings',
      description: 'Get listings by seller address',
      inputSchema: { type: 'object', properties: { caller: { type: 'string' } }, required: ['caller'] },
    },
    {
      name: 'get_orders',
      description: 'Get orders for a listing',
      inputSchema: { type: 'object', properties: { listing_id: { type: 'number' } }, required: ['listing_id'] },
    },
    {
      name: 'list_item',
      description: 'Create a new listing. AI wallet is the seller.',
      inputSchema: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', description: 'Price in stroops (1 XLM = 10000000 stroops)' },
        },
        required: ['category', 'title', 'description', 'price'],
      },
    },
    {
      name: 'buy_item',
      description: 'Buy a listing. AI wallet must have XLM balance >= listing price.',
      inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] },
    },
    {
      name: 'cancel_item',
      description: 'Cancel own listing (AI wallet must be the seller)',
      inputSchema: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'] },
    },
    {
      name: 'update_item',
      description: 'Update own listing (AI wallet must be the seller)',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          category: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
        },
        required: ['id', 'category', 'title', 'description', 'price'],
      },
    },
    {
      name: 'get_balance',
      description: 'Get AI wallet XLM balance on testnet',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_wallet_address',
      description: 'Get AI wallet public address',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'fund_wallet',
      description: 'Fund AI wallet with testnet XLM via Friendbot',
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params
  const a = args as Record<string, unknown>
  try {
    switch (name) {
      case 'get_listings': {
        const result = await simulate('get_listings', [])
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
      }
      case 'get_active_listings': {
        const result = await simulate('get_active_listings', [])
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
      }
      case 'get_listing': {
        const result = await simulate('get_listing', [BigInt(a.id as number)])
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
      }
      case 'get_my_listings': {
        const result = await simulate('get_my_listings', [a.caller as string])
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
      }
      case 'get_orders': {
        const result = await simulate('get_orders', [BigInt(a.listing_id as number)])
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
      }
      case 'list_item': {
        const result = await invoke('list_item', [
          sellerAddress,
          a.category as string,
          a.title as string,
          a.description as string,
          BigInt(a.price as number),
        ])
        return { content: [{ type: 'text', text: `Listing created with ID: ${result}` }] }
      }
      case 'buy_item': {
        await invoke('buy_item', [sellerAddress, BigInt(a.id as number)])
        return { content: [{ type: 'text', text: `Successfully purchased listing ${a.id}` }] }
      }
      case 'cancel_item': {
        await invoke('cancel_item', [sellerAddress, BigInt(a.id as number)])
        return { content: [{ type: 'text', text: `Listing ${a.id} cancelled` }] }
      }
      case 'update_item': {
        await invoke('update_item', [
          sellerAddress,
          BigInt(a.id as number),
          a.category as string,
          a.title as string,
          a.description as string,
          BigInt(a.price as number),
        ])
        return { content: [{ type: 'text', text: `Listing ${a.id} updated` }] }
      }
      case 'get_balance': {
        const balance = await getXlmBalance(sellerAddress)
        return { content: [{ type: 'text', text: `${balance} XLM` }] }
      }
      case 'get_wallet_address': {
        return { content: [{ type: 'text', text: sellerAddress }] }
      }
      case 'fund_wallet': {
        const res = await fetch(`https://friendbot-testnet.stellar.org?addr=${sellerAddress}`)
        const data = await res.json() as { hash?: string }
        return { content: [{ type: 'text', text: `Wallet funded! txHash: ${data.hash || 'unknown'}` }] }
      }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${(err as Error).message}` }],
      isError: true,
    }
  }
});
// Auto-initialize contract on startup with native XLM token after ensuring AI wallet is funded
(async () => {
  try {
    console.error("Ensuring AI wallet is funded...");
    const fundRes = await fetch(`https://friendbot-testnet.stellar.org?addr=${sellerAddress}`);
    if (fundRes.ok) {
      console.error("AI wallet funded/checked successfully!");
    } else {
      console.error("AI wallet already funded or Friendbot skipped.");
    }
    
    console.error("Checking if contract is initialized...");
    const nativeToken = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
    await invoke('initialize', [nativeToken]);
    console.error("Contract successfully initialized with token:", nativeToken);
  } catch (err: any) {
    console.error("Contract initialization status/result:", err.message);
  }
})();

const transport = new StdioServerTransport()
await mcpServer.connect(transport)
