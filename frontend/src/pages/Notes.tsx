import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'Research Notes Marketplace',
  subtitle: 'Directory / Notes',
  description: 'Explore peer-reviewed research notes, whitepapers, and technical analyses from leading Web3 and AI researchers. All notes are timestamped and verified on Stellar.',
  icon: 'description',
  gradient: 'from-pink-900/40 via-rose-900/20 to-transparent',
  accentColor: '#f472b6',
  badgeLabel: 'Peer Reviewed',
  filters: [
    { label: 'All Categories', options: ['AI/ML', 'DeFi', 'Zero-Knowledge', 'Infrastructure'] },
    { label: 'Difficulty', options: ['Beginner', 'Intermediate', 'Advanced', 'Research'] },
  ],
  items: [
    {
      title: 'ZK-Proof Aggregation for AI', subtitle: 'By @cryptographic · Mar 2026',
      specs: [{ label: 'Pages', value: '48 Pages' }, { label: 'Citations', value: '127 Ref.' }],
      score: { label: 'Research Depth', value: '96%', pct: 96 },
      price: 150, badge: 'ai', icon: 'fingerprint', gradient: 'from-pink-900/40 via-rose-900/20 to-surface-container'
    },
    {
      title: 'On-chain Liquidity Modeling', subtitle: 'By @defi_theory · Feb 2026',
      specs: [{ label: 'Pages', value: '32 Pages' }, { label: 'Citations', value: '89 Ref.' }],
      score: { label: 'Practical Use', value: '91%', pct: 91 },
      price: 100, badge: 'ai', icon: 'water_drop', gradient: 'from-cyan-900/40 via-blue-900/20 to-surface-container'
    },
    {
      title: 'Scaling Soroban: A Deep Dive', subtitle: 'By @stellar_dev · Jan 2026',
      specs: [{ label: 'Pages', value: '64 Pages' }, { label: 'Citations', value: '203 Ref.' }],
      score: { label: 'Technical Depth', value: '98%', pct: 98 },
      price: 250, badge: 'ai', icon: 'code', gradient: 'from-emerald-900/40 via-teal-900/20 to-surface-container'
    },
    {
      title: 'Multi-Agent Game Theory', subtitle: 'By @agent_theory · Mar 2026',
      specs: [{ label: 'Pages', value: '56 Pages' }, { label: 'Citations', value: '156 Ref.' }],
      score: { label: 'Novelty Score', value: '94%', pct: 94 },
      price: 200, badge: 'ai', icon: 'group_work', gradient: 'from-violet-900/40 via-purple-900/20 to-surface-container'
    },
    {
      title: 'DePIN Network Topologies', subtitle: 'By @infra_research · Dec 2025',
      specs: [{ label: 'Pages', value: '40 Pages' }, { label: 'Citations', value: '78 Ref.' }],
      score: { label: 'Completeness', value: '88%', pct: 88 },
      price: 80, badge: 'community', icon: 'hub', gradient: 'from-amber-900/40 via-orange-900/20 to-surface-container'
    },
    {
      title: 'Homomorphic Encryption Primer', subtitle: 'By @crypto_lab · Feb 2026',
      specs: [{ label: 'Pages', value: '72 Pages' }, { label: 'Citations', value: '245 Ref.' }],
      score: { label: 'Accessibility', value: '85%', pct: 85 },
      price: 120, badge: 'community', icon: 'enhanced_encryption', gradient: 'from-sky-900/40 via-blue-900/20 to-surface-container'
    },
  ],
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
