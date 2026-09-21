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
import AnimatedBackground from './components/AnimatedBackground'

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

function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const route = (pathname === '/audit.html') ? '/audit' : pathname
    const meta: Record<string, { title: string; desc: string }> = {
      '/': {
        title: 'KaoinAI — Autonomous Data Governance & Living Compliance',
        desc: 'Autonomous Data Governance & Living Compliance. Connect PostgreSQL, Snowflake & ERPs in minutes — table-bound DPIA, PDPA & MAS TRM compliance, column lineage & MDM.',
      },
      '/audit': {
        title: 'Free Data Governance Maturity & Risk Audit — KaoinAI',
        desc: 'Audit your data governance maturity and PDPA compliance risk in minutes. Instant score, prioritized remediation roadmap, and table-bound DPIA guidance — free.',
      },
      '/contact': {
        title: 'Schedule 1-on-1 with TK Ng | Contact Us — KaoinAI',
        desc: 'Book a 1-on-1 Google Calendar session with KaoinAI. Discuss autonomous data governance, table-bound DPIA, PDPA & MAS TRM compliance for your databases.',
      },
    }
    const r = meta[route] || meta['/']
    document.title = r.title
    const md = document.querySelector('meta[name="description"]')
    if (md) md.setAttribute('content', r.desc)
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = 'https://kaoinai.com' + (route === '/' ? '/' : route)
  }, [pathname])

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
    <div className="min-h-screen bg-gradient-to-b from-[#fcfbfe] via-[#f8f3fe]/80 to-[#fcfbfe] selection:bg-purple-100 selection:text-[#5b2d6e] flex flex-col justify-between overflow-x-hidden relative">
      <AnimatedBackground />
      <ScrollToHash />
      <RouteSeo />
      <Navigation />
      <div className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/audit.html" element={<AuditPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
      <WhatsAppButton />
    </div>
  )
}

export default App
