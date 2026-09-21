import { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Database, 
  Brain, 
  CheckCircle2, 
  Terminal,
  Lock,
  Layers,
  Activity,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

interface HeroMessage {
  id: string
  tabLabel: string
  badgeCategory: string
  badgeSecondary: string
  badgeSecondaryHighlight: string
  headingMain: string
  headingGradient: string
  description: string
  trustBadges: { icon: any; label: string }[]
  telemetry: {
    systemTag: string
    statusBadge: string
    healthTitle: string
    healthScore: string
    healthBarGradient: string
    healthDesc: string
    stat1Title: string
    stat1Value: string
    stat1Status: string
    stat2Title: string
    stat2Value: string
    stat2Status: string
    alertTitle: string
    alertLatency: string
    alertCode: string
    alertMessage: string
  }
}

const heroMessages: HeroMessage[] = [
  {
    id: 'ai-governance',
    tabLabel: 'Data Governance for AI',
    badgeCategory: 'Autonomous Data Governance for Enterprise AI',
    badgeSecondary: 'Zero LLM Hallucinations',
    badgeSecondaryHighlight: '• Dynamic Prompt Masking',
    headingMain: 'Autonomous Data Governance',
    headingGradient: 'For Safe, Trustworthy AI',
    description: 'AI is only as reliable as the data feeding it. Connect PostgreSQL, Snowflake, RDS, and ERPs in minutes. Eliminate LLM hallucinations, sanitize PII before prompt ingestion, and automate schema-bound lineage with zero multi-month consulting overhead.',
    trustBadges: [
      { icon: Brain, label: 'AI Governance & Hallucination Guard' },
      { icon: Lock, label: 'Dynamic Pre-Prompt PII Tokenization' },
      { icon: Database, label: 'Zero SQL Required for AI Queries' }
    ],
    telemetry: {
      systemTag: 'kaoinai-telemetry // ai_guard_sg',
      statusBadge: 'AI GUARD LIVE',
      healthTitle: 'AI Semantic Accuracy & Context Health',
      healthScore: '99.8%',
      healthBarGradient: 'from-purple-500 via-indigo-500 to-emerald-400',
      healthDesc: '32 deterministic semantic boundaries enforced across vector & SQL query layers',
      stat1Title: 'Pre-Prompt PII Redaction',
      stat1Value: '100% Intercepted',
      stat1Status: 'Zero Raw Data to LLM',
      stat2Title: 'Context Drift Shield',
      stat2Value: '< 18ms Latency',
      stat2Status: 'Real-time validation',
      alertTitle: 'AI Prompt Ingestion Shield Active',
      alertLatency: '14ms',
      alertCode: 'customer_support_rag',
      alertMessage: 'Detected NRIC & cardholder data in incoming RAG context: Auto-masked via SHA-256 tokenization before OpenAI/Anthropic API payload dispatch.'
    }
  },
  {
    id: 'pii-compliance',
    tabLabel: 'Table-Bound PII & DPIA',
    badgeCategory: 'Living Compliance & Privacy Engineering',
    badgeSecondary: 'Singapore PDPA & MAS TRM',
    badgeSecondaryHighlight: '• Live Schema Binding',
    headingMain: 'Table-Bound DPIA & RoPA',
    headingGradient: 'Directly Anchored to Physical Schemas',
    description: 'Stop managing statutory compliance in static spreadsheets that drift out of date. KaoinAI binds Data Protection Impact Assessments (DPIA) and Living RoPA inventories directly to your physical database tables and columns containing PII.',
    trustBadges: [
      { icon: Shield, label: 'Table-Bound DPIA & Living RoPA' },
      { icon: Lock, label: 'Automated PII Discovery & Drift Alerts' },
      { icon: Activity, label: 'Audit-Ready PDPA & MAS TRM Reports' }
    ],
    telemetry: {
      systemTag: 'kaoinai-telemetry // dpia_prod_sg',
      statusBadge: 'COMPLIANCE ACTIVE',
      healthTitle: 'Living RoPA & DPIA Schema Coverage',
      healthScore: '100%',
      healthBarGradient: 'from-emerald-500 via-teal-500 to-indigo-500',
      healthDesc: '14 physical production tables containing PII bound directly to active DPIA-2026-08',
      stat1Title: 'Table-Bound DPIA & PII',
      stat1Value: '14 Tables',
      stat1Status: '100% Schema Linked',
      stat2Title: 'Living RoPA Inventory',
      stat2Value: 'PDPA & GDPR',
      stat2Status: 'Zero spreadsheets',
      alertTitle: 'Schema Migration & Drift Auto-Binding',
      alertLatency: '18ms',
      alertCode: 'users_v2',
      alertMessage: 'Detected migration on users_v2: Auto-classified NRIC & Phone, bound to statutory DPIA-2026-08, applied dynamic column masking rule.'
    }
  },
  {
    id: 'core-dg',
    tabLabel: 'Enterprise Data Governance',
    badgeCategory: 'Full-Stack Autonomous Metadata',
    badgeSecondary: 'End-to-End Column Lineage',
    badgeSecondaryHighlight: '• Sub-Second Cataloging',
    headingMain: 'Autonomous Data Governance',
    headingGradient: 'Across Your Complete Stack',
    description: 'Replace fragmented point solutions and million-dollar consulting retainers with unified metadata intelligence. Automated schema discovery, column-level lineage tracking, and continuous data quality monitoring across multi-cloud and on-prem databases.',
    trustBadges: [
      { icon: Database, label: 'ERP, Warehouse & Cloud Agnostic' },
      { icon: Layers, label: 'End-to-End Column-Level Lineage' },
      { icon: Activity, label: 'First Health Scan in Under 1 Day' }
    ],
    telemetry: {
      systemTag: 'kaoinai-telemetry // metadata_mesh',
      statusBadge: 'METADATA SYNCED',
      healthTitle: 'Automated Data Quality Health',
      healthScore: '99.4%',
      healthBarGradient: 'from-indigo-500 via-purple-500 to-emerald-400',
      healthDesc: '24 validation rules continuously enforced across PostgreSQL & Snowflake',
      stat1Title: 'Lineage Graph Density',
      stat1Value: '184 Nodes',
      stat1Status: 'Column-to-Dashboard',
      stat2Title: 'Schema Drift Detection',
      stat2Value: '0 Breaking Drifts',
      stat2Status: '24/7 CI/CD verified',
      alertTitle: 'Automated Upstream Lineage Traversal',
      alertLatency: '24ms',
      alertCode: 'orders_fact_v3',
      alertMessage: 'Traced revenue metric discrepancy upstream across 4 ETL steps directly to unannounced column rename in NetSuite staging table.'
    }
  },
  {
    id: 'mdm-quality',
    tabLabel: 'Master Data & Quality',
    badgeCategory: 'Golden Customer Records & MDM',
    badgeSecondary: 'Deterministic Deduplication',
    badgeSecondaryHighlight: '• Zero Brittle ETL',
    headingMain: 'Unified Master Data Quality',
    headingGradient: 'Single Source of Truth',
    description: 'Eliminate duplicate customer identities and conflicting records isolated across disparate ERPs, CRMs, and SQL tables. KaoinAI resolves entity collisions deterministically to synthesize golden customer profiles without fragile manual pipelines.',
    trustBadges: [
      { icon: Database, label: 'Unified Golden Customer Records' },
      { icon: Shield, label: 'Real-Time Cross-System Deduplication' },
      { icon: Brain, label: 'Multi-System Entity Resolution' }
    ],
    telemetry: {
      systemTag: 'kaoinai-telemetry // mdm_cluster',
      statusBadge: 'MDM SYNTHESIS ACTIVE',
      healthTitle: 'Cross-System Customer Match Confidence',
      healthScore: '99.7%',
      healthBarGradient: 'from-amber-500 via-purple-500 to-indigo-600',
      healthDesc: 'Unified 48,200 records across Salesforce, HubSpot, and PostgreSQL without custom ETL',
      stat1Title: 'Duplicate Records Purged',
      stat1Value: '3,842 Deduplicated',
      stat1Status: 'Preserved ID History',
      stat2Title: 'Golden Record Match',
      stat2Value: 'Deterministic',
      stat2Status: 'Probabilistic + Rule-bound',
      alertTitle: 'Cross-Platform Entity Collision Resolved',
      alertLatency: '31ms',
      alertCode: 'customer_entity_link',
      alertMessage: 'Linked Salesforce Account "Acme APAC Pte" to PostgreSQL Billing ID 88391: Resolved billing tax ID variance & synthesized golden record.'
    }
  }
]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [animating, setAnimating] = useState(false)

  // Auto-alternate every 7 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % heroMessages.length)
        setAnimating(false)
      }, 200)
    }, 7000)

    return () => clearInterval(interval)
  }, [isPaused])

  const handleSelectMessage = (index: number) => {
    if (index === activeIndex) return
    setAnimating(true)
    setTimeout(() => {
      setActiveIndex(index)
      setAnimating(false)
    }, 150)
    trackEvent('select_hero_tab', { tab: heroMessages[index].id, label: heroMessages[index].tabLabel })
  }

  const current = heroMessages[activeIndex]

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/40 to-red-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:py-32 lg:py-36">
        {/* Interactive Alternating Category Tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center lg:justify-start gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline-block">
            Key Pillars:
          </span>
          {heroMessages.map((msg, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={msg.id}
                onClick={() => handleSelectMessage(idx)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102 border border-slate-700'
                    : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-400 animate-pulse' : 'bg-slate-300'}`} />
                {msg.tabLabel}
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column: Alternating Hero Copy */}
          <div className={`space-y-6 sm:space-y-8 text-center lg:text-left transition-opacity duration-200 ${animating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50/90 border border-purple-200/70 text-[#5b2d6e] text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles size={14} className="text-[#7c3aed]" />
                <span>{current.badgeCategory}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-300">{current.badgeSecondary}</span>
                <span className="text-purple-300 font-semibold">{current.badgeSecondaryHighlight}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-950 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center">
              <span>{current.headingMain}</span>
              <span className="text-gradient">{current.headingGradient}</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal min-h-[80px]">
              {current.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-slate-950 text-white hover:bg-slate-800 transition-colors px-7 py-6 text-sm sm:text-base font-semibold group rounded-xl shadow-lg"
                onClick={() => {
                  trackEvent('click_cta', { location: 'hero', label: `Deploy 14-Day Pilot (${current.id})` })
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Deploy 14-Day Pilot
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-slate-200 text-slate-800 hover:bg-slate-50 px-7 py-6 text-sm sm:text-base font-semibold rounded-xl"
                onClick={() => {
                  trackEvent('click_cta', { location: 'hero', label: 'Hero Launch Interactive Demo' })
                  const el = document.getElementById('demo')
                  if (el) {
                    const yOffset = -76
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
                    window.scrollTo({ top: y, behavior: 'smooth' })
                  }
                }}
              >
                <Terminal size={17} className="mr-2 text-purple-600" />
                Launch Interactive Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs sm:text-sm text-gray-500">
              {current.trustBadges.map((badge, bIdx) => {
                const BadgeIcon = badge.icon
                return (
                  <div key={bIdx} className="flex items-center gap-1.5">
                    <BadgeIcon size={16} className="text-[#5b2d6e] shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Synchronized Obsidian Live Telemetry Console */}
          <div className="relative">
            <div className="relative bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800/90 p-5 sm:p-7 overflow-hidden backdrop-blur-xl">
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Console Window Header */}
                <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-slate-400">{current.telemetry.systemTag}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {current.telemetry.statusBadge}
                  </div>
                </div>

                <div className={`space-y-3.5 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                  {/* Automated Quality Score */}
                  <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300">{current.telemetry.healthTitle}</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{current.telemetry.healthScore}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`bg-gradient-to-r ${current.telemetry.healthBarGradient} h-full rounded-full transition-all duration-700`} style={{ width: current.telemetry.healthScore }} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> 
                      <span>{current.telemetry.healthDesc}</span>
                    </p>
                  </div>

                  {/* 2-column Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1">{current.telemetry.stat1Title}</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white truncate">{current.telemetry.stat1Value}</div>
                      <div className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1 truncate">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {current.telemetry.stat1Status}
                      </div>
                    </div>
                    <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1">{current.telemetry.stat2Title}</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-purple-300 truncate">{current.telemetry.stat2Value}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                        <span className="w-1 h-1 rounded-full bg-purple-400" />
                        {current.telemetry.stat2Status}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Alert Box */}
                  <div className="bg-purple-950/30 rounded-2xl p-4 border border-purple-800/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-300" />
                        <span className="text-xs font-bold text-purple-200">{current.telemetry.alertTitle}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{current.telemetry.alertLatency}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {current.telemetry.alertMessage}
                    </p>
                  </div>

                  {/* Telemetry Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Continuous Schema Sync Active
                    </span>
                    <button 
                      onClick={() => handleSelectMessage((activeIndex + 1) % heroMessages.length)}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[10px] transition-colors cursor-pointer"
                    >
                      <span>Next telemetry stream</span>
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Static Bottom Trust Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <Shield size={13} className="text-slate-900" />
                <span>Zero Raw Data Retention</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                <Brain size={13} className="text-slate-900" />
                <span>Air-Gapped &amp; Sovereign Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

