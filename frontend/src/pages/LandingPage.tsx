import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import TrendingInsights from '../components/TrendingInsights'
import IntelligenceProtocol from '../components/IntelligenceProtocol'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function LandingPage() {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      el.style.backgroundImage = `
        radial-gradient(at ${x}% ${y}%, rgba(0, 240, 255, 0.08) 0px, transparent 40%),
        radial-gradient(at 0% 0%, rgba(87, 27, 193, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(0, 240, 255, 0.1) 0px, transparent 50%)
      `
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="mesh-gradient min-h-screen" ref={mainRef}>
      <Header />
      <main className="pt-[100px]">
        <HeroSection />
        <StatsSection />
        <TrendingInsights />
        <IntelligenceProtocol />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
