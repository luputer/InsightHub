import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
      <nav className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
        <Link to="/" className="text-headline-md font-bold text-primary-container no-underline">
          InsightHub
        </Link>

        <div className="hidden md:flex items-center gap-lg">
          <Link to="/dashboard" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors no-underline">
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
          <Link
            to="/marketplace"
            className="px-md py-2 bg-primary-container text-on-primary-container font-label-md rounded-md neon-glow active:scale-95 transition-transform inline-block no-underline"
          >
            Launch App
          </Link>
        </div>
      </nav>
    </header>
  )
}
