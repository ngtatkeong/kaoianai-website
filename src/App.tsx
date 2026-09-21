import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import Integrations from './sections/Integrations'
import InteractiveDemo from './sections/InteractiveDemo'
import ProblemSolution from './sections/ProblemSolution'
import Features from './sections/Features'
import SecurityTrust from './sections/SecurityTrust'
import CaseStudies from './sections/CaseStudies'
import Comparison from './sections/Comparison'
import HowItWorks from './sections/HowItWorks'
import RoiCalculator from './sections/RoiCalculator'
import MaturityRiskAudit from './sections/MaturityRiskAudit'
import Pricing from './sections/Pricing'
import KnowledgeCenter from './sections/KnowledgeCenter'
import FAQ from './sections/FAQ'
import CTA from './sections/CTA'
import Footer from './sections/Footer'
import Contact from './pages/Contact'
import AuditPage from './pages/Audit'
import WhatsAppButton from './components/WhatsAppButton'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          const yOffset = -76
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 120)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return null
}

function Home() {
  return (
    <main>
      <Hero />
      <Integrations />
      <InteractiveDemo />
      <ProblemSolution />
      <Features />
      <SecurityTrust />
      <CaseStudies />
      <Comparison />
      <HowItWorks />
      <MaturityRiskAudit />
      <RoiCalculator />
      <Pricing />
      <KnowledgeCenter />
      <FAQ />
      <CTA />
    </main>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-white selection:bg-purple-100 selection:text-[#5b2d6e] flex flex-col justify-between overflow-x-hidden">
      <ScrollToHash />
      <Navigation />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/audit.html" element={<AuditPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
