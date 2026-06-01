export default function CTASection() {
  return (
    <section className="py-xl text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-container/5 blur-[120px] rounded-full scale-150 pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto px-gutter">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-md">
          Ready to monetize your knowledge?
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
          Join thousands of experts who are already sharing decentralized
          intelligence and earning XLM.
        </p>
        <button className="px-xl py-4 bg-primary-container text-on-primary-container font-headline-md rounded-lg neon-glow active:scale-95 transition-transform cursor-pointer">
          Get Started
        </button>
      </div>
    </section>
  )
}
