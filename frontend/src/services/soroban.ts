import { StellarContractsKit, FreighterAdapter } from 'stellar-contracts-kit'
import type { Marketplace, Listing } from '../contracts/marketplace'
import { CONTRACT_ID } from '../contracts/marketplace'

const STROOP_TO_XLM = 10_000_000n

let kit: StellarContractsKit | null = null
let contractPromise: Promise<Marketplace> | null = null
let currentAddress: string | null = null

function getKit(): StellarContractsKit {
  if (!kit) {
    kit = new StellarContractsKit({
      network: 'testnet',
    })
  }
  return kit
}

export function isConnected(): boolean {
  return currentAddress !== null
}

export function getAddress(): string | null {
  return currentAddress
}

async function ensureAccountFunded(address: string): Promise<void> {
  try {
    const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`)
    if (res.status === 404) {
      console.log(`Account ${address} not found, funding via Friendbot...`)
      const fundRes = await fetch(`https://friendbot-testnet.stellar.org?addr=${address}`)
      if (fundRes.ok) {
        console.log('Account funded successfully!')
        // Wait for ledger to close
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
  } catch (err) {
    console.warn('Failed to check/fund account:', err)
  }
}

export async function connectWallet(): Promise<string> {
  kit = new StellarContractsKit({
    network: 'testnet',
    wallet: new FreighterAdapter(),
  })
  contractPromise = null
  const { address } = await kit.connect()
  currentAddress = address

  await ensureAccountFunded(address)

  return address
}

export async function disconnectWallet(): Promise<void> {
  kit = new StellarContractsKit({ network: 'testnet' })
  contractPromise = null
  currentAddress = null
}

export function formatPrice(price: bigint): string {
  try {
    const xlm = Number(price) / Number(STROOP_TO_XLM)
    return `${xlm.toFixed(2)} XLM`
  } catch {
    return '0.00 XLM'
  }
}

async function getContract(): Promise<Marketplace> {
  if (!contractPromise) {
    const k = getKit()
    contractPromise = k.contract<Marketplace>(CONTRACT_ID)
  }
  return contractPromise
}

export async function getListings(): Promise<Listing[]> {
  try {
    const c = await getContract()
    const response = await c.get_listings.read()
    return (response.result || []) as Listing[]
  } catch (err: unknown) {
    console.error('Error fetching listings:', err)
    if ((err as Error).message?.includes('encoded string')) return []
    throw err
  }
}

export async function getActiveListings(): Promise<Listing[]> {
  try {
    const c = await getContract()
    const response = await c.get_active_listings.read()
    return (response.result || []) as Listing[]
  } catch (err: unknown) {
    console.error('Error fetching active listings:', err)
    if ((err as Error).message?.includes('encoded string')) return []
    throw err
  }
}

export async function getMyListings(caller: string): Promise<Listing[]> {
  try {
    const c = await getContract()
    const response = await c.get_my_listings.read(caller)
    return (response.result || []) as Listing[]
  } catch (err: unknown) {
    console.error('Error fetching my listings:', err)
    if ((err as Error).message?.includes('encoded string')) return []
    throw err
  }
}

export async function getListing(id: bigint): Promise<Listing | null> {
  try {
    const c = await getContract()
    const response = await c.get_listing.read(id)
    return response.result as Listing
  } catch (err: unknown) {
    console.error(`Error fetching listing ${id}:`, err)
    if ((err as Error).message?.includes('encoded string')) return null
    throw err
  }
}

export async function initializeContract(tokenAddress: string): Promise<void> {
  if (!currentAddress) throw new Error('Wallet not connected')
  await ensureAccountFunded(currentAddress)
  const c = await getContract()
  await c.initialize.invoke(tokenAddress)
}

export async function listItem(
  category: string,
  title: string,
  description: string,
  file_link: string,
  price: bigint,
): Promise<bigint> {
  if (!currentAddress) throw new Error('Wallet not connected')
  await ensureAccountFunded(currentAddress)
  const c = await getContract()
  const { result } = await c.list_item.invoke(currentAddress, category, title, description, file_link, price)
  return result as bigint
}

export async function buyItem(id: bigint): Promise<void> {
  if (!currentAddress) throw new Error('Wallet not connected')
  await ensureAccountFunded(currentAddress)
  const c = await getContract()
  try {
    console.log(`Attempting to buy item ${id} as ${currentAddress}...`)
    await c.buy_item.invoke(currentAddress, id)
  } catch (err: unknown) {
    console.error('buy_item failed:', err)
    // Extract more info if available
    const simError = (err as { simulation?: { error?: unknown } })?.simulation?.error
    if (simError) {
      console.error('Simulation error details:', simError)
    }
    throw err
  }
}

export async function cancelItem(id: bigint): Promise<void> {
  if (!currentAddress) throw new Error('Wallet not connected')
  await ensureAccountFunded(currentAddress)
  const c = await getContract()
  await c.cancel_item.invoke(currentAddress, id)
}

export async function updateItem(
  id: bigint,
  category: string,
  title: string,
  description: string,
  price: bigint,
): Promise<void> {
  if (!currentAddress) throw new Error('Wallet not connected')
  await ensureAccountFunded(currentAddress)
  const c = await getContract()
  await c.update_item.invoke(currentAddress, id, category, title, description, price)
}
