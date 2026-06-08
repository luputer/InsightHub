import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'Research Notes Marketplace',
  subtitle: 'Directory / Notes',
  description: 'Explore peer-reviewed research notes, whitepapers, and technical analyses from leading Web3 and AI researchers. All notes are timestamped and verified on Stellar.',
  icon: 'description',
  gradient: 'from-pink-900/40 via-rose-900/20 to-transparent',
  accentColor: '#f472b6',
  badgeLabel: 'Peer Reviewed',
  categoryName: 'Guides & Research',
  featured: {
    title: 'The Future of Decentralized AI',
    subtitle: '120-page Comprehensive Analysis',
    badge: 'BESTSELLER',
    icon: 'auto_awesome',
    description: 'A comprehensive 120-page analysis of how blockchain and AI converge, featuring exclusive interviews with 15 leading researchers.',
    specs: [
      { label: 'Pages', value: '120 Pages' },
      { label: 'Readers', value: '3.4K+' },
      { label: 'Rating', value: '4.9/5.0' },
    ],
    price: 500,
  },
}

export default function Notes() {
  return <CategoryPage config={config} />
}
