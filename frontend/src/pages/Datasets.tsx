import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'Datasets Marketplace',
  subtitle: 'Directory / Datasets',
  description: 'Curated, high-quality datasets for AI training, financial analysis, and Web3 research. Each dataset is verified for integrity and licensed via Stellar smart contracts.',
  icon: 'database',
  gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent',
  accentColor: '#34d399',
  badgeLabel: 'Curated',
  filters: [
    { label: 'All Types', options: ['Time Series', 'Text', 'Graph', 'Multimodal'] },
    { label: 'Size Range', options: ['< 10GB', '10-100GB', '100GB-1TB', '1TB+'] },
  ],
  items: [
    {
      title: 'Cross-chain Liquidity Dataset', subtitle: '12 months · 50M+ data points',
      specs: [{ label: 'Size', value: '240 GB' }, { label: 'Format', value: 'Parquet' }],
      score: { label: 'Completeness', value: '99.8%', pct: 99.8 },
      price: 3200, badge: 'ai', icon: 'account_balance', gradient: 'from-emerald-900/40 via-teal-900/20 to-surface-container'
    },
    {
      title: 'Multi-Agent Simulation Logs', subtitle: '10K agents · 6 months',
      specs: [{ label: 'Size', value: '85 GB' }, { label: 'Format', value: 'JSON Lines' }],
      score: { label: 'Data Quality', value: '97.2%', pct: 97.2 },
      price: 1800, badge: 'ai', icon: 'diversity_3', gradient: 'from-cyan-900/40 via-blue-900/20 to-surface-container'
    },
    {
      title: 'DeFi Protocol Metrics v4', subtitle: '30 protocols · Real-time',
      specs: [{ label: 'Size', value: '18 GB' }, { label: 'Format', value: 'CSV + API' }],
      score: { label: 'Freshness', value: '99.9%', pct: 99.9 },
      price: 950, badge: 'ai', icon: 'trending_up', gradient: 'from-violet-900/40 via-purple-900/20 to-surface-container'
    },
    {
      title: 'Smart Contract Audit Corpus', subtitle: '15K audits · Labeled',
      specs: [{ label: 'Size', value: '45 GB' }, { label: 'Format', value: 'SQLite' }],
      score: { label: 'Label Accuracy', value: '95.8%', pct: 95.8 },
      price: 2500, badge: 'ai', icon: 'shield', gradient: 'from-rose-900/40 via-pink-900/20 to-surface-container'
    },
    {
      title: 'Web3 Social Graph 2026', subtitle: 'On-chain identity mapping',
      specs: [{ label: 'Size', value: '520 GB' }, { label: 'Format', value: 'Neo4j Dump' }],
      score: { label: 'Coverage', value: '93.5%', pct: 93.5 },
      price: 4500, badge: 'community', icon: 'hub', gradient: 'from-amber-900/40 via-orange-900/20 to-surface-container'
    },
    {
      title: 'Gas Price Prediction Set', subtitle: '5 chains · 24 months',
      specs: [{ label: 'Size', value: '12 GB' }, { label: 'Format', value: 'Feather' }],
      score: { label: 'Signal Quality', value: '96.0%', pct: 96 },
      price: 600, badge: 'community', icon: 'local_gas_station', gradient: 'from-sky-900/40 via-blue-900/20 to-surface-container'
    },
  ],
  featured: {
    title: 'Ultimate AI Training Corpus v3',
    subtitle: '2.4 TB · 500B Tokens',
    badge: 'FLAGSHIP',
    icon: 'diamond',
    description: 'The most comprehensive Web3 AI training dataset ever assembled. 2.4TB of curated, deduplicated, and ethically sourced data covering all major protocols.',
    specs: [
      { label: 'Total Size', value: '2.4 TB' },
      { label: 'Sources', value: '12,000+' },
      { label: 'Tokens', value: '500B' },
    ],
    price: 15000,
  },
}

export default function Datasets() {
  return <CategoryPage config={config} />
}
