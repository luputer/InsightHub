export default function HeroSection() {
  return (
    <section className="relative px-gutter py-xl max-w-container-max mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
      <div className="z-10">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-md">
          Decentralized Intelligence for the{' '}
          <span className="text-primary-container">Web3 Era</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-[576px]">
          The premier marketplace for AI-vetted knowledge. Publish insights or
          purchase expert notes using Stellar's high-speed network.
        </p>
        <div className="flex flex-col sm:flex-row gap-md">
          <button className="px-lg py-4 bg-primary-container text-on-primary-container font-headline-md rounded-lg neon-glow active:scale-95 transition-transform flex items-center justify-center gap-sm cursor-pointer">
            Explore Marketplace
            <span className="material-symbols-outlined">explore</span>
          </button>
          <button className="px-lg py-4 border border-primary-container text-primary-container font-headline-md rounded-lg hover:bg-primary-container/10 transition-all active:scale-95 flex items-center justify-center gap-sm cursor-pointer">
            Start Publishing
            <span className="material-symbols-outlined">publish</span>
          </button>
        </div>
      </div>

      <div className="relative hidden md:block">
        <div className="absolute -inset-4 bg-secondary-container/20 blur-3xl rounded-full" />
        <img
          className="relative rounded-xl border border-white/10 shadow-2xl w-full"
          alt="Neural network interacting with blockchain ledger"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3SIoeFyWudJ2EKLf6jyMfzjSlC9mRj_p9ZGgkx8ZIBwx-5x-Ql9UDKhYpzinZMT8_5TfW-lszsXmuoSyI3_QgYS7Trld3ng6jqOdQ071ip4WZdaBWMOeBpEDmUUp5b_pTDUiBL31P3P1iEcBvfOMj2WY1EL_VvfY-ePnZJD22mSbdnj7cvwYRi2lgXydteZNiyi0QBco5sJwidZQ_Ek-8Rnuubt4gAxzWDw_1-BIQ6GDkAsNkqdoEL1fXiqcU6impV6S1Tnr8xxo"
        />
      </div>
    </section>
  )
}
