export default function StatsSection() {
  const stats = [
    { value: '10k+', label: 'Notes Published', color: 'border-l-primary-container text-primary-container' },
    { value: '50k+', label: 'XLM Distributed', color: 'border-l-secondary text-secondary' },
    { value: '100%', label: 'On-chain Transparency', color: 'border-l-tertiary-fixed-dim text-tertiary-fixed-dim' },
  ]

  return (
    <section className="bg-surface-container-low/50 py-lg">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-md">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`glass-card p-lg rounded-xl text-center border-l-4 ${stat.color}`}
          >
            <div className="font-headline-xl text-headline-xl mb-xs">
              {stat.value}
            </div>
            <div className="font-label-md text-label-md text-on-surface-variant">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
