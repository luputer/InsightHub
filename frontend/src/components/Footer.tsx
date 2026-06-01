interface FooterProps {
  variant?: 'default' | 'marketplace'
}

export default function Footer({ variant = 'default' }: FooterProps) {
  if (variant === 'marketplace') {
    return (
      <footer className="w-full py-xl border-t border-white/5 bg-surface-container-lowest mt-20">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-lg">
          <div className="flex flex-col gap-4">
            <div className="font-label-md text-label-md font-bold text-primary-container">InsightHub Protocol</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Empowering the future of decentralized intelligence through secure, transparent, and high-performance knowledge markets.
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">&copy; 2024 InsightHub Protocol. Secured by Stellar.</p>
          </div>
          <div className="flex flex-wrap md:justify-end gap-x-lg gap-y-md">
            {['Terms', 'Privacy', 'Support', 'Github'].map((link) => (
              <a key={link} href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="w-full py-xl border-t border-outline-variant bg-surface-container-lowest">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter gap-md max-w-container-max mx-auto">
        <div className="flex flex-col items-center md:items-start">
          <div className="text-headline-md font-bold text-primary mb-xs">
            InsightHub
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            &copy; 2024 InsightHub. Decentralized Intelligence for the Web3 Era.
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-md">
          {['Terms of Service', 'Privacy Policy', 'Documentation', 'Community'].map((link) => (
            <a
              key={link}
              href="#"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-container underline transition-all"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
