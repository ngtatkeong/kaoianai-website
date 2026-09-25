import { useState } from 'react'
import { 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Wrench, 
  Cloud, 
  Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface PricingPlan {
  name: string
  badge: string
  cloudMonthly: number
  cloudAnnual: number
  cloudSetup: number
  onpremMonthly: number
  onpremAnnual: number
  onpremSetup: number
  descriptionCloud: string
  descriptionOnPrem: string
  highlight: boolean
  featuresCloud: string[]
  featuresOnPrem: string[]
  cta: string
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    badge: 'Essential Governance',
    cloudMonthly: 590,
    cloudAnnual: 490,
    cloudSetup: 990,
    onpremMonthly: 390,
    onpremAnnual: 320,
    onpremSetup: 990,
    descriptionCloud: 'Includes KaoinAI-managed AWS Singapore cluster, automated updates, daily backups, and bundled query compute.',
    descriptionOnPrem: 'Leaner software license for Docker in your private AWS/GCP VPC or local server. Customer provides compute.',
    highlight: false,
    featuresCloud: [
      'Up to 3 Connected Data Sources (Postgres, Snowflake, RDS)',
      'Automated PII Scanning & Dynamic SHA-256 Masking',
      'Continuous Schema Drift & Anomaly Alerts',
      'Natural Language Queries to SQL (1,500 queries/mo)',
      'Daily Automated Health Reports via Email',
      'Assisted 30-Min Connection Verification',
      'Standard Technical Support'
    ],
    featuresOnPrem: [
      'Single-Node Docker Deployment in Customer VPC',
      'Zero External Data Transmission (Air-gapped ready)',
      'Up to 3 Local Databases / Warehouses Indexed',
      'Automated PII Scanning & Local Dynamic Masking',
      'Local Metadata Storage (Stays 100% within your network)',
      'Assisted VPC Peering & Docker Compose Kickoff',
      'Standard Technical Support'
    ],
    cta: 'Claim $0 Slot (Starter)'
  },
  {
    name: 'Growth',
    badge: 'Enterprise Standard • Most Selected',
    cloudMonthly: 1290,
    cloudAnnual: 990,
    cloudSetup: 1990,
    onpremMonthly: 890,
    onpremAnnual: 690,
    onpremSetup: 1990,
    descriptionCloud: 'Complete autonomous catalog, column lineage, and MDM with full KaoinAI-managed AWS hosting and LLM compute included.',
    descriptionOnPrem: 'High-security Kubernetes / VPC cluster for regulated fintech, health, and commerce. Customer provides compute.',
    highlight: true,
    featuresCloud: [
      'Up to 10 Connected Data Sources (DBs, CRMs, ERPs, APIs)',
      'Table-Bound DPIA & Living Data Inventory (RoPA)',
      'Real-Time Column-Level Data Lineage Graph',
      'Golden Record MDM Engine (Shopify, CRM, Zendesk)',
      'Autonomous dbt Model Synthesis with AI',
      'Singapore PDPA, MAS TRM & GDPR Statutory Reports',
      'Unlimited Natural Language Business Queries',
      'White-Glove Architecture Onboarding Included',
      'Dedicated Slack Connect & WhatsApp Direct Channel'
    ],
    featuresOnPrem: [
      'Multi-Container Kubernetes Helm Deployment in Customer VPC',
      'Strict Zero-Egress Architecture (Air-gapped compliance)',
      'Air-Gapped Table-Bound DPIA & Data Inventory Storage',
      'Up to 10 Internal Data Sources Indexed',
      'Local Column Lineage Engine & Autonomous Metadata Graph',
      'On-Premise Golden Record MDM Deduplication Engine',
      'Custom Singapore PDPA & MAS TRM Compliance Reports',
      'White-Glove On-Premise Installation & Hardening Call',
      'Dedicated Slack Connect & WhatsApp Senior Architect'
    ],
    cta: 'Claim $0 Slot (Growth)'
  },
  {
    name: 'Enterprise',
    badge: 'Custom Scale & Air-Gapped',
    cloudMonthly: 3490,
    cloudAnnual: 2790,
    cloudSetup: 3990,
    onpremMonthly: 2490,
    onpremAnnual: 1990,
    onpremSetup: 3990,
    descriptionCloud: 'Dedicated isolated cloud cluster with custom RBAC, private VPC peering, 99.9% SLA, and all hosting compute included.',
    descriptionOnPrem: 'Full air-gapped sovereign deployment inside your private VPC/HSM. Zero data egress, customer provides hardware.',
    highlight: false,
    featuresCloud: [
      'Unlimited Connected Data Sources & Warehouses',
      'Dedicated Isolated Cloud Cluster (Singapore Region)',
      'Multi-Database DPIA Drift Auditing & Custom RoPA Exports',
      'Custom Role-Based Access Controls (RBAC) & Okta SSO',
      'Custom DPA, Security Audit & Penetration Test Review',
      '99.9% Uptime SLA Guarantee',
      'Dedicated Named AI Systems Architect'
    ],
    featuresOnPrem: [
      'Unlimited Data Sources Across Multi-Cloud / Bare Metal',
      'Air-Gapped Multi-Node HA Kubernetes Cluster',
      'Full Sovereign DPIA Registry & Air-Gapped Table Lineage',
      'Hardware Security Module (HSM) / Custom KMS Key Support',
      'Zero-Trust Network Access (ZTNA) & Okta/SAML Integration',
      'Custom Regulatory Architecture Review & Pentest Clearance',
      '99.99% Architecture SLA with 1-Hour Severity-1 Response',
      'Dedicated Named Principal Architect on Call'
    ],
    cta: 'Claim $0 Slot (Enterprise)'
  }
]

export default function Pricing() {
  const [deploymentMode, setDeploymentMode] = useState<'cloud' | 'onprem'>('cloud')
  const [isAnnual, setIsAnnual] = useState(true)

  const isOnPrem = deploymentMode === 'onprem'

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-slate-50/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 via-purple-50 to-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold mb-4 shadow-xs">
            <Sparkles size={15} className="text-emerald-600" />
            <span>FOUNDING ENTERPRISE COHORT: $0 FOR FIRST 3 CUSTOMERS ONLY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Pricing: $0 for First 3 Customers Only
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            To establish our flagship reference architectures in Singapore &amp; ASEAN, <strong>pricing is $0 for our first 3 customers only</strong>. Full enterprise platform license, zero data egress deployment, and architecture onboarding are completely complimentary in exchange for collaboration &amp; product feedback.
          </p>

          {/* Cohort Status Counter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 shadow-xs text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">Cohort Quota:</span>
              <span className="text-emerald-700 font-semibold">1 Claimed (Fintech, SG) • 2 Slots Remaining at $0</span>
            </div>
          </div>

          {/* Controls: Deployment Mode & Billing Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 mt-10">
            {/* Deployment Switcher */}
            <div className="inline-flex p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setDeploymentMode('cloud')
                  trackEvent('click_cta', { location: 'pricing', label: 'Select Deployment: Cloud' })
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  !isOnPrem
                    ? 'bg-[#5b2d6e] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Cloud size={16} />
                <span>Managed Cloud (SaaS)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeploymentMode('onprem')
                  trackEvent('click_cta', { location: 'pricing', label: 'Select Deployment: On-Prem VPC' })
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isOnPrem
                    ? 'bg-[#5b2d6e] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Server size={16} />
                <span>Self-Hosted On-Prem / VPC</span>
                <span className="text-[10px] font-extrabold bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md">
                  Air-Gapped
                </span>
              </button>
            </div>

            {/* Annual vs Monthly Switcher */}
            <div className="flex items-center gap-3">
              <span className={`text-xs sm:text-sm font-semibold ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => {
                  const nextState = !isAnnual
                  setIsAnnual(nextState)
                  trackEvent('click_cta', { location: 'pricing', label: `Toggle Billing: ${nextState ? 'Annual' : 'Monthly'}` })
                }}
                className="w-13 h-7 flex items-center bg-[#5b2d6e] rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
                aria-label="Toggle annual billing"
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                    isAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs sm:text-sm font-semibold ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annual Plan
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Save 20% + Setup Waived
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Sub-banner explaining selected deployment mode */}
          <div className="mt-4 text-xs font-medium text-slate-500 max-w-2xl mx-auto">
            {isOnPrem ? (
              <span className="inline-flex items-center gap-1.5 text-slate-800 bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200">
                <Server size={13} className="text-slate-700" />
                <span><strong>Self-Hosted Software License:</strong> Lower pricing because you provide your own AWS/VPC compute. Zero external data egress.</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-purple-900 bg-purple-50 px-3.5 py-1.5 rounded-lg border border-purple-200">
                <Cloud size={13} className="text-purple-700" />
                <span><strong>Fully Managed Cloud:</strong> Zero infrastructure setup. Includes KaoinAI-managed AWS Singapore compute, backups, and 99.9% SLA.</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-14">
          {plans.map((plan, i) => {
            const price = isOnPrem
              ? (isAnnual ? plan.onpremAnnual : plan.onpremMonthly)
              : (isAnnual ? plan.cloudAnnual : plan.cloudMonthly)

            const setupFee = isOnPrem ? plan.onpremSetup : plan.cloudSetup
            const description = isOnPrem ? plan.descriptionOnPrem : plan.descriptionCloud
            const features = isOnPrem ? plan.featuresOnPrem : plan.featuresCloud

            return (
              <div
                key={i}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-white border-2 border-[#5b2d6e] shadow-2xl relative md:scale-105 z-10'
                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        plan.highlight
                          ? 'bg-purple-100 text-[#5b2d6e]'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    {plan.highlight && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <ShieldCheck size={14} /> Recommended
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mt-2 min-h-[32px]">{description}</p>

                  <div className="mt-6 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2 shadow-2xs">
                      <Sparkles size={11} className="text-emerald-600" />
                      <span>First 3 Customers: $0 / mo</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#5b2d6e]">
                        $0
                      </span>
                      <span className="text-sm font-semibold text-gray-600">/month</span>
                      <span className="text-sm font-medium text-gray-400 line-through">
                        ${price.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-1.5">
                      100% free for first 3 customers only • Standard ${price.toLocaleString()}/mo after
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {isAnnual ? `Annual equivalent value: $${(price * 12).toLocaleString()}/year` : 'Monthly equivalent value'}
                    </div>
                  </div>

                  {/* Setup & Onboarding Fee Callout */}
                  <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">
                        {isOnPrem ? 'VPC Setup & Deployment:' : 'Architecture Onboarding:'}
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                        <span className="line-through text-slate-400 font-normal">${setupFee.toLocaleString()}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[11px] font-bold">$0 (Waived for First 3)</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="border-t border-gray-100 pt-6 space-y-3">
                    {features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} className="text-[#5b2d6e]" />
                        </div>
                        <span className="text-xs text-gray-700 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button
                    size="lg"
                    className={`w-full py-6 text-sm font-semibold group ${
                      plan.highlight
                        ? 'bg-gradient-brand text-white hover:opacity-95 shadow-md'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      trackEvent('click_cta', { location: 'pricing', label: `${plan.name} (${deploymentMode}) - ${plan.cta}` })
                      document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {plan.cta}
                    <ArrowRight size={15} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <p className="text-[11px] text-center text-emerald-700 font-semibold mt-2">
                    🎯 First 3 Customers: $0 / mo (100% Free Lifetime Pilot)
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Why the Setup / Deployment Package? */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center">
              <Wrench size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {isOnPrem 
                  ? 'What Does the On-Premises / Private VPC Setup Package Include?' 
                  : 'What Does the Architecture Onboarding Package Include?'}
              </h4>
              <p className="text-xs text-gray-500">
                Guaranteed production go-live in under 48 hours without burdening your internal engineering team.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-700 pt-3">
            <div className="flex items-start gap-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <CheckCircle2 size={16} className="text-[#5b2d6e] shrink-0 mt-0.5" />
              <div>
                <strong>{isOnPrem ? 'VPC Topology & Subnet Peering:' : '1-on-1 Topology Review:'}</strong> {isOnPrem ? 'Containerized deployment inside your AWS/GCP/Azure VPC with private subnet routing and egress lockdown.' : 'Live connection & schema mapping session with a Senior AI Data Architect.'}
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <CheckCircle2 size={16} className="text-[#5b2d6e] shrink-0 mt-0.5" />
              <div>
                <strong>Statutory PDPA Leak Audit:</strong> Baseline scan of internal databases to detect, report, and mask unencrypted customer PII.
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <CheckCircle2 size={16} className="text-[#5b2d6e] shrink-0 mt-0.5" />
              <div>
                <strong>Semantic Glossary Calibration:</strong> Custom mapping of company abbreviations, KPIs, and operational formulas directly to SQL views.
              </div>
            </div>
            <div className="flex items-start gap-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <CheckCircle2 size={16} className="text-[#5b2d6e] shrink-0 mt-0.5" />
              <div>
                <strong>Dedicated Engineer Channel:</strong> Private Slack Connect or WhatsApp channel with a 2-hour SLA during onboarding.
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-purple-900 font-semibold">
            ✨ Founding Cohort Guarantee: First 3 enterprise customers receive the complete Architecture Onboarding &amp; Software License 100% waived ($0).
          </div>
        </div>

        {/* Founding Cohort ($0 for First 3 Customers) */}
        <div className="max-w-4xl mx-auto mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-purple-500/30 shadow-2xl shadow-purple-950/20 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles size={24} className="text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Founding Cohort • First 3 Customers Only</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Get Enterprise KaoinAI at $0 (100% Free for First 3 Customers)
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
                We are admitting our initial cohort of 3 regulated enterprise teams in Singapore &amp; ASEAN at <strong>$0 platform pricing</strong>. Selected partners receive dedicated solutions architecture, custom connector prioritization, and zero software licensing costs in exchange for product feedback and collaboration.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto relative z-10">
            <Button
              size="lg"
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow transition-colors"
              onClick={() => {
                trackEvent('click_cta', { location: 'pricing', label: `Apply $0 Cohort (${deploymentMode})` })
                document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Claim $0 Slot
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
            <a
              href={getWhatsAppUrl(`Hi KaoinAI, I would like to inquire about claiming one of the $0 founding customer slots for our team (${isOnPrem ? 'On-Prem / Private VPC' : 'Managed Cloud'}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors"
            >
              <span>WhatsApp Inquiries</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
