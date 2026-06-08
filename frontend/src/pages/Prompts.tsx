import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'AI Prompts Marketplace',
  subtitle: 'Directory / Prompts',
  description: 'Boost your productivity with high-quality, verified AI prompts. Optimized for GPT-4, Midjourney, Claude, and more. Copy-paste ready assets for your creative and professional needs.',
  icon: 'bolt',
  gradient: 'from-amber-900/40 via-orange-900/20 to-transparent',
  accentColor: '#fbbf24',
  badgeLabel: 'Verified Quality',
  categoryName: 'Prompts',
  featured: {
    title: 'Master Marketing Prompt Pack',
    subtitle: '30+ Specialized Prompts',
    badge: 'BEST SELLER',
    icon: 'rocket_launch',
    description: 'The only pack you need to run your entire social media marketing campaign with AI. Includes captions, ad copy, and video scripts.',
    specs: [
      { label: 'Total', value: '35 Prompts' },
      { label: 'Guides', value: 'Included' },
      { label: 'Updates', value: 'Lifetime' },
    ],
    price: 49,
  },
}

export default function Prompts() {
  return <CategoryPage config={config} />
}
