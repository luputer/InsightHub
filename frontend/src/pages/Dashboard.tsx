import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import DashboardHeader from '../components/DashboardHeader'
import { getActiveListings, getMyListings, isConnected, getAddress, formatPrice, connectWallet } from '../services/soroban'
import type { Listing } from '../contracts/marketplace'

function StatCard({ label, value, index, color = 'text-primary' }: { label: string, value: string, index: number, color?: string }) {
  return (
    <div
      className="glass-card rounded-xl px-md py-lg flex flex-col gap-sm"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      <div className="flex items-baseline gap-sm">
        <span className={`font-label-md text-headline-md ${color}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {value}
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState<string | null>(() => isConnected() ? getAddress() : null)

  const loadDashboardData = useCallback(async (userAddress: string | null) => {
    try {
      setLoading(true)
      const all = await getActiveListings()
      setAllListings(all)

      if (userAddress) {
        const mine = await getMyListings(userAddress)
        setMyListings(mine)
      } else {
        setMyListings([])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    Promise.resolve().then(() => {
      loadDashboardData(address)
    })
  }, [address, loadDashboardData])

  // Sync wallet state across components (header / modal)
  useEffect(() => {
    const interval = setInterval(() => {
      const activeAddr = isConnected() ? getAddress() : null
      if (activeAddr !== address) {
        setAddress(activeAddr)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [address])

  const handleConnect = async () => {
    try {
      setLoading(true)
      const addr = await connectWallet()
      setAddress(addr)
    } catch (err) {
      console.error('Wallet connection failed:', err)
      alert('Failed to connect wallet. Make sure Freighter is installed!')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const totalVolume = allListings.reduce((acc, curr) => acc + curr.price, 0n)
    return [
      { label: 'Platform Assets', value: allListings.length.toString(), color: 'text-primary' },
      { label: 'My Active Listings', value: myListings.length.toString(), color: 'text-secondary' },
      { label: 'Network Volume', value: formatPrice(totalVolume), color: 'text-primary' },
      { label: 'Stellar Status', value: 'Active', color: 'text-green-400' },
    ]
  }, [allListings, myListings])

  if (!isConnected()) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-on-surface">
        <DashboardHeader />

        <main
          className="flex-1 flex items-center justify-center"
          style={{
            paddingTop: '70px',
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="pt-[100px] pb-xl px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Dashboard</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back, {address?.slice(0, 8)}...{address?.slice(-4)}.
            </p>
          </div>
          <div className="flex items-center gap-sm bg-surface-container-high px-4 py-2 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-label-sm text-label-sm text-on-surface">Connected to Testnet</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 opacity-50">
            <span className="material-symbols-outlined text-6xl animate-spin mb-4 text-primary-container">
              sync
            </span>
            <p className="font-label-lg text-label-lg">Syncing Dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
              {stats.map((stat, i) => (
                <StatCard key={stat.label} {...stat} index={i} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-lg">
              <div className="lg:col-span-2 glass-card rounded-2xl p-md">
                <div className="flex items-center justify-between mb-lg">
                  <h2 className="font-headline-md text-headline-md text-on-surface">My Active Assets</h2>
                  <Link to="/marketplace" className="text-primary-container font-label-md text-label-md no-underline hover:underline">View All</Link>
                </div>
                {myListings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest/50 rounded-xl border border-dashed border-white/5">
                    <span className="material-symbols-outlined text-5xl mb-4 text-on-surface-variant/20">post_add</span>
                    <p className="font-body-md text-on-surface-variant">You haven't listed any assets yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myListings.map(listing => (
                      <div key={listing.id.toString()} className="flex items-center justify-between p-4 bg-surface-container-high/50 rounded-xl border border-white/5 hover:border-primary-container/30 transition-all">
                        <div className="flex flex-col">
                          <span className="font-label-md text-on-surface">{listing.title}</span>
                          <span className="font-label-sm text-on-surface-variant">{listing.category}</span>
                        </div>
                        <div className="font-label-md text-primary-container" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {formatPrice(listing.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-md flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Platform Insights</h2>
                <div className="flex flex-col gap-6 flex-1 justify-center">
                  <div className="p-4 bg-primary-container/5 rounded-xl border border-primary-container/10">
                    <div className="font-body-sm text-on-surface-variant mb-1">Total Market Value</div>
                    <div className="font-label-md text-headline-lg text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatPrice(allListings.reduce((acc, curr) => acc + curr.price, 0n))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-highest/30 rounded-xl">
                      <div className="font-body-sm text-on-surface-variant">Unique Sellers</div>
                      <div className="font-label-md text-headline-md text-on-surface">{new Set(allListings.map(l => l.seller)).size}</div>
                    </div>
                    <div className="p-4 bg-surface-container-highest/30 rounded-xl">
                      <div className="font-body-sm text-on-surface-variant">Avg Price</div>
                      <div className="font-label-md text-headline-sm text-on-surface">
                        {allListings.length > 0 ? formatPrice(allListings.reduce((acc, curr) => acc + curr.price, 0n) / BigInt(allListings.length)) : '0 XLM'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
              {[
                { icon: 'bolt', label: 'Explore Prompts', to: '/prompts' },
                { icon: 'code', label: 'Browse Scripts', to: '/scripts' },
                { icon: 'database', label: 'Data Packs', to: '/datasets' },
                { icon: 'menu_book', label: 'Read Guides', to: '/notes' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="glass-card rounded-2xl p-xl flex flex-col items-center justify-center gap-md cursor-pointer hover:border-primary-container/40 hover:bg-surface-container-high/50 group transition-all min-h-[160px] no-underline"
                >
                  <div className="w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center group-hover:bg-primary-container/20 transition-colors">
                    <span className="material-symbols-outlined text-3xl text-primary-container group-hover:scale-110 transition-transform">
                      {action.icon}
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface group-hover:text-primary-container transition-colors text-center">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
