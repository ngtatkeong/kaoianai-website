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
  Activity
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
    tabLabel: 'Living Data Inventory (RoPA)',
    badgeCategory: 'Living Data Inventory & Privacy Engineering',
    badgeSecondary: 'Singapore PDPA • Malaysia PDPA • Indonesia UU PDP',
    badgeSecondaryHighlight: '• Real-Time Schema Binding',
    headingMain: 'Living Data Inventory (RoPA)',
    headingGradient: 'Directly Anchored to Physical Schemas (SG, MY, ID)',
    description: 'Stop managing statutory compliance in static spreadsheets that drift out of date. KaoinAI binds Living Data Inventories and DPIAs directly to your physical database tables and columns containing PII—natively mapped to Singapore PDPA (RoPA), Malaysia PDPA (Daftar Pemprosesan), and Indonesia UU PDP (Inventaris Data Pribadi).',
    trustBadges: [
      { icon: Shield, label: 'Living Data Inventory (RoPA)' },
      { icon: Lock, label: 'SG PDPA, MY PDPA & ID UU PDP Mapped' },
      { icon: Activity, label: '1-Click Audit-Ready Statutory Exports' }
    ],
    telemetry: {
      systemTag: 'kaoinai-telemetry // data_inventory_mesh',
      statusBadge: 'DATA INVENTORY SYNCED',
      healthTitle: 'Living Data Inventory & Schema Coverage',
      healthScore: '100%',
      healthBarGradient: 'from-emerald-500 via-teal-500 to-indigo-500',
      healthDesc: '14 physical production tables containing PII bound directly to active Data Inventory',
      stat1Title: 'Table-Bound DPIA & PII',
      stat1Value: '14 Tables',
      stat1Status: '100% Schema Linked',
      stat2Title: 'Regional Data Inventories',
      stat2Value: 'SG, MY, ID & EU',
      stat2Status: 'Multi-jurisdiction',
      alertTitle: 'Schema Migration & Drift Auto-Binding',
      alertLatency: '18ms',
      alertCode: 'users_v2',
      alertMessage: 'Detected migration on users_v2: Auto-classified NRIC & Phone, bound to statutory Data Inventory, generated localized SG/MY/ID audit registers.'
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

  // Auto-cycle continuously every 6 seconds smoothly across all 4 pillars
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % heroMessages.length)
        setAnimating(false)
      }, 250)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused])

  const current = heroMessages[activeIndex]

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden bg-transparent"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient animated background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-purple-300/25 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-r from-purple-200/30 via-indigo-100/20 to-teal-100/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Alternating Hero Copy */}
          <div className={`min-w-0 space-y-6 sm:space-y-7 text-center lg:text-left transition-opacity duration-200 ${animating ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
            {/* Architectural Badges + Clean Live Pillar Indicator */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50/90 border border-purple-200/70 text-[#5b2d6e] text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles size={14} className="text-[#7c3aed]" />
                <span>{current.badgeCategory}</span>
              </div>
              <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xs max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-300">{current.badgeSecondary}</span>
                <span className="text-purple-300 font-semibold">{current.badgeSecondaryHighlight}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                <span>Pillar {activeIndex + 1}/{heroMessages.length}</span>
              </div>
            </div>

            <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-slate-950 flex flex-col justify-center break-words">
              <span>{current.headingMain}</span>
              <span className="text-gradient mt-1">{current.headingGradient}</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {current.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-1">
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

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-3 text-xs sm:text-sm text-gray-500">
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

          {/* Right Column: Synchronized Luminous Telemetry Console */}
          <div className="relative min-w-0">
            <div className="relative bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#0b0816]/95 text-white rounded-3xl shadow-2xl shadow-purple-950/30 border border-purple-500/20 p-5 sm:p-7 overflow-hidden backdrop-blur-2xl">
              {/* Dynamic ambient color glows */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-500/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Console Window Header */}
                <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 font-mono text-[11px] text-slate-300/80">{current.telemetry.systemTag}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {current.telemetry.statusBadge}
                  </div>
                </div>

                <div className={`space-y-3.5 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                  {/* Automated Quality Score */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-200">{current.telemetry.healthTitle}</span>
                      <span className="text-xl font-bold font-mono text-emerald-300">{current.telemetry.healthScore}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div className={`bg-gradient-to-r ${current.telemetry.healthBarGradient} h-full rounded-full transition-all duration-700`} style={{ width: current.telemetry.healthScore }} />
                    </div>
                    <p className="text-[11px] text-slate-300/80 mt-2 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> 
                      <span>{current.telemetry.healthDesc}</span>
                    </p>
                  </div>

                  {/* 2-column Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
                      <div className="text-[11px] text-slate-400 mb-1">{current.telemetry.stat1Title}</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white truncate">{current.telemetry.stat1Value}</div>
                      <div className="text-[10px] text-emerald-300 font-medium mt-1 flex items-center gap-1 truncate">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {current.telemetry.stat1Status}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
                      <div className="text-[11px] text-slate-400 mb-1">{current.telemetry.stat2Title}</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-purple-200 truncate">{current.telemetry.stat2Value}</div>
                      <div className="text-[10px] text-purple-300/90 mt-1 flex items-center gap-1 truncate">
                        <span className="w-1 h-1 rounded-full bg-purple-400" />
                        {current.telemetry.stat2Status}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Alert Box */}
                  <div className="bg-purple-900/20 rounded-2xl p-4 border border-purple-500/30 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-300" />
                        <span className="text-xs font-bold text-purple-200">{current.telemetry.alertTitle}</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-300/70">{current.telemetry.alertLatency}</span>
                    </div>
                    <p className="text-xs text-slate-200/90 leading-relaxed font-mono">
                      {current.telemetry.alertMessage}
                    </p>
                  </div>

                  {/* Telemetry Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10 font-mono">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Continuous Schema Sync Active
                    </span>
                    <span className="text-purple-300/80 text-[10px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                      Auto-cycling telemetry streams
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Static Bottom Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
                <Shield size={14} className="text-[#5b2d6e]" />
                <span>Zero Raw Data Retention</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/80 border border-slate-200/80 text-slate-700 shadow-2xs">
                <Brain size={14} className="text-[#5b2d6e]" />
                <span>Air-Gapped &amp; Sovereign Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

