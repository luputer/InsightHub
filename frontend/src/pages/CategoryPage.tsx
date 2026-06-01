import { Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'

export interface CategoryConfig {
  title: string
  subtitle: string
  description: string
  icon: string
  gradient: string
  accentColor: string
  badgeLabel: string
  items: CategoryItem[]
  filters: FilterGroup[]
  featured?: FeaturedItem
}

export interface FilterGroup {
  label: string
  options: string[]
}

export interface CategoryItem {
  title: string
  subtitle: string
  specs: { label: string; value: string }[]
  score: { label: string; value: string; pct: number }
  price: number
  badge: 'ai' | 'community'
  icon: string
  gradient?: string
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

const categoryRoutes: Record<string, string> = {
  'LLM Weights': '/weights',
  'Research Notes': '/notes',
  'Datasets': '/datasets',
  'Algorithms': '/algorithms',
}

function Nav() {
  const location = useLocation()
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/settings', label: 'Settings' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
      <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        <div className="flex items-center gap-lg">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary-container tracking-tight no-underline">
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
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input className="bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary-container w-48 lg:w-64 transition-all" placeholder="Search protocol..." type="text" />
          </div>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-highest/50 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="bg-primary-container text-on-primary-container px-md py-2 rounded-lg font-label-md text-label-md font-bold hover:brightness-110 active:scale-95 transition-all neon-glow cursor-pointer">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  )
}

function Sidebar({ activeLabel }: { activeLabel: string }) {
  const categories = [
    { icon: 'grid_view', label: 'All Assets', to: '/marketplace' },
    { icon: 'psychology', label: 'LLM Weights', to: '/weights' },
    { icon: 'description', label: 'Research Notes', to: '/notes' },
    { icon: 'database', label: 'Datasets', to: '/datasets' },
    { icon: 'terminal', label: 'Algorithms', to: '/algorithms' },
  ]

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-20 border-r border-white/5 bg-surface-container-low flex-col hidden lg:flex">
      <div className="px-gutter py-lg">
        <h2 className="font-headline-md text-headline-md font-bold text-primary-container">Market Explorer</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant opacity-70">Decentralized Intelligence</p>
      </div>
      <nav className="flex-grow">
        {categories.map((cat) => (
          <Link
            key={cat.label}
            to={cat.to}
            className={`mx-2 my-1 px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-200 font-label-md text-label-md no-underline ${
              activeLabel === cat.label
                ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:text-primary-container hover:bg-surface-container-highest hover:translate-x-1'
            }`}
          >
            <span className={`material-symbols-outlined ${activeLabel === cat.label ? '' : ''}`}
              style={activeLabel === cat.label ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {cat.icon}
            </span>
            {cat.label}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <div className="bg-surface-variant rounded-xl p-4 border border-white/5">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-3">CURRENT TIER: FREE</p>
          <button className="w-full bg-primary-container/10 border border-primary-container/30 text-primary-container py-2 rounded-lg font-label-sm text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function CategoryPage({ config }: { config: CategoryConfig }) {
  const location = useLocation()
  const activeLabel = Object.entries(categoryRoutes).find(([, v]) => v === location.pathname)?.[0] || 'All Assets'

  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Nav />

      <div className="flex min-h-screen pt-20">
        <Sidebar activeLabel={activeLabel} />

        <main className="flex-grow lg:ml-64 px-gutter py-lg max-w-[100vw]">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary-container font-label-sm text-label-sm tracking-widest uppercase">Directory / Assets</span>
              </div>
              <h1 className="font-display-lg text-display-lg font-bold text-on-surface tracking-tight">{config.title}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">{config.description}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-surface-container rounded-lg p-1 border border-white/5 flex">
                <button className="px-4 py-2 bg-surface-container-highest rounded-md text-primary-container cursor-pointer">
                  <span className="material-symbols-outlined text-base">grid_view</span>
                </button>
                <button className="px-4 py-2 text-on-surface-variant hover:text-on-surface cursor-pointer">
                  <span className="material-symbols-outlined text-base">list</span>
                </button>
              </div>
            </div>
          </header>

          <section className="mb-xl p-md glass-card rounded-2xl flex flex-wrap items-center gap-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">filter_list</span>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">Filters:</span>
            </div>
            <div className="flex-grow flex flex-wrap gap-4">
              {config.filters.map((filter) => (
                <select key={filter.label} className="bg-surface-container-high border border-white/10 rounded-lg text-sm font-label-sm text-on-surface focus:ring-primary-container min-w-[160px] px-3 py-2">
                  <option>{filter.label}</option>
                  {filter.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ))}
              <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />
              <span className="bg-primary-container/10 border border-primary-container/20 text-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-2">
                {config.badgeLabel} <span className="material-symbols-outlined text-xs cursor-pointer">close</span>
              </span>
            </div>
            <div className="text-on-surface-variant font-label-sm text-label-sm">
              Showing <span className="text-primary-container">{config.items.length}</span> verified assets
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {config.items.map((item) => (
              <div key={item.title} className="glass-card rounded-2xl overflow-hidden hover:border-primary-container/50 transition-all group">
                <div className={`h-32 bg-gradient-to-br ${item.gradient || 'from-surface-container-highest to-surface-container'} relative p-md`}>
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-md flex items-center gap-1 border ${
                    item.badge === 'ai'
                      ? 'bg-primary-container/20 border-primary-container/40'
                      : 'bg-tertiary-container/20 border-tertiary-container/40'
                  }`}>
                    <span className="material-symbols-outlined text-primary-container text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.badge === 'ai' ? 'verified' : 'shield_with_heart'}
                    </span>
                    <span className={`font-label-sm text-label-sm ${item.badge === 'ai' ? 'text-primary-container' : 'text-on-tertiary-container'}`}>
                      {item.badge === 'ai' ? 'AI-VETTED' : 'COMMUNITY VET'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary-container text-2xl">{item.icon}</span>
                  </div>
                </div>
                <div className="p-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary-container transition-colors">{item.title}</h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-md">
                    {item.specs.map((spec) => (
                      <div key={spec.label} className="p-3 bg-surface-container-low rounded-lg border border-white/5">
                        <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">{spec.label}</p>
                        <p className="font-label-md text-label-md text-primary-container">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 mb-md">
                    <div className="flex justify-between text-xs">
                      <span className="text-on-surface-variant">{item.score.label}</span>
                      <span className="text-primary-container">{item.score.value}</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full rounded-full" style={{ width: `${item.score.pct}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] font-label-sm text-on-surface-variant uppercase">Price (LIFETIME)</p>
                      <p className="font-headline-md text-headline-md font-bold text-on-surface">
                        {item.price.toLocaleString()} <span className="text-primary-container">XLM</span>
                      </p>
                    </div>
                    <button className="bg-surface-container-highest hover:bg-primary-container hover:text-on-primary-container px-4 py-2 rounded-lg transition-all font-label-md text-label-md cursor-pointer">
                      Buy License
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {config.featured && (
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
                        <p className="font-label-md text-label-md text-secondary">ERC-721W Secure Weight</p>
                      </div>
                      <div className="text-right">
                        <p className="font-headline-xl text-headline-xl font-bold text-on-surface">
                          {config.featured.price.toLocaleString()} <span className="text-primary-container">XLM</span>
                        </p>
                        <button className="mt-4 bg-primary-container text-on-primary-container px-lg py-3 rounded-xl font-label-md text-label-md font-bold neon-glow transition-all hover:scale-105 active:scale-95 cursor-pointer">
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
