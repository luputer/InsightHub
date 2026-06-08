import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'Smart Scripts Marketplace',
  subtitle: 'Directory / Scripts',
  description: 'Powerful, lightweight automation scripts and tools. From web scrapers to trading bots, get production-ready code to automate your repetitive tasks.',
  icon: 'code',
  gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent',
  accentColor: '#10b981',
  badgeLabel: 'Production Ready',
  categoryName: 'Scripts',
  featured: {
    title: 'Enterprise Automation Kit',
    subtitle: 'Unified Dashboard + Scripts',
    badge: 'NEW',
    icon: 'settings_suggest',
    description: 'A comprehensive suite of scripts designed for full-scale business automation. Manage your data, bots, and tasks from one place.',
    specs: [
      { label: 'Total', value: '12 Scripts' },
      { label: 'UI', value: 'Included' },
      { label: 'Support', value: '24/7' },
    ],
    price: 350,
  },
}

export default function Scripts() {
  return <CategoryPage config={config} />
}
