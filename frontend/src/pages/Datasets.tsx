import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'Datasets Marketplace',
  subtitle: 'Directory / Datasets',
  description: 'Curated, high-quality datasets for AI training, financial analysis, and Web3 research. Each dataset is verified for integrity and licensed via Stellar smart contracts.',
  icon: 'database',
  gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent',
  accentColor: '#34d399',
  badgeLabel: 'Curated',
  categoryName: 'Data Packs',
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
