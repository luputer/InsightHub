import { useState } from 'react'
import Footer from '../components/Footer'
import DashboardHeader from '../components/DashboardHeader'

const settingsTabs = ['Profile', 'Notifications', 'Wallet', 'API Keys']

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [profile, setProfile] = useState({ username: 'crypto_researcher', email: 'researcher@insighthub.io', bio: 'Decentralized AI researcher focused on ZK-proofs and on-chain intelligence.' })
  const [notifications, setNotifications] = useState({ email: true, purchase: true, sale: true, marketing: false })
  const [walletConnected] = useState(true)

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <DashboardHeader />

      <main className="pt-[100px] pb-xl px-gutter max-w-container-max mx-auto">
        <div className="mb-lg">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage your account, notifications, and integrations.
          </p>
        </div>

        <div className="flex gap-sm mb-lg border-b border-white/10 pb-0 overflow-x-auto">
          {settingsTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-md py-3 font-label-md text-label-md transition-all cursor-pointer border-b-2 -mb-[1px] ${
                activeTab === tab
                  ? 'text-primary-container border-primary-container'
                  : 'text-on-surface-variant border-transparent hover:text-on-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Profile' && (
          <div className="glass-card rounded-xl p-md max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Profile Information</h2>
            <div className="flex flex-col gap-md">
              <div>
                <label className="font-body-sm text-body-sm text-on-surface-variant mb-xs block">Username</label>
                <input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
              <div>
                <label className="font-body-sm text-body-sm text-on-surface-variant mb-xs block">Email</label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
              <div>
                <label className="font-body-sm text-body-sm text-on-surface-variant mb-xs block">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-4 py-3 text-body-md text-on-surface focus:outline-none focus:border-primary-container transition-all resize-none"
                />
              </div>
              <div className="flex justify-end">
                <button className="px-md py-2 bg-primary-container text-on-primary font-label-md rounded-lg neon-glow active:scale-95 transition-transform cursor-pointer">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="glass-card rounded-xl p-md max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Notification Preferences</h2>
            <div className="flex flex-col gap-md">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'purchase', label: 'Purchase Confirmations', desc: 'Get notified when you purchase an asset' },
                { key: 'sale', label: 'Sale Alerts', desc: 'Get notified when someone buys your asset' },
                { key: 'marketing', label: 'Marketing & Updates', desc: 'Product updates, tips, and community news' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-sm border-b border-white/5 last:border-0">
                  <div>
                    <div className="font-body-md text-body-md text-on-surface">{item.label}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-primary-container' : 'bg-surface-container-highest'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                      notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Wallet' && (
          <div className="glass-card rounded-xl p-md max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Wallet Settings</h2>
            <div className="flex flex-col gap-md">
              {walletConnected ? (
                <>
                  <div className="bg-surface-container-high rounded-lg p-md flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                      <span className="w-3 h-3 rounded-full bg-green-400" />
                      <div>
                        <div className="font-body-md text-body-md text-on-surface">Stellar Wallet Connected</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          GA6H...8F2K
                        </div>
                      </div>
                    </div>
                    <button className="px-md py-2 border border-red-500/30 text-red-400 rounded-lg font-label-sm text-label-sm hover:bg-red-500/10 transition-colors cursor-pointer">
                      Disconnect
                    </button>
                  </div>
                  <div className="bg-surface-container-high rounded-lg p-md">
                    <div className="font-body-md text-body-md text-on-surface mb-sm">Wallet Balance</div>
                    <div className="font-label-md text-headline-lg text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      8,425 XLM
                    </div>
                    <div className="flex gap-sm mt-md">
                      <button className="px-md py-2 bg-primary-container text-on-primary font-label-md rounded-lg neon-glow active:scale-95 transition-transform cursor-pointer">
                        Deposit
                      </button>
                      <button className="px-md py-2 border border-primary-container/40 text-primary-container rounded-lg font-label-sm text-label-sm hover:bg-primary-container/10 transition-colors cursor-pointer">
                        Withdraw
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <button className="px-md py-3 bg-primary-container text-on-primary font-label-md rounded-lg neon-glow active:scale-95 transition-transform cursor-pointer w-fit">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'API Keys' && (
          <div className="glass-card rounded-xl p-md max-w-2xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">API Keys</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">
              Manage API keys for programmatic access to the InsightHub marketplace.
            </p>
            <div className="flex flex-col gap-md">
              <div className="bg-surface-container-high rounded-lg p-md flex items-center justify-between">
                <div>
                  <div className="font-body-md text-body-md text-on-surface">Production Key</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    ih_prod_••••••••••••8f2k
                  </div>
                </div>
                <div className="flex gap-sm">
                  <button className="px-sm py-2 border border-white/10 text-on-surface-variant rounded-lg font-label-sm text-label-sm hover:text-primary transition-colors cursor-pointer">
                    Copy
                  </button>
                  <button className="px-sm py-2 border border-red-500/30 text-red-400 rounded-lg font-label-sm text-label-sm hover:bg-red-500/10 transition-colors cursor-pointer">
                    Revoke
                  </button>
                </div>
              </div>
              <div className="bg-surface-container-high rounded-lg p-md flex items-center justify-between opacity-60">
                <div>
                  <div className="font-body-md text-body-md text-on-surface">Testnet Key</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    ih_test_••••••••••••3a7b
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Expired</span>
              </div>
              <button className="px-md py-2 border border-primary-container/40 text-primary-container rounded-lg font-label-md text-label-md hover:bg-primary-container/10 transition-colors cursor-pointer w-fit">
                + Generate New Key
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
