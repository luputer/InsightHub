import { useState, useEffect, useMemo } from 'react'
import Footer from '../components/Footer'
import DashboardHeader from '../components/DashboardHeader'
import { getActiveListings, formatPrice, isConnected } from '../services/soroban'
import type { Listing } from '../contracts/marketplace'

const periodFilters = ['7D', '30D', '90D', '1Y', 'All']

function AreaChart({ color = '#00f0ff', data }: { color?: string, data: number[] }) {
  const points = data.length > 0 ? data : [0, 0, 0, 0, 0]
  const width = 800
  const height = 200
  const max = Math.max(...points, 1)
  const stepX = width / (points.length - 1 || 1)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * stepX},${height - (p / max) * height}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((line) => (
        <line key={line} x1="0" y1={(height * line) / 100} x2={width} y2={(height * line) / 100} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      <path d={`${d} L${width},${height} L0,${height} Z`} fill="url(#analyticsGrad)" />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('30D')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const data = await getActiveListings()
        setListings(data || [])
      } catch (err) {
        console.error('Failed to fetch analytics data:', err)
      } finally {
        setLoading(false)
      }
    }
    if (isConnected()) fetchData()
  }, [])

  const stats = useMemo(() => {
    const totalVolume = listings.reduce((acc, curr) => acc + curr.price, 0n)
    const avgPrice = listings.length > 0 ? totalVolume / BigInt(listings.length) : 0n
    return [
      { label: 'Market Volume', value: formatPrice(totalVolume), change: '+0%', up: true },
      { label: 'Active Listings', value: listings.length.toString(), change: '+0%', up: true },
      { label: 'Categories', value: new Set(listings.map(l => l.category)).size.toString(), change: '+0%', up: true },
      { label: 'Avg. Listing Price', value: formatPrice(avgPrice), change: '+0%', up: true },
    ]
  }, [listings])

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    listings.forEach(l => { counts[l.category] = (counts[l.category] || 0) + 1 })
    const total = listings.length || 1
    return [
      { label: 'Prompts', value: Math.round(((counts['Prompts'] || 0) / total) * 100), color: '#fbbf24' },
      { label: 'Scripts', value: Math.round(((counts['Scripts'] || 0) / total) * 100), color: '#10b981' },
      { label: 'Data Packs', value: Math.round(((counts['Data Packs'] || counts['Datasets'] || 0) / total) * 100), color: '#34d399' },
      { label: 'Guides & Research', value: Math.round(((counts['Guides & Research'] || counts['Research'] || 0) / total) * 100), color: '#f472b6' },
    ]
  }, [listings])

  // ─── LOCKED STATE ────────────────────────────────────────────────
  if (!isConnected()) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <DashboardHeader />

        <main
          className="flex-1 flex items-center justify-center"
          style={{
            paddingTop: '70px', // clearance dari fixed header
            width: '100vw',
            minHeight: '70vh',
          }}
        >
          <div
            className="flex flex-col items-center text-center bg-surface-container-low/40 border border-white/5 rounded-2xl backdrop-blur-md shadow-xl"
            style={{
              width: 'min(360px, calc(100vw - 2rem))',
              padding: '2.5rem 2rem',
            }}
          >
            <span
              className="material-symbols-outlined text-primary mb-5"
              style={{ fontSize: '48px' }}
            >
              monitoring
            </span>

            <h1 className="text-xl font-bold text-on-surface mb-3">
              Analytics Locked
            </h1>

            <p
              className="text-sm text-on-surface-variant mb-8"
              style={{ lineHeight: '1.7', maxWidth: '260px' }}
            >
              Connect your wallet to access real-time market intelligence,
              network performance, and platform data metrics.
            </p>

            <button
              className="w-full bg-primary hover:bg-primary/90 text-on-primary text-sm font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Connect Freighter Wallet
            </button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }
  // ─── MAIN DASHBOARD ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <DashboardHeader />

      <main className="pt-[120px] pb-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-on-surface mb-1">Market Analytics</h1>
            <p className="text-sm text-on-surface-variant">Real-time intelligence from the Soroban network.</p>
          </div>
          <div className="flex items-center bg-surface-container-low rounded-xl border border-white/5 p-1">
            {periodFilters.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${period === p
                  ? 'bg-surface-container-highest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-70">
            <span className="material-symbols-outlined text-5xl animate-spin mb-4 text-primary">
              database_sync
            </span>
            <p className="text-sm tracking-wider font-semibold">ANALYZING BLOCKCHAIN DATA...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-surface-container-low/60 border border-white/5 rounded-xl px-5 py-5 flex flex-col justify-between shadow-sm">
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">{stat.label}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {stat.value}
                    </span>
                    <span className="text-xs font-semibold bg-green-500/10 text-green-400 px-2 py-0.5 rounded">
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-surface-container-low/60 border border-white/5 rounded-xl p-5 lg:col-span-2">
                <h2 className="text-lg font-bold text-on-surface mb-4">Listing Price Distribution</h2>
                <div className="w-full bg-background/50 rounded-lg p-2" style={{ height: 240 }}>
                  <AreaChart data={listings.map(l => Number(l.price / 1000000n))} />
                </div>
              </div>

              <div className="bg-surface-container-low/60 border border-white/5 rounded-xl p-5">
                <h2 className="text-lg font-bold text-on-surface mb-4">Category Distribution</h2>
                <div className="flex flex-col gap-4">
                  {categoryData.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-on-surface-variant">{item.label}</span>
                        <span className="text-xs font-bold text-on-surface">{item.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-surface-container-low/60 border border-white/5 rounded-xl p-5">
              <h2 className="text-lg font-bold text-on-surface mb-4">Recent Blockchain Activity</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="text-xs font-semibold text-on-surface-variant uppercase pb-3 pr-4">Asset Name</th>
                      <th className="text-xs font-semibold text-on-surface-variant uppercase pb-3 pr-4">Category</th>
                      <th className="text-xs font-semibold text-on-surface-variant uppercase pb-3 pr-4">Seller</th>
                      <th className="text-xs font-semibold text-on-surface-variant uppercase pb-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {listings.slice(0, 5).map((asset) => (
                      <tr key={asset.id.toString()} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3.5 pr-4 text-sm font-medium text-on-surface">{asset.title}</td>
                        <td className="py-3.5 pr-4">
                          <span className="text-xs font-medium text-secondary bg-secondary-container/10 border border-secondary-container/20 px-2.5 py-0.5 rounded-md">
                            {asset.category}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {asset.seller.slice(0, 6)}...{asset.seller.slice(-4)}
                        </td>
                        <td className="py-3.5 text-right text-sm font-bold text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {formatPrice(asset.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}