import { useState } from 'react'
import { 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  Wrench, 
  Zap, 
  Cloud, 
  Server,
  Lock
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
    cloudMonthly: 490,
    cloudAnnual: 390,
    cloudSetup: 990,
    onpremMonthly: 790,
    onpremAnnual: 650,
    onpremSetup: 1990,
    descriptionCloud: 'Autonomous PII detection and automated data health in our managed Singapore cloud.',
    descriptionOnPrem: 'Self-hosted Docker container inside your private AWS/GCP VPC or local server.',
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
    cta: 'Start 14-Day Free Pilot'
  },
  {
    name: 'Growth',
    badge: 'Most Popular • 80%+ Less than Atlan',
    cloudMonthly: 990,
    cloudAnnual: 790,
    cloudSetup: 1990,
    onpremMonthly: 1490,
    onpremAnnual: 1190,
    onpremSetup: 2990,
    descriptionCloud: 'Complete autonomous catalog, column lineage, and MDM in managed cloud.',
    descriptionOnPrem: 'High-security Kubernetes / VPC cluster for regulated fintech, health, and commerce.',
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
    cta: 'Claim $0 Launch Slot'
  },
  {
    name: 'Enterprise',
    badge: 'Custom Scale & Air-Gapped',
    cloudMonthly: 2490,
    cloudAnnual: 1990,
    cloudSetup: 3990,
    onpremMonthly: 3990,
    onpremAnnual: 3290,
    onpremSetup: 5990,
    descriptionCloud: 'Dedicated multi-tenant isolated cluster with custom RBAC and strict SLAs.',
    descriptionOnPrem: 'Full air-gapped sovereign deployment with customer KMS/HSM and multi-region clusters.',
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
    cta: 'Contact Sales / On-Prem VPC'
  }
]

export default function Pricing() {
  const [deploymentMode, setDeploymentMode] = useState<'cloud' | 'onprem'>('cloud')
  const [isAnnual, setIsAnnual] = useState(true)

  const isOnPrem = deploymentMode === 'onprem'

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-xs sm:text-sm font-semibold mb-4">
            <Zap size={15} />
            <span>80%+ Less Expensive Than Legacy Giants (Atlan, Alation, Collibra)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Transparent Pricing: Cloud vs. On-Premises
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose between our managed, secure cloud or a self-hosted private VPC deployment inside your firewall. No six-figure vendor lock-ins or mandatory multi-year commitments.
          </p>

          {/* Controls: Deployment Mode & Billing Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8">
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
          <div className="mt-4 text-xs font-medium text-slate-500 max-w-xl mx-auto">
            {isOnPrem ? (
              <span className="inline-flex items-center gap-1.5 text-amber-900 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                <Lock size={13} className="text-amber-700" />
                <span><strong>On-Premises Mode:</strong> Deployed in your private VPC/Kubernetes. Zero external egress, complete data sovereignty.</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                <Cloud size={13} className="text-purple-700" />
                <span><strong>Managed Cloud Mode:</strong> Zero infrastructure maintenance. Automated updates, daily backups in Singapore AWS region.</span>
              </span>
            )}
          </div>
        </div>

        {/* High-Impact Launch Special: $0 for First 3 Customers */}
        <div className="max-w-5xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border-2 border-amber-300 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-md">
              <Gift size={32} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-extrabold uppercase tracking-wider mb-2">
                <span>🔥 Limited Time Launch Offer</span>
                <span>•</span>
                <span>Only 2 Slots Left</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                $0 for First 3 Customers ({isOnPrem ? '$10,430 Value' : '$7,930 Value'})
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-1.5 max-w-xl leading-relaxed">
                Be an early design partner: Get 6 months of our complete <strong>Growth Tier</strong> ({isOnPrem ? 'On-Premises / Private VPC' : 'Managed Cloud'} 100% Free) plus the <strong>Architecture Deployment & PDPA Audit Package completely waived</strong>.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
            <Button
              size="lg"
              className="bg-gradient-brand text-white font-bold text-xs sm:text-sm px-6 py-4 rounded-xl shadow-md hover:opacity-90 transition-opacity"
              onClick={() => {
                trackEvent('click_cta', { location: 'pricing', label: `Claim $0 Launch Special (${deploymentMode})` })
                document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Claim $0 Launch Slot
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
            <a
              href={getWhatsAppUrl(`Hi KaoinAI, I would like to claim the $0 launch offer for the first 3 customers in ${isOnPrem ? 'On-Prem / Private VPC' : 'Managed Cloud'} mode.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>WhatsApp Us</span>
            </a>
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
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">
                        ${price.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-gray-500">/month</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">
                      {isAnnual ? `Billed annually ($${(price * 12).toLocaleString()}/year)` : 'Billed monthly'}
                    </div>
                  </div>

                  {/* Setup & Onboarding Fee Callout */}
                  <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">
                        {isOnPrem ? 'VPC Setup & Deployment:' : 'Architecture Onboarding:'}
                      </span>
                      {isAnnual ? (
                        <div className="flex items-center gap-1 font-bold text-emerald-700">
                          <span className="line-through text-slate-400 font-normal">${setupFee.toLocaleString()}</span>
                          <span>FREE (Waived)</span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-900">${setupFee.toLocaleString()} One-Time</span>
                      )}
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
                  <p className="text-[11px] text-center text-gray-400 mt-2">
                    {plan.highlight ? 'First 3 customers get $0 + Waived Setup' : '14-day risk-free pilot'}
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
            ✨ Pro-tip: Choose Annual Billing or apply as one of our First 3 Launch Customers to get the entire Setup & Deployment package 100% Waived.
          </div>
        </div>
      </div>
    </section>
  )
}
