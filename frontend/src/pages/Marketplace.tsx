import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import DashboardHeader from '../components/DashboardHeader'
import MarketSidebar from '../components/MarketSidebar'
import { getActiveListings, formatPrice, buyItem, listItem, isConnected, getAddress } from '../services/soroban'
import type { Listing } from '../contracts/marketplace'

const categoryConfig: Record<string, { icon: string; gradient: string; iconColor: string }> = {
  Prompts: { icon: 'bolt', gradient: 'from-amber-900/40 via-orange-900/20 to-transparent', iconColor: '#fbbf24' },
  Scripts: { icon: 'code', gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent', iconColor: '#10b981' },
  'Data Packs': { icon: 'storage', gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent', iconColor: '#34d399' },
  'Guides & Research': { icon: 'menu_book', gradient: 'from-pink-900/40 via-rose-900/20 to-transparent', iconColor: '#f472b6' },
}

export default function Marketplace() {
  const [assets, setAssets] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState<bigint | null>(null)
  const [sortMode, setSortMode] = useState<'newest' | 'price'>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Prompts',
    description: '',
    price: '',
  })

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getActiveListings()
      setAssets(data)
    } catch (err) {
      console.error('Failed to load listings from Soroban:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => {
      loadAssets()
    })
  }, [loadAssets])

  useEffect(() => {
    const el = cardsRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const cards = el.querySelectorAll('.glass-card')
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
          ; (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
          ; (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
    const address = getAddress()
    const asset = assets.find(a => a.id === id)

    if (asset && address === asset.seller) {
      alert('You cannot purchase your own listing.')
      return
    }

    try {
      setBuyingId(id)
      await buyItem(id)
      localStorage.setItem('purchased_' + id.toString(), 'true')
      alert('Purchase successful!')
      handleDownload(id, title, descriptionText)
      loadAssets()
    } catch (err: unknown) {
      const msg = (err as Error).message || String(err)
      console.error(`Purchase failed:`, err)

      if (msg.includes('not initialized') || msg.includes('Initialize')) {
        alert('Purchase failed: Contract not initialized. Please contact the administrator.')
      } else if (msg.includes('listing is not active')) {
        alert('This listing is no longer active.')
      } else if (msg.includes('cannot buy your own listing') || msg.includes('InvalidAction')) {
        // Many traps return InvalidAction, and common cause is buying own item or insufficient balance
        alert('Purchase failed. Possible reasons:\n1. You are trying to buy your own listing.\n2. Insufficient XLM balance.\n3. Listing is no longer active.')
      } else if (msg.includes('listing not found')) {
        alert('Listing not found.')
      } else {
        alert(`Purchase failed: ${msg}`)
      }
    } finally {
      setBuyingId(null)
    }
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected()) {
      console.log('Please connect your wallet first!')
      return
    }

    try {
      setIsPublishing(true)

      let descriptionPayload = formData.description
      let fileDataUrl = ''

      if (selectedFile) {
        fileDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(selectedFile)
        })

        descriptionPayload = JSON.stringify({
          text: formData.description,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          hasFile: true
        })
      }

      const priceInStroops = BigInt(Math.floor(parseFloat(formData.price) * 10_000_000))
      const listingId = await listItem(
        formData.category,
        formData.title,
        descriptionPayload,
        selectedFile?.name || '',
        priceInStroops
      )

      if (selectedFile && fileDataUrl) {
        localStorage.setItem('asset_file_' + listingId.toString(), fileDataUrl)
        localStorage.setItem('asset_filename_' + listingId.toString(), selectedFile.name)
        localStorage.setItem('asset_filetype_' + listingId.toString(), selectedFile.type)
      }

      console.log('Product published successfully!')
      setIsModalOpen(false)
      setFormData({ title: '', category: 'Prompts', description: '', price: '' })
      setSelectedFile(null)
      loadAssets()
    } catch (err: unknown) {
      console.log(`Publishing failed: ${(err as Error).message || err}`)
    } finally {
      setIsPublishing(false)
    }
  }

  const filteredAndSortedAssets = useMemo(() => {
    const result = assets.filter(asset =>
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return result.sort((a, b) => {
      if (sortMode === 'price') return Number(a.price - b.price)
      return Number(b.created_at - a.created_at)
    })
  }, [assets, sortMode, searchQuery])

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <DashboardHeader />

      <div className="flex min-h-screen pt-20">
        <MarketSidebar />

        <main className="flex-1 md:ml-64 px-gutter py-lg max-w-container-max mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link to="/marketplace" className="text-primary-container font-label-sm text-label-sm tracking-widest uppercase no-underline hover:brightness-110">Marketplace</Link>
              <span className="text-on-surface-variant/30 text-xs">/</span>
              <span className="text-on-surface-variant font-label-sm text-label-sm tracking-widest uppercase">All Assets</span>
            </div>
            {isConnected() && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-md hover:brightness-110 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Publish Asset
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
            <div className="relative w-full md:max-w-2xl mt-2 group rounded-xl border border-white/10 focus-within:border-primary-container focus-within:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container text-2xl">
                search
              </span>
              <input
                className="w-full bg-surface-container-lowest rounded-xl pl-14 pr-4 py-4 text-body-lg focus:outline-none focus:ring-0 transition-all placeholder:text-on-surface-variant/50"
                placeholder="Search knowledge assets, prompts, and scripts..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center bg-surface-container-low rounded-xl border border-white/5 p-1">
                <button
                  onClick={() => setSortMode('newest')}
                  className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${sortMode === 'newest'
                    ? 'bg-surface-container-highest text-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortMode('price')}
                  className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${sortMode === 'price'
                    ? 'bg-surface-container-highest text-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                  Price: Low to High
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <span className="material-symbols-outlined text-6xl animate-spin mb-4 text-primary-container">
                progress_activity
              </span>
              <p className="font-label-lg text-label-lg">Syncing with Soroban...</p>
            </div>
          ) : filteredAndSortedAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-white/10">
              <span className="material-symbols-outlined text-6xl mb-4 text-on-surface-variant/20">
                {searchQuery ? 'search_off' : 'inventory_2'}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">
                {searchQuery ? 'No results found' : 'No Active Listings'}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant/60">
                {searchQuery ? `Try adjusting your search for "${searchQuery}"` : 'Be the first to list an intelligence asset!'}
              </p>
            </div>
          ) : (
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
              {filteredAndSortedAssets.map((asset) => {
                const config = categoryConfig[asset.category] || categoryConfig.Scripts

                let displayDescription = asset.description
                let fileName = ''
                let hasFile = false

                try {
                  const parsed = JSON.parse(asset.description)
                  if (parsed && typeof parsed === 'object') {
                    displayDescription = parsed.text || ''
                    fileName = parsed.fileName || ''
                    hasFile = true
                  }
                } catch {
                  // Not JSON
                }

                const currentAddress = getAddress()
                const isOwner = currentAddress && asset.seller.toLowerCase() === currentAddress.toLowerCase()
                const isPurchased = localStorage.getItem('purchased_' + asset.id.toString()) === 'true'
                const canDownload = isOwner || isPurchased

                return (
                  <div
                    key={asset.id.toString()}
                    className="glass-card rounded-2xl overflow-hidden group hover:border-primary-container/30 transition-all duration-300 flex flex-col justify-between"
                    style={{ minHeight: 480 }}
                  >
                    <div>
                      <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${config.gradient}`}>
                        <div className="absolute bottom-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary-container/40 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" as string }}>
                            verified
                          </span>
                          <span className="font-label-sm text-label-sm text-primary-container">Blockchain Verified</span>
                        </div>
                      </div>
                      <div className="p-md flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-3 py-1 rounded-full uppercase tracking-widest">
                            {asset.category}
                          </span>
                          {hasFile && canDownload && (
                            <span className="flex items-center gap-1 text-xs text-primary-container bg-primary-container/10 px-2 py-0.5 rounded border border-primary-container/20">
                              <span className="material-symbols-outlined text-xs">attachment</span>
                              {fileName.substring(0, 15)}{fileName.length > 15 ? '...' : ''}
                            </span>
                          )}
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-2 line-clamp-1">{asset.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md line-clamp-3">
                          {displayDescription}
                        </p>
                      </div>
                    </div>
                    <div className="p-md pt-0 mt-auto">
                      <div className="flex items-center justify-between pt-sm border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">Price</span>
                          <span className="font-label-md text-label-md text-primary-container font-bold text-lg" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            {formatPrice(asset.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => handlePurchase(asset.id, asset.title, displayDescription)}
                          disabled={buyingId === asset.id}
                          className="px-5 py-2.5 bg-primary-container text-on-primary font-label-md text-label-md rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all neon-glow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {buyingId === asset.id ? 'Processing...' : 'Purchase Access'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container-low border border-white/10 rounded-3xl w-full max-w-[576px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-surface-container-high">
              <h3 className="font-headline-md text-headline-md text-primary-container">Publish New Asset</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer p-1">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <form onSubmit={handlePublish} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">Asset Title</label>
                <input
                  required
                  type="text"
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-body-md focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/20 transition-all"
                  placeholder="e.g. Ultimate GPT-4 Copywriting"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Category</label>
                  <div className="relative">
                    <select
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-body-md focus:border-primary-container focus:outline-none appearance-none cursor-pointer pr-10"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Prompts">Prompts</option>
                      <option value="Scripts">Scripts</option>
                      <option value="Data Packs">Data Packs</option>
                      <option value="Guides & Research">Guides & Research</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                      keyboard_arrow_down
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Price (XLM)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-body-md focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/20 transition-all font-mono"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-5 py-4 text-body-md focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container/20 transition-all resize-none"
                  placeholder="Tell us what makes this asset special..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">Upload Asset File (Optional)</label>
                <div className="relative border border-dashed border-white/10 hover:border-primary-container/50 rounded-xl p-6 bg-surface-container-lowest transition-all flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary-container mb-2">
                    cloud_upload
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">
                    {selectedFile ? selectedFile.name : 'Choose file or drag & drop'}
                  </span>
                  <span className="text-xs text-on-surface-variant/60 mt-1">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Any file format up to 25MB'}
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-4 bg-primary-container text-on-primary font-bold text-lg rounded-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 neon-glow"
                >
                  {isPublishing ? 'Publishing to Blockchain...' : 'List on Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer variant="marketplace" />
    </div>
  )
}
