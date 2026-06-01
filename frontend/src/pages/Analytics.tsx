import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'

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
          <button className="px-md py-2 bg-primary-container text-on-primary font-label-md rounded-lg neon-glow active:scale-95 transition-transform cursor-pointer">
            Connect Wallet
          </button>
        </div>
      </nav>
    </header>
  )
}

const periodFilters = ['7D', '30D', '90D', '1Y', 'All']

function AreaChart({ color = '#00f0ff' }: { color?: string }) {
  const points = [30, 45, 55, 42, 60, 50, 65, 58, 72, 68, 78, 70, 82, 75, 85, 80, 88, 84, 92, 90, 95, 88, 96, 100]
  const width = 800
  const height = 200
  const max = 100
  const stepX = width / (points.length - 1)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * stepX},${height - (p / max) * height}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
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

function BarChart() {
  const bars = [35, 60, 45, 80, 55, 70, 90, 65, 85, 50, 75, 95]
  const max = 100
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="flex items-end gap-2 flex-1" style={{ height: 180 }}>
      {bars.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${(h / max) * 100}%`,
              background: 'linear-gradient(to top, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.6))',
            }}
          />
          <span className="font-label-sm text-label-sm text-on-surface-variant">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

const topAssets = [
  { rank: 1, name: 'Llama-3 Fine-tuning Weights', sales: 342, volume: '8,550 XLM', change: '+12.3%' },
  { rank: 2, name: 'Optimized Soroban Contracts', sales: 289, volume: '4,480 XLM', change: '+8.7%' },
  { rank: 3, name: 'Real-time Cross-chain Analytics', sales: 201, volume: '8,442 XLM', change: '+15.2%' },
  { rank: 4, name: 'ZKP Proof Aggregation Notes', sales: 178, volume: '1,424 XLM', change: '-2.1%' },
  { rank: 5, name: 'Multi-Agent System Trajectories', sales: 145, volume: '8,700 XLM', change: '+5.4%' },
]

export default function Analytics() {
  const [period, setPeriod] = useState('30D')

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-[100px] pb-xl px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Analytics</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Platform performance and market intelligence.
            </p>
          </div>
          <div className="flex items-center bg-surface-container-low rounded-xl border border-white/5 p-1">
            {periodFilters.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                  period === p
                    ? 'bg-surface-container-highest text-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
          {[
            { label: 'Total Volume', value: '142,850 XLM', change: '+18.4%', up: true },
            { label: 'Transactions', value: '3,847', change: '+12.6%', up: true },
            { label: 'Active Users', value: '1,247', change: '+5.7%', up: true },
            { label: 'Avg. Price per Asset', value: '37.20 XLM', change: '-3.1%', up: false },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl px-md py-lg flex flex-col gap-sm">
              <span className="font-body-sm text-body-sm text-on-surface-variant">{stat.label}</span>
              <div className="flex items-baseline gap-sm">
                <span className="font-label-md text-headline-md text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {stat.value}
                </span>
                <span className={`font-label-sm text-label-sm ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-md mb-lg">
          <div className="glass-card rounded-xl p-md">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Transaction Volume</h2>
            <div className="w-full" style={{ height: 240 }}>
              <AreaChart />
            </div>
          </div>
          <div className="glass-card rounded-xl p-md">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Monthly Sales</h2>
            <BarChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-lg">
          <div className="glass-card rounded-xl p-md">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Category Distribution</h2>
            <div className="flex flex-col gap-md">
              {[
                { label: 'LLM Weights', value: 35, color: '#00f0ff' },
                { label: 'Research Notes', value: 28, color: '#8b5cf6' },
                { label: 'Datasets', value: 22, color: '#f472b6' },
                { label: 'Algorithms', value: 15, color: '#34d399' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-xs">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{item.label}</span>
                    <span className="font-label-sm text-label-sm text-on-surface">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-md lg:col-span-2">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Top Performing Assets</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">#</th>
                    <th className="text-left font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">Asset</th>
                    <th className="text-right font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">Sales</th>
                    <th className="text-right font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">Volume</th>
                    <th className="text-right font-label-sm text-label-sm text-on-surface-variant pb-sm">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {topAssets.map((asset) => (
                    <tr key={asset.rank} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-sm pr-md">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full font-label-sm text-label-sm ${
                          asset.rank <= 3 ? 'bg-primary-container/20 text-primary-container' : 'text-on-surface-variant'
                        }`}>
                          {asset.rank}
                        </span>
                      </td>
                      <td className="py-sm pr-md font-body-md text-body-md text-on-surface">{asset.name}</td>
                      <td className="py-sm pr-md text-right font-label-md text-label-md text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {asset.sales}
                      </td>
                      <td className="py-sm pr-md text-right font-label-md text-label-md text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {asset.volume}
                      </td>
                      <td className={`py-sm text-right font-label-sm text-label-sm ${asset.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
