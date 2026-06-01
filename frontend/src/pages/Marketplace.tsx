import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'

const categories = [
  { icon: 'grid_view', label: 'All Assets', to: '/marketplace' },
  { icon: 'psychology', label: 'LLM Weights', to: '/weights' },
  { icon: 'description', label: 'Research Notes', to: '/notes' },
  { icon: 'database', label: 'Datasets', to: '/datasets' },
  { icon: 'terminal', label: 'Algorithms', to: '/algorithms' },
]

const categoryConfig: Record<string, { icon: string; gradient: string; iconColor: string }> = {
  Weights: { icon: 'psychology', gradient: 'from-violet-900/40 via-purple-900/20 to-transparent', iconColor: '#a78bfa' },
  Algorithm: { icon: 'terminal', gradient: 'from-cyan-900/40 via-blue-900/20 to-transparent', iconColor: '#22d3ee' },
  Dataset: { icon: 'database', gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent', iconColor: '#34d399' },
  Research: { icon: 'description', gradient: 'from-pink-900/40 via-rose-900/20 to-transparent', iconColor: '#f472b6' },
  Datasets: { icon: 'database', gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent', iconColor: '#34d399' },
  Algorithms: { icon: 'terminal', gradient: 'from-cyan-900/40 via-blue-900/20 to-transparent', iconColor: '#22d3ee' },
}

const assets = [
  { category: 'Weights', title: 'Llama-3 Fine-tuning Weights', desc: 'Premium weights optimized for financial sentiment analysis and high-frequency trading. Secured via Stellar IPFS.', price: '25.00 XLM' },
  { category: 'Algorithm', title: 'Optimized Soroban Smart Contracts', desc: 'Standardized templates for high-throughput DEX liquidity pools on Stellar Soroban. Audited for maximum gas efficiency.', price: '15.50 XLM' },
  { category: 'Dataset', title: 'Real-time Cross-chain Analytics', desc: 'Curated data stream of cross-chain liquidity movements. Includes 12 months of historical trend mapping.', price: '42.00 XLM' },
  { category: 'Research', title: 'ZKP Proof Aggregation Notes', desc: 'Comprehensive research on recursive Zero-Knowledge Proofs for scaling decentralized AI model verification.', price: '8.00 XLM' },
  { category: 'Datasets', title: 'Multi-Agent System Trajectories', desc: 'High-fidelity logs from 10,000 parallel agent simulations for collaborative game theory research.', price: '60.00 XLM' },
  { category: 'Algorithms', title: 'Rust-based RL Environment', desc: 'Blazing fast Reinforcement Learning environment written in Rust with Python bindings. 10x faster than traditional setups.', price: '12.00 XLM' },
]

function DashboardNav() {
  const location = useLocation()

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
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-label-md text-label-md pb-1 no-underline transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-container border-b-2 border-primary-container'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="px-md py-2 bg-primary-container text-on-primary font-label-md rounded-lg neon-glow active:scale-95 transition-transform cursor-pointer">
            Connect Wallet
          </button>
        </div>
      </nav>
    </header>
  )
}

export default function Marketplace() {
  const location = useLocation()
  const [sortMode, setSortMode] = useState<'newest' | 'price'>('newest')
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardsRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const cards = el.querySelectorAll('.glass-card')
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="flex min-h-screen pt-20">
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 pt-24 h-screen border-r border-white/5 bg-surface-container-low overflow-y-auto pb-xl">
          <div className="px-gutter mb-lg">
            <h2 className="font-headline-md text-headline-md font-bold text-primary-container">
              Market Explorer
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant opacity-70">
              Decentralized Intelligence
            </p>
          </div>
          <nav className="flex-1">
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.to}
                    className={`w-full mx-2 px-4 py-3 flex items-center gap-3 font-label-md text-label-md rounded-lg transition-all duration-200 no-underline ${
                      location.pathname === cat.to
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'text-on-surface-variant hover:text-primary-container hover:bg-surface-container-highest hover:translate-x-1'
                    }`}
                  >
                    <span className="material-symbols-outlined">{cat.icon}</span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-4 mt-auto">
            <div className="bg-surface-container-high rounded-xl p-4 border border-white/5">
              <p className="font-label-sm text-label-sm text-primary mb-3">
                Limitless Intelligence Access
              </p>
              <button className="w-full py-2 bg-surface-container-highest text-primary-container border border-primary-container/30 rounded-lg font-label-sm text-label-sm hover:bg-primary-container/10 transition-colors cursor-pointer">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 md:ml-64 px-gutter py-lg max-w-container-max mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-lg">
            <div className="relative w-full md:max-w-md group rounded-xl border border-white/10 focus-within:border-primary-container focus-within:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container">
                search
              </span>
              <input
                className="w-full bg-surface-container-lowest rounded-xl pl-12 pr-4 py-3 text-body-md focus:outline-none focus:ring-0 transition-all"
                placeholder="Search knowledge assets..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center bg-surface-container-low rounded-xl border border-white/5 p-1">
                <button
                  onClick={() => setSortMode('newest')}
                  className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    sortMode === 'newest'
                      ? 'bg-surface-container-highest text-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortMode('price')}
                  className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    sortMode === 'price'
                      ? 'bg-surface-container-highest text-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Price: Low to High
                </button>
              </div>
              <button className="p-3 bg-surface-container-low rounded-xl border border-white/5 text-on-surface-variant hover:text-primary-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-lg">
            {assets.map((asset) => {
              const config = categoryConfig[asset.category] || categoryConfig.Algorithms
              return (
                <div
                  key={asset.title}
                  className="glass-card rounded-2xl overflow-hidden group hover:border-primary-container/30 transition-all duration-300 flex flex-col"
                  style={{ minHeight: 480 }}
                >
                  <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${config.gradient}`}>
                    <div className="absolute bottom-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary-container/40 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-container text-[18px]" style={{ fontVariationSettings: "'FILL' 1" as any }}>
                        verified
                      </span>
                      <span className="font-label-sm text-label-sm text-primary-container">AI-Vetted</span>
                    </div>
                  </div>
                  <div className="p-md flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-3 py-1 rounded-full uppercase tracking-widest">
                        {asset.category}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{asset.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-md line-clamp-2 flex-1">
                      {asset.desc}
                    </p>
                    <div className="flex items-center justify-between pt-sm border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Price</span>
                        <span className="font-label-md text-label-md text-primary-container font-bold text-lg" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {asset.price}
                        </span>
                      </div>
                      <button className="px-5 py-2.5 bg-primary-container text-on-primary font-label-md text-label-md rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all neon-glow cursor-pointer">
                        Purchase Access
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-16 flex justify-center items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:border-primary-container/50 text-on-surface-variant transition-colors cursor-pointer">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[1, 2, 3, null, 12].map((page, i) =>
              page === null ? (
                <span key={`e${i}`} className="px-2 text-on-surface-variant">...</span>
              ) : (
                <button
                  key={page}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    page === 1
                      ? 'bg-primary-container text-on-primary font-bold'
                      : 'border border-white/10 hover:border-primary-container/50 text-on-surface-variant'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:border-primary-container/50 text-on-surface-variant transition-colors cursor-pointer">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </main>
      </div>

      <Footer variant="marketplace" />
    </div>
  )
}
