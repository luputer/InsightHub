export default function IntelligenceProtocol() {
  return (
    <section className="py-xl bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-gutter">
        <h2 className="font-headline-xl text-headline-xl text-on-surface text-center mb-xl">
          The Intelligence Protocol
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
          <div className="order-2 md:order-1 space-y-md">
            <div className="p-lg glass-card rounded-xl">
              <div className="flex items-center gap-md mb-md">
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-headline-md">robot_2</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary-container">
                  Agent x401: Content Gatekeeper
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                Every publication undergoes a rigorous{' '}
                <span className="text-primary">PUBLISH_WORKFLOW</span>. Our
                autonomous agents verify technical accuracy, plagiarism, and
                knowledge density before an entry is minted to the chain.
              </p>
              <ul className="space-y-sm">
                {['Semantic Verification', 'Metadata Enrichment', 'Quality Scoring'].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-sm font-label-sm text-label-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-primary-container text-[18px]">
                        check_circle
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <img
              className="rounded-xl border border-white/5 w-full"
              alt="Robotic eye with glowing cyan aperture"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC84qpIjNJTp_xt9IZs5_fzIIZxw_8lOWQtEUjpWIjoMWKvlQ53vgtKykyw0av1jQ1nXZ1e0I_26rqkC4lyhnCNUse3C8hA4drFRm9wqdvADLVBDKE8f50Xg7ostxZD7xToVC0l98OYWbt9x--1wo4_mcEgUGIdu7TECvEgmS8uB7Cg9mu78zZsbyv3cACxGo5K7zXXCf_Q326_6X0VmiJIMdg8dh488-fykBAJfmFRBiDO0-0vXGkRPHeu9DZ3pvoYkq92mtuiF2c"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center mt-xl">
          <div className="hidden md:block">
            <img
              className="rounded-xl border border-white/5 w-full"
              alt="Holographic financial system visualization"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARrt9wdZeZ041CrHEclWt3KQzZhTL7eyqXvHEuGHel9Qwy5IyLMLbW0BGEcv7scTd52VpWtP-_uH3Auu3bVdoD1pYndUiIgoapZokg29McUKl44jvneMTdrN9HiiEtZ1XUJSWwJVvnWU95PyXoMUCizn0sOEqsseUcA9PDSwXwI5nxUkY2mm2nyD9rINNR9ggQSG1zHe6pF7NC7djuqYEwSjYyuXBJWRIupDWCLlM4ZyF0ZPovr5SWdAhP8b8zYaa4BIg8pgKajtA"
            />
          </div>

          <div className="space-y-md">
            <div className="p-lg glass-card rounded-xl">
              <div className="flex items-center gap-md mb-md">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-headline-md">
                    account_balance_wallet
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-secondary">
                  Agent x402: Financial Controller
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                The{' '}
                <span className="text-secondary">PURCHASE_WORKFLOW</span>{' '}
                handles instant, trustless settlements via Stellar. Smart
                contracts ensure that authors receive payment immediately upon
                successful key decryption.
              </p>
              <ul className="space-y-sm">
                {['Sub-second Finality', 'Escrow Protection', 'Low-fee Transactions'].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-sm font-label-sm text-label-sm text-on-surface"
                    >
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        {item === 'Sub-second Finality' ? 'bolt' : item === 'Escrow Protection' ? 'lock' : 'account_balance'}
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
