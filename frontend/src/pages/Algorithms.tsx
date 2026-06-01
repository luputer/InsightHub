import CategoryPage, { type CategoryConfig } from './CategoryPage'

const config: CategoryConfig = {
  title: 'Algorithms Marketplace',
  subtitle: 'Directory / Algorithms',
  description: 'Discover and license optimized algorithms for blockchain, AI/ML, and cryptographic applications. Each algorithm includes verified benchmarks and reference implementations.',
  icon: 'terminal',
  gradient: 'from-cyan-900/40 via-blue-900/20 to-transparent',
  accentColor: '#22d3ee',
  badgeLabel: 'Benchmarked',
  filters: [
    { label: 'All Categories', options: ['Cryptography', 'ML/AI', 'Consensus', 'Optimization'] },
    { label: 'Language', options: ['Rust', 'Python', 'Solidity', 'C++'] },
  ],
  items: [
    {
      title: 'ZK-SNARK Prover Optimizer', subtitle: 'Rust · 2x faster than Groth16',
      specs: [{ label: 'Complexity', value: 'O(n log n)' }, { label: 'Memory', value: '128 MB' }],
      score: { label: 'Efficiency', value: '98.5%', pct: 98.5 },
      price: 4200, badge: 'ai', icon: 'speed', gradient: 'from-cyan-900/40 via-blue-900/20 to-surface-container'
    },
    {
      title: 'A* Pathfinding on DAGs', subtitle: 'Python · Parallel execution',
      specs: [{ label: 'Nodes/sec', value: '1.2M' }, { label: 'Accuracy', value: '99.97%' }],
      score: { label: 'Performance Score', value: '96.8%', pct: 96.8 },
      price: 800, badge: 'ai', icon: 'route', gradient: 'from-emerald-900/40 via-teal-900/20 to-surface-container'
    },
    {
      title: 'PBFT Consensus Variant', subtitle: 'Rust · 200ms finality',
      specs: [{ label: 'Latency', value: '200 ms' }, { label: 'Throughput', value: '50K TPS' }],
      score: { label: 'Byzantine Tolerance', value: '94.2%', pct: 94.2 },
      price: 3500, badge: 'ai', icon: 'lan', gradient: 'from-violet-900/40 via-purple-900/20 to-surface-container'
    },
    {
      title: 'RL Environment for Trading', subtitle: 'Python/CUDA · 10x speedup',
      specs: [{ label: 'Env Steps/s', value: '2M' }, { label: 'Benchmark', value: 'Atari Suite' }],
      score: { label: 'Training Speedup', value: '92.7%', pct: 92.7 },
      price: 650, badge: 'community', icon: 'psychology', gradient: 'from-rose-900/40 via-pink-900/20 to-surface-container'
    },
    {
      title: 'BLS Signature Aggregation', subtitle: 'Rust · Constant-time',
      specs: [{ label: 'Sig Size', value: '48 bytes' }, { label: 'Aggregation', value: '1M sigs/s' }],
      score: { label: 'Security Level', value: '97.3%', pct: 97.3 },
      price: 2100, badge: 'ai', icon: 'encryption', gradient: 'from-amber-900/40 via-orange-900/20 to-surface-container'
    },
    {
      title: 'Merkle Tree Parallel Builder', subtitle: 'C++ · OpenMP',
      specs: [{ label: 'Build Rate', value: '5M leaves/s' }, { label: 'Proof Size', value: '256 bytes' }],
      score: { label: 'Memory Efficiency', value: '90.1%', pct: 90.1 },
      price: 400, badge: 'community', icon: 'account_tree', gradient: 'from-sky-900/40 via-blue-900/20 to-surface-container'
    },
  ],
  featured: {
    title: 'Quantum-Resistant Signature Scheme',
    subtitle: 'CRYSTALS-Dilithium · NIST Level 3',
    badge: 'AUDITED',
    icon: 'verified',
    description: 'A post-quantum cryptographic signature scheme based on CRYSTALS-Dilithium, optimized for blockchain transaction signing with constant-time verification.',
    specs: [
      { label: 'Security', value: 'NIST Level 3' },
      { label: 'Sig Size', value: '2.4 KB' },
      { label: 'Audit', value: 'Trail of Bits' },
    ],
    price: 12500,
  },
}

export default function Algorithms() {
  return <CategoryPage config={config} />
}
