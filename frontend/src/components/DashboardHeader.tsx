import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { connectWallet, disconnectWallet, getAddress, isConnected } from '../services/soroban'

export default function DashboardHeader() {
  const location = useLocation()
  const [address, setAddress] = useState<string | null>(() => isConnected() ? getAddress() : null)
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setLoading(true)
      if (address) {
        await disconnectWallet()
        setAddress(null)
      } else {
        const addr = await connectWallet()
        setAddress(addr)
      }
    } catch (_err) {
      console.error('Wallet connection failed:', _err)
      alert('Failed to connect wallet. Make sure Freighter is installed!')
    } finally {
      setLoading(false)
    }
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/settings', label: 'Settings' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
      <nav className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        <div className="flex items-center gap-lg">
          <Link to="/" className="text-headline-md font-bold text-primary-container no-underline">
            InsightHub
          </Link>
          <div className="hidden md:flex items-center gap-md">
            {links.map((link) => {
              const isMarketplace = link.to === '/marketplace'
              const marketplaceRoutes = ['/marketplace', '/prompts', '/notes', '/datasets', '/scripts']
              const isActive = isMarketplace 
                ? marketplaceRoutes.includes(location.pathname)
                : location.pathname === link.to

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-label-md text-label-md pb-1 no-underline transition-colors ${
                    isActive
                      ? 'text-primary-container border-b-2 border-primary-container'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
          </button>
          {address && (
            <button
              onClick={async () => {
                try {
                  setLoading(true)
                  const res = await fetch(`https://friendbot-testnet.stellar.org?addr=${address}`)
                  if (res.ok) {
                    alert('Wallet funded successfully! You now have Testnet XLM.')
                  } else {
                    alert('Friendbot request completed (already funded or rate limited).')
                  }
                } catch {
                  alert('Failed to request friendbot funding.')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="px-4 py-2 bg-secondary-container text-on-secondary-container font-label-sm rounded-lg hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              Fund Testnet XLM
            </button>
          )}
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="px-md py-2 bg-primary-container text-on-primary font-label-md rounded-lg neon-glow active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Connecting...' : address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>
    </header>
  )
}
