import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const stats = [
  { label: 'Total Notes Published', value: '12,450', change: '+12.3%', up: true },
  { label: 'XLM Earned', value: '84,250', change: '+8.1%', up: true },
  { label: 'Active Listings', value: '3,842', change: '-2.4%', up: false },
  { label: 'Total Traders', value: '1,247', change: '+5.7%', up: true },
]

const transactions = [
  { asset: 'AI Ethics Framework', type: 'Purchase', amount: '250 XLM', status: 'Completed', date: '2026-06-01' },
  { asset: 'Soroban Dev Guide', type: 'Sale', amount: '180 XLM', status: 'Completed', date: '2026-06-01' },
  { asset: 'DeFi Strategy v3', type: 'Purchase', amount: '420 XLM', status: 'Pending', date: '2026-05-31' },
  { asset: 'LLM Weights Pack', type: 'License', amount: '1,200 XLM', status: 'Active', date: '2026-05-30' },
  { asset: 'ZK-Proof Tutorial', type: 'Purchase', amount: '95 XLM', status: 'Completed', date: '2026-05-29' },
  { asset: 'Data Pipeline', type: 'Sale', amount: '640 XLM', status: 'Active', date: '2026-05-28' },
]

const insights = [
  { title: 'Zero-Knowledge Proofs in DeFi', author: '@cryptographic', price: '150 XLM', rating: 4.8 },
  { title: 'Scaling Soroban: Best Practices', author: '@stellar_dev', price: '200 XLM', rating: 4.9 },
  { title: 'AI Agent Economic Models', author: '@agent_theory', price: '320 XLM', rating: 4.7 },
]

const timeRanges = ['24H', '7D', '30D', '1Y']

function StatCard({ label, value, change, up, index }: typeof stats[0] & { index: number }) {
  return (
    <div
      className="glass-card rounded-xl px-md py-lg flex flex-col gap-sm"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
      <div className="flex items-baseline gap-sm">
        <span className="font-label-md text-headline-md text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {value}
        </span>
        <span className={`font-label-sm text-label-sm ${up ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </div>
  )
}

function SparklineChart() {
  const points = [30, 45, 38, 52, 48, 62, 55, 70, 65, 78, 72, 85, 80, 92, 88, 95, 90, 98, 94, 100]
  const width = 200
  const height = 40
  const max = 100
  const stepX = width / (points.length - 1)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * stepX},${height - (p / max) * height}`).join(' ')

  return (
    <svg width={width} height={height} className="w-full h-full">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill="url(#sparkGrad)" />
      <path d={d} fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MarketChart() {
  const [activeRange, setActiveRange] = useState('7D')
  const points = [40, 55, 48, 62, 58, 72, 68, 80, 75, 85, 82, 90, 88, 92, 95, 88, 94, 98, 96, 100]
  const width = 600
  const height = 180
  const max = 100
  const stepX = width / (points.length - 1)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * stepX},${height - (p / max) * height}`).join(' ')

  return (
    <div className="glass-card rounded-xl p-md flex flex-col gap-md">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-md text-headline-md text-on-surface">Market Overview</h2>
        <div className="flex gap-xs">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-sm py-1 font-label-sm text-label-sm rounded-md transition-all cursor-pointer ${
                activeRange === r
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="relative w-full" style={{ height: 200 }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((line) => (
            <line
              key={line}
              x1="0" y1={(height * line) / 100}
              x2={width} y2={(height * line) / 100}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          <path d={`${d} L${width},${height} L0,${height} Z`} fill="url(#chartGrad)" />
          <path d={d} fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {[points.length - 1].map((i) => (
            <circle
              key={i}
              cx={i * stepX}
              cy={height - (points[i] / max) * height}
              r="4"
              fill="#00f0ff"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
        <span>Volume (XLM)</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>+18.4% this period</span>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Completed: 'bg-green-500/10 text-green-400 border-green-500/30',
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Active: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  }

  return (
    <span className={`px-sm py-1 rounded-full font-label-sm text-label-sm border ${colors[status] || ''}`}>
      {status}
    </span>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-xs">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-white/20'}`}>
          ★
        </span>
      ))}
      <span className="font-label-sm text-label-sm text-on-surface-variant ml-xs">{rating}</span>
    </span>
  )
}

export default function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <nav className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
          <Link to="/" className="text-headline-md font-bold text-primary-container no-underline">
            InsightHub
          </Link>
          <div className="hidden md:flex items-center gap-lg">
            <Link to="/dashboard" className="font-label-md text-label-md text-primary-container border-b-2 border-primary-container pb-1 no-underline">
              Dashboard
            </Link>
            <Link to="/marketplace" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors no-underline">
              Marketplace
            </Link>
            <Link to="/analytics" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors no-underline">
              Analytics
            </Link>
            <Link to="/settings" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors no-underline">
              Settings
            </Link>
          </div>
          <div className="flex items-center gap-md">
            {walletConnected ? (
              <div className="flex items-center gap-sm px-sm py-2 bg-surface-container-high rounded-md">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="font-label-sm text-label-sm text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  GA6...8F2
                </span>
              </div>
            ) : (
              <button
                onClick={() => setWalletConnected(true)}
                className="px-md py-2 bg-primary-container text-on-primary-container font-label-md rounded-md neon-glow active:scale-95 transition-transform cursor-pointer"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-[100px] pb-xl px-gutter max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Dashboard</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Welcome back, Researcher. Here's your marketplace overview.
            </p>
          </div>
          <div className="flex items-center gap-sm">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">Stellar Testnet</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md mb-lg">
          <div className="lg:col-span-2">
            <MarketChart />
          </div>
          <div className="glass-card rounded-xl p-md flex flex-col gap-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Portfolio</h2>
            <div className="flex flex-col gap-md flex-1 justify-center">
              <div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mb-xs">Total Balance</div>
                <div className="font-label-md text-headline-lg text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  8,425 XLM
                </div>
                <SparklineChart />
              </div>
              <div className="flex justify-between pt-md border-t border-white/10">
                <div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Assets Listed</div>
                  <div className="font-label-md text-headline-md text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>23</div>
                </div>
                <div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Active Traders</div>
                  <div className="font-label-md text-headline-md text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>847</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-md mb-lg overflow-x-auto">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Recent Transactions</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">Asset</th>
                <th className="text-left font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">Type</th>
                <th className="text-right font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">Amount</th>
                <th className="text-center font-label-sm text-label-sm text-on-surface-variant pb-sm pr-md">Status</th>
                <th className="text-right font-label-sm text-label-sm text-on-surface-variant pb-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.asset + tx.date} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-sm pr-md font-body-md text-body-md text-on-surface">{tx.asset}</td>
                  <td className="py-sm pr-md font-body-sm text-body-sm text-on-surface-variant">{tx.type}</td>
                  <td className="py-sm pr-md text-right font-label-md text-label-md text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {tx.amount}
                  </td>
                  <td className="py-sm pr-md text-center">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-sm text-right font-body-sm text-body-sm text-on-surface-variant">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-lg">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Top Performing Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {insights.map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-md flex flex-col gap-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Research</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">{item.title}</h3>
                <div className="font-body-sm text-body-sm text-on-surface-variant">by {item.author}</div>
                <StarRating rating={item.rating} />
                <div className="flex items-center justify-between mt-sm pt-sm border-t border-white/10">
                  <span className="font-label-md text-label-md text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.price}
                  </span>
                  <button className="px-md py-2 bg-primary-container/20 text-primary-container border border-primary-container/40 rounded-md font-label-sm text-label-sm hover:bg-primary-container/30 transition-all cursor-pointer">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
          {[
            { icon: 'edit_note', label: 'Publish Insight' },
            { icon: 'dataset', label: 'Create Dataset' },
            { icon: 'robot_2', label: 'Deploy Agent' },
            { icon: 'bar_chart_4_bars', label: 'View Analytics' },
          ].map((action) => (
            <button
              key={action.label}
              className="glass-card rounded-xl p-md flex flex-col items-center gap-sm cursor-pointer hover:border-primary-container/40 group"
            >
              <span className="material-symbols-outlined text-2xl text-primary-container group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
