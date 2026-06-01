import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'LLM Weights Marketplace',
  subtitle: 'Directory / Assets',
  description: 'Access verified, decentralized transformer weights and optimized model shards. All assets are cryptographically signed and AI-vetted for safety and performance.',
  icon: 'psychology',
  gradient: 'from-violet-900/40 via-purple-900/20 to-transparent',
  accentColor: '#a78bfa',
  badgeLabel: '8-bit Quantized',
  filters: [
    { label: 'All Architectures', options: ['Llama-3', 'Mistral', 'Phi-3', 'MoE (Mixture of Experts)'] },
    { label: 'Parameter Count', options: ['< 7B', '7B - 20B', '20B - 70B', '100B+'] },
  ],
  items: [
    {
      title: 'Llama-3-70B Finetuned', subtitle: 'Architecture: Transformer Decoder-only',
      specs: [{ label: 'Parameters', value: '70.6 Billion' }, { label: 'Hardware', value: '8x H100 Cluster' }],
      score: { label: 'Cognitive Score', value: '98.4%', pct: 98.4 },
      price: 1250, badge: 'ai', icon: 'memory', gradient: 'from-indigo-900/40 via-purple-900/20 to-surface-container'
    },
    {
      title: 'Mistral-Instruct Optimized', subtitle: 'Architecture: Slid. Window Attention',
      specs: [{ label: 'Parameters', value: '7.3 Billion' }, { label: 'Hardware', value: 'A100 x 64' }],
      score: { label: 'Efficiency Score', value: '94.2%', pct: 94.2 },
      price: 450, badge: 'ai', icon: 'neurology', gradient: 'from-cyan-900/40 via-blue-900/20 to-surface-container'
    },
    {
      title: 'Phi-3-Mini 4K Instruct', subtitle: 'Architecture: Slim-Transformer',
      specs: [{ label: 'Parameters', value: '3.8 Billion' }, { label: 'Hardware', value: 'Mac Studio M2' }],
      score: { label: 'Logic Consistency', value: '89.9%', pct: 89.9 },
      price: 180, badge: 'community', icon: 'database', gradient: 'from-emerald-900/40 via-teal-900/20 to-surface-container'
    },
    {
      title: 'CodeLlama-34B Base', subtitle: 'Architecture: Specialized Coding',
      specs: [{ label: 'Parameters', value: '34.1 Billion' }, { label: 'Hardware', value: 'TPU v4 Node' }],
      score: { label: 'Code Accuracy', value: '91.5%', pct: 91.5 },
      price: 890, badge: 'ai', icon: 'architecture', gradient: 'from-rose-900/40 via-pink-900/20 to-surface-container'
    },
    {
      title: 'Gemma-2-27B Instruct', subtitle: 'Architecture: Multi-Query Attention',
      specs: [{ label: 'Parameters', value: '27.2 Billion' }, { label: 'Hardware', value: '4x A100 80GB' }],
      score: { label: 'Reasoning Score', value: '96.1%', pct: 96.1 },
      price: 760, badge: 'ai', icon: 'smart_toy', gradient: 'from-amber-900/40 via-orange-900/20 to-surface-container'
    },
    {
      title: 'Qwen-2.5-32B MoE', subtitle: 'Architecture: MoE - 8 Experts',
      specs: [{ label: 'Parameters', value: '32.5 Billion' }, { label: 'Hardware', value: '2x H200' }],
      score: { label: 'Multilingual Score', value: '93.7%', pct: 93.7 },
      price: 580, badge: 'community', icon: 'globe', gradient: 'from-sky-900/40 via-blue-900/20 to-surface-container'
    },
  ],
  featured: {
    title: 'Mixtral 8x22B Quantized',
    subtitle: '4-bit GGUF · Local Inference Ready',
    badge: 'NEW RELEASE',
    icon: 'bolt',
    description: 'This 4-bit GGUF version is optimized for local inference on consumer GPUs with 24GB+ VRAM.',
    specs: [
      { label: 'Layers', value: '56 Blocks' },
      { label: 'MoE Expert', value: '8 Experts' },
      { label: 'Context', value: '32K Tokens' },
    ],
    price: 2800,
  },
}

export default function Weights() {
  return <CategoryPage config={config} />
}
