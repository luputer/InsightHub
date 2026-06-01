const insights = [
  {
    title: 'Soroban Smart Contracts',
    description: 'Deep dive into the Rust-based smart contract platform on Stellar. Optimization tips and security patterns...',
    price: '12 XLM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDPzZkPyfUzIvPs2iSyBPfP7LjNzhXWdsYfGjGJhN75qjBHnBXAvHTUDqDEEGaSaDMbhPMwL1e8_vOuCQonc1sgOOXU2Ol22GOAxa6JWI-tVV1PU5h2bqGSkqhSbqfmbcFdgcLte24guaw_pA6yZTYIyj5a5_gYK9lTVZfA8mF9NdI_meScGG6QmXGnyXUgi1gMe3EBS9H0jtF7v6MWm2oslFkJKZ2wE7pLEkNlkcjFCu_AmTY0pQOP97BWRz3mgRQVTC_kuSw3u8',
  },
  {
    title: 'AI Ethics & Alignment',
    description: 'Frameworks for building responsible LLMs and navigating the decentralized intelligence landscape safely...',
    price: '8 XLM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDFZh6l20bRAPOCV2J4rn9uOzX2W8bZd5AXHNTr9WNHulE-eXy1yw0LQEyCCffsPgs2e9Gg3rWZ68xhBcaORdtuHNlBOTn2dLuZEJztgp3a8o5F9qWCtDPvX7u1isnqPPsEGNBBfGWBCbFkQ_9D7q8EGkO2r55FiHgJ-e4DWWHioSmZY9caBNDhSj_ziLHyXIdAd-foc6DZpMxgPLLCaIYLIRD-6HwRfcOACnjCJy3rM2w_vxnfngFRJA52M12_9gOSraY943lvZk',
  },
  {
    title: 'DeFi Yield Strategies',
    description: 'Advanced liquidity providing strategies across multi-chain ecosystems for maximum risk-adjusted returns...',
    price: '25 XLM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnlgKyPVgMgOx22LVvAU0WW6nao17MxIgVTkr_KI8kI80p8vy9ckSWyPTmvZVw5mqVqBeuDGuYrJII7uUoIJpTW37dKN12opFlIpGPho84oucMTbYfNIf6rKa3hXHFHW-aCPjUZ05ZANkmhcqwYG1PrOaRowBkfOq75i2HW6KceiAwmIoKQPt-XDwpQj8-ZMpwmnceaEOllWY9aYdlcF2oyreY-OTcBqOc1zCll5XPYkuGL6sm00HgRYA1LdxCkOm387Mkvn-arNs',
  },
]

export default function TrendingInsights() {
  return (
    <section className="py-xl max-w-container-max mx-auto px-gutter">
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">
            Trending Insights
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Hand-picked high-quality knowledge assets.
          </p>
        </div>
        <a
          href="#"
          className="font-label-md text-label-md text-primary-container hover:underline hidden md:block"
        >
          View all assets
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {insights.map((item) => (
          <div key={item.title} className="glass-card rounded-xl overflow-hidden group">
            <div className="h-40 bg-surface-container overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={item.title}
                src={item.image}
              />
            </div>
            <div className="p-md">
              <div className="flex justify-between items-start mb-sm">
                <span className="px-sm py-1 bg-secondary-container/30 text-secondary text-label-sm rounded-full flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  AI-Vetted
                </span>
                <span className="font-label-md text-label-md text-primary-container">
                  {item.price}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
                {item.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md line-clamp-2">
                {item.description}
              </p>
              <button className="w-full py-2 bg-surface-container-highest text-primary font-label-md rounded hover:bg-primary-container/20 transition-colors cursor-pointer">
                Purchase Access
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
