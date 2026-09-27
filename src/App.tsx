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
          const header = document.querySelector('header')
          const headerHeight = header ? header.getBoundingClientRect().height : 76
          const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 14
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
        }
      }, 100)
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
    const cleanPath = pathname.replace(/\/+$/, '') || '/'
    const route = cleanPath === '/audit.html' ? '/audit' : cleanPath

    const meta: Record<string, { title: string; desc: string; url: string }> = {
      '/': {
        title: 'KaoinAI — Autonomous Data Governance & Living Compliance',
        desc: 'Autonomous Data Governance & Living Compliance. Connect PostgreSQL, Snowflake & ERPs in minutes — table-bound DPIA, PDPA & MAS TRM compliance, column lineage & MDM.',
        url: 'https://kaoinai.com/',
      },
      '/audit': {
        title: 'Free Data Governance Maturity & Risk Audit — KaoinAI',
        desc: 'Audit your data governance maturity and PDPA compliance risk in minutes. Instant score, prioritized remediation roadmap, and table-bound DPIA guidance — free.',
        url: 'https://kaoinai.com/audit',
      },
      '/contact': {
        title: 'Schedule 1-on-1 with TK Ng | Contact Us — KaoinAI',
        desc: 'Book a 1-on-1 Google Calendar session with KaoinAI. Discuss autonomous data governance, table-bound DPIA, PDPA & MAS TRM compliance for your databases.',
        url: 'https://kaoinai.com/contact',
      },
    }
    const r = meta[route] || meta['/']
    document.title = r.title

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector)
      if (el) {
        el.setAttribute(attr, value)
      } else {
        el = document.createElement('meta')
        const parts = selector.replace('meta[', '').replace(']', '').split('=')
        if (parts.length === 2) {
          el.setAttribute(parts[0], parts[1].replace(/["']/g, ''))
          el.setAttribute(attr, value)
          document.head.appendChild(el)
        }
      }
    }

    setMeta('meta[name="description"]', 'content', r.desc)
    setMeta('meta[name="title"]', 'content', r.title)
    setMeta('meta[property="og:title"]', 'content', r.title)
    setMeta('meta[property="og:description"]', 'content', r.desc)
    setMeta('meta[property="og:url"]', 'content', r.url)
    setMeta('meta[name="twitter:title"]', 'content', r.title)
    setMeta('meta[name="twitter:description"]', 'content', r.desc)
    setMeta('meta[name="twitter:url"]', 'content', r.url)

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = r.url
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
