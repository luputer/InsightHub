import { Link, useLocation } from 'react-router-dom'

const categories = [
  { icon: 'grid_view', label: 'All Assets', to: '/marketplace' },
  { icon: 'bolt', label: 'AI Prompts', to: '/prompts' },
  { icon: 'storage', label: 'Data Packs', to: '/datasets' },
  { icon: 'code', label: 'Smart Scripts', to: '/scripts' },
  { icon: 'menu_book', label: 'Guides & Research', to: '/notes' },
]

export default function MarketSidebar() {
  const location = useLocation()

  return (
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
        <ul className="space-y-1 list-none p-0">
          {categories.map((cat) => (
            <li key={cat.label}>
              <Link
                to={cat.to}
                className={`mx-2 px-4 py-3 flex items-center gap-3 font-label-md text-label-md rounded-lg transition-all duration-200 no-underline ${
                  location.pathname === cat.to
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:text-primary-container hover:bg-surface-container-highest hover:translate-x-1'
                }`}
              >
                <span className="material-symbols-outlined" style={location.pathname === cat.to ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {cat.icon}
                </span>
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
  )
}
