import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import DashboardHeader from '../components/DashboardHeader'
import MarketSidebar from '../components/MarketSidebar'
import { getActiveListings, formatPrice, buyItem, isConnected, getAddress } from '../services/soroban'
import type { Listing } from '../contracts/marketplace'

export interface CategoryConfig {
  title: string
  subtitle: string
  description: string
  icon: string
  gradient: string
  accentColor: string
  badgeLabel: string
  categoryName: string
  featured?: FeaturedItem
}

export interface FeaturedItem {
  title: string
  subtitle: string
  specs: { label: string; value: string }[]
  price: number
  badge: string
  icon: string
  description: string
}

const categoryIcons: Record<string, string> = {
  Prompts: 'bolt',
  Scripts: 'code',
  Datasets: 'database',
  'Data Packs': 'storage',
  Research: 'description',
  'Guides & Research': 'menu_book',
}

export default function CategoryPage({ config }: { config: CategoryConfig }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState<bigint | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const loadListings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getActiveListings()
      const categoryData = data.filter(
        (item) => item.category.toLowerCase() === config.categoryName.toLowerCase()
      )
      setListings(categoryData)
    } catch (err) {
      console.error('Failed to load listings for category:', config.categoryName, err)
    } finally {
      setLoading(false)
    }
  }, [config.categoryName])

  useEffect(() => {
    Promise.resolve().then(() => {
      loadListings()
    })
  }, [loadListings])

  const handleDownload = (id: bigint, title: string, descriptionText: string) => {
    const fileData = localStorage.getItem('asset_file_' + id.toString())
    const fileName = localStorage.getItem('asset_filename_' + id.toString()) || `${title.toLowerCase().replace(/\s+/g, '_')}_asset.txt`

    if (fileData) {
      const link = document.createElement('a')
      link.href = fileData
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      const textContent = `--- KNOWLEDGE HUB VERIFIED LICENSE ---
Asset ID: ${id.toString()}
Title: ${title}
Description: ${descriptionText}
Status: Purchased & Verified on Stellar.
--------------------------------------`
      const blob = new Blob([textContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handlePurchase = async (id: bigint, title: string, descriptionText: string) => {
    if (!isConnected()) {
      alert('Please connect your wallet first!')
      return
    }
    try {
      setBuyingId(id)
      await buyItem(id)
      localStorage.setItem('purchased_' + id.toString(), 'true')
      alert('Purchase successful!')
      handleDownload(id, title, descriptionText)
      loadListings()
    } catch (err: unknown) {
      const msg = (err as Error).message || String(err)
      if (msg.includes('not initialized') || msg.includes('Initialize')) {
        alert('Purchase failed: Contract not initialized. Please ensure the contract has been initialized with a token address.')
      } else if (msg.includes('listing is not active')) {
        alert('This listing is no longer active.')
      } else if (msg.includes('cannot buy your own listing')) {
        alert('You cannot purchase your own listing.')
      } else if (msg.includes('listing not found')) {
        alert('Listing not found.')
      } else {
        alert(`Purchase failed: ${msg}`)
      }
    } finally {
      setBuyingId(null)
    }
  }

  const filteredListings = useMemo(() => {
    return listings.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [listings, searchQuery])

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <DashboardHeader />

      <div className="flex min-h-screen pt-20">
        <MarketSidebar />

        <main className="flex-1 md:ml-64 px-gutter py-lg max-w-container-max mx-auto w-full">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to="/marketplace" className="text-primary-container font-label-sm text-label-sm tracking-widest uppercase no-underline hover:brightness-110">Marketplace</Link>
                <span className="text-on-surface-variant/30 text-xs">/</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm tracking-widest uppercase">{config.categoryName}</span>
              </div>
              <h1 className="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">{config.title}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">{config.description}</p>
            </div>
          </header>

          <div className="relative w-full md:max-w-2xl group rounded-xl border border-white/10 focus-within:border-primary-container focus-within:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all mb-lg">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container text-2xl">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest rounded-xl pl-14 pr-4 py-4 text-body-lg focus:outline-none focus:ring-0 transition-all placeholder:text-on-surface-variant/50"
              placeholder={`Search in ${config.title}...`}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <span className="material-symbols-outlined text-6xl animate-spin mb-4 text-primary-container">
                progress_activity
              </span>
              <p className="font-label-lg text-label-lg">Syncing with Soroban...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-white/10">
              <span className="material-symbols-outlined text-6xl mb-4 text-on-surface-variant/20">
                {searchQuery ? 'search_off' : 'inventory_2'}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">
                {searchQuery ? 'No results found' : `No Active ${config.categoryName}`}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant/60">
                {searchQuery ? `Try adjusting your search for "${searchQuery}"` : 'Be the first to list an asset in this category!'}
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              {filteredListings.map((item) => {
                let displayDescription = item.description
                let fileName = ''
                let hasFile = false

                try {
                  const parsed = JSON.parse(item.description)
                  if (parsed && typeof parsed === 'object') {
                    displayDescription = parsed.text || ''
                    fileName = parsed.fileName || ''
                    hasFile = true
                  }
                } catch {
                  // Not JSON
                }

                const currentAddress = getAddress()
                const isOwner = currentAddress && item.seller.toLowerCase() === currentAddress.toLowerCase()
                const isPurchased = localStorage.getItem('purchased_' + item.id.toString()) === 'true'
                const canDownload = isOwner || isPurchased

                return (
                  <div key={item.id.toString()} className="glass-card rounded-2xl overflow-hidden hover:border-primary-container/50 transition-all group flex flex-col justify-between" style={{ minHeight: 450 }}>
                    <div>
                      <div className={`h-32 bg-gradient-to-br ${config.gradient} relative p-md`}>
                        <div className="absolute top-4 right-4 px-2 py-1 rounded-md flex items-center gap-1 border bg-primary-container/20 border-primary-container/40">
                          <span className="material-symbols-outlined text-primary-container text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                          <span className="font-label-sm text-label-sm text-primary-container uppercase">Blockchain Verified</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-primary-container text-2xl">{categoryIcons[item.category] || config.icon}</span>
                        </div>
                      </div>
                      <div className="p-md flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-3 py-1 rounded-full uppercase tracking-widest">{item.category}</span>
                          {hasFile && canDownload && (
                            <span className="flex items-center gap-1 text-xs text-primary-container bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20">
                              <span className="material-symbols-outlined text-xs">attachment</span>
                              {fileName.substring(0, 15)}{fileName.length > 15 ? '...' : ''}
                            </span>
                          )}
                        </div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary-container transition-colors line-clamp-1">{item.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md line-clamp-3">
                          {displayDescription}
                        </p>
                      </div>
                    </div>
                    <div className="p-md pt-0 mt-auto">
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">Price (LIFETIME)</p>
                          <p className="font-headline-md text-headline-md font-bold text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => handlePurchase(item.id, item.title, displayDescription)}
                          disabled={buyingId === item.id}
                          className="bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container px-4 py-2 rounded-lg transition-all font-label-md text-label-md cursor-pointer disabled:opacity-50"
                        >
                          {buyingId === item.id ? 'Processing...' : 'Buy Access'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>
          )}

          {config.featured && listings.length > 0 && (
            <section className="mt-lg">
              <div className="glass-card rounded-2xl overflow-hidden hover:border-secondary-container/50 transition-all group">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/3 bg-gradient-to-br from-surface-container-highest to-secondary-container/20 p-lg flex flex-col justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
                      <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{config.featured.icon}</span>
                    </div>
                    <div>
                      <div className="inline-block bg-secondary-container/20 border border-secondary-container/40 text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm mb-4">
                        {config.featured.badge}
                      </div>
                      <h3 className="font-display-lg-mobile text-display-lg-mobile font-bold text-on-surface leading-tight">{config.featured.title}</h3>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-lg">
                    <div className="flex items-center gap-4 mb-md">
                      <span className="material-symbols-outlined text-primary-container">info</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{config.featured.description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-lg">
                      {config.featured.specs.map((spec) => (
                        <div key={spec.label} className="text-center">
                          <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">{spec.label}</p>
                          <p className="font-label-md text-label-md text-on-surface">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">Protocol Standard</p>
                        <p className="font-label-md text-label-md text-secondary">ERC-721W Secure Asset</p>
                      </div>
                      <div className="text-right">
                        <button className="bg-primary-container text-on-primary-container px-lg py-3 rounded-xl font-label-md text-label-md font-bold neon-glow transition-all hover:scale-105 active:scale-95 cursor-pointer">
                          Purchase Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer variant="marketplace" />
    </div>
  )
}
