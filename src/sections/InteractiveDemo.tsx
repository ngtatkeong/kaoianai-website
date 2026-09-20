import { useState } from 'react'
import { 
  Terminal, 
  Database, 
  GitFork, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Play, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface Scenario {
  id: string
  title: string
  category: string
  icon: typeof Users
  badgeColor: string
  prompt: string
  executionTime: string
  confidenceScore: string
  summary: string
  insights: string[]
  sql: string
  lineage: {
    sources: string[]
    transformation: string
    destination: string
    latency: string
  }
}

const scenarios: Scenario[] = [
  {
    id: 'churn',
    title: 'VIP Churn Risk Detection',
    category: 'Revenue Protection',
    icon: TrendingUp,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    prompt: 'Find enterprise accounts with LTV > $5,000 who have not logged in or placed an order in the last 45 days.',
    executionTime: '118ms',
    confidenceScore: '99.6%',
    summary: 'Detected 42 at-risk customer accounts representing $284,500 in ARR across Stripe and PostgreSQL CRM.',
    insights: [
      'Top at-risk account: OmniLogistics SG (LTV: $48,200) — Inactive for 48 days',
      'Average decline in weekly query frequency prior to inactivity: 74%',
      'Automated retention webhook generated for HubSpot & Slack #cs-vip'
    ],
    sql: `SELECT 
  c.id, 
  c.company_name, 
  c.account_tier, 
  SUM(o.amount_usd) AS total_ltv, 
  MAX(o.created_at) AS last_order_date,
  DATEDIFF('day', MAX(o.created_at), CURRENT_DATE) AS days_inactive
FROM public.customers c
JOIN public.orders o ON c.id = o.customer_id
WHERE c.account_tier IN ('Enterprise', 'Growth')
GROUP BY c.id, c.company_name, c.account_tier
HAVING SUM(o.amount_usd) > 5000 
   AND MAX(o.created_at) < CURRENT_DATE - INTERVAL '45 days'
ORDER BY total_ltv DESC;`,
    lineage: {
      sources: ['Stripe Invoices API', 'PostgreSQL (production_crm)'],
      transformation: 'KaoinAI Semantic Aggregator & Recency Normalizer',
      destination: 'Snowflake (finance_mart.vip_churn_alerts)',
      latency: 'Real-time sync (0.4s)'
    }
  },
  {
    id: 'compliance',
    title: 'PDPA / PII Data Leak Audit',
    category: 'Regulatory Compliance',
    icon: ShieldAlert,
    badgeColor: 'bg-red-100 text-red-800 border-red-200',
    prompt: 'Scan all staging, developer, and analytics tables for unmasked Singapore NRIC, phone numbers, or credit card numbers.',
    executionTime: '164ms',
    confidenceScore: '99.9%',
    summary: 'Identified 3 unmasked PII columns in staging database. Auto-generated dynamic SHA-256 masking rules without disrupting engineering.',
    insights: [
      'CRITICAL: Table `staging_leads_2026` contains 1,420 unmasked NRIC identifiers',
      'WARNING: Column `users_backup_temp.phone` exposed to read-only dev roles',
      'Remediation applied: Automated dynamic column masking policy injected via proxy layer'
    ],
    sql: `/* KaoinAI Autonomous Compliance Inspector */
SELECT 
  table_schema, 
  table_name, 
  column_name, 
  data_type,
  kaoinai.entropy_score(sample_data) AS entropy,
  kaoinai.detect_pii_pattern(column_name, sample_data) AS detected_pattern
FROM information_schema.columns
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
  AND kaoinai.detect_pii_pattern(column_name, sample_data) IN ('SG_NRIC', 'PHONE_SG', 'CREDIT_CARD_PAN')
ORDER BY table_name, column_name;`,
    lineage: {
      sources: ['AWS RDS Staging', 'BigQuery Analytics Sandbox'],
      transformation: 'KaoinAI Privacy Shield & Pattern Classifier',
      destination: 'Compliance Dashboard (PDPA/GDPR Audit Log)',
      latency: 'Instant automated remediation'
    }
  },
  {
    id: 'reconciliation',
    title: 'Revenue Discrepancy Lineage',
    category: 'Financial Truth',
    icon: Database,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    prompt: 'Why does Stripe MRR show $142,500 while our executive dashboard reports $136,800 for March?',
    executionTime: '210ms',
    confidenceScore: '98.8%',
    summary: 'Root cause pinpointed in 3.2 seconds: 43 foreign currency transactions stalled during an upstream webhook retry failure.',
    insights: [
      'Discrepancy delta: Exactly $5,700 across 43 EUR/GBP cross-border checkouts',
      'Failed node: `dbt_transforms.stg_stripe_webhooks` timed out at 04:15 UTC due to FX rate API rate-limiting',
      'Recommended action: 1-click retry pipeline already queued with zero manual code edits'
    ],
    sql: `WITH stripe_totals AS (
  SELECT DATE_TRUNC('month', created) AS month, SUM(amount_net) / 100.0 AS stripe_mrr
  FROM raw_stripe.charges
  WHERE status = 'paid' AND refund_status IS NULL
  GROUP BY 1
),
bi_totals AS (
  SELECT DATE_TRUNC('month', transaction_date) AS month, SUM(usd_equivalent) AS bi_mrr
  FROM analytics_mart.fct_monthly_revenue
  GROUP BY 1
)
SELECT 
  s.month,
  s.stripe_mrr,
  b.bi_mrr,
  (s.stripe_mrr - b.bi_mrr) AS variance_usd,
  ARRAY_AGG(DISTINCT err.failure_reason) AS upstream_error_log
FROM stripe_totals s
FULL OUTER JOIN bi_totals b ON s.month = b.month
LEFT JOIN telemetry.pipeline_failures err ON s.month = DATE_TRUNC('month', err.failed_at)
GROUP BY s.month, s.stripe_mrr, b.bi_mrr;`,
    lineage: {
      sources: ['Stripe Webhooks', 'Kafka Event Bus'],
      transformation: 'dbt Core -> Currency Converter -> BI Mart',
      destination: 'Metabase / Tableau Executive Boardroom View',
      latency: 'Lineage mapped in 210ms'
    }
  },
  {
    id: 'dedup',
    title: 'Customer Master Record Unification',
    category: 'Master Data Management',
    icon: GitFork,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    prompt: 'Deduplicate and merge customer profiles across Shopify, Salesforce, and Zendesk into unified Golden Records.',
    executionTime: '175ms',
    confidenceScore: '99.3%',
    summary: 'Consolidated 2,140 fragmented customer touchpoints into 1,680 unified Golden Records with 100% auditable history.',
    insights: [
      'Resolved 460 customer identity collisions with fuzzy Jaro-Winkler + phone hash matching',
      'Linked Shopify checkout emails with historical Zendesk enterprise support tickets',
      'Golden Record ID generated and broadcasted back to downstream operational systems'
    ],
    sql: `/* KaoinAI Autonomous Entity Resolution & Golden Record Pipeline */
SELECT 
  kaoinai.generate_golden_id(s.customer_id, sf.lead_id, z.user_id) AS golden_customer_id,
  COALESCE(sf.verified_company, s.billing_company) AS authoritative_company,
  COALESCE(sf.work_email, s.email, z.email) AS primary_email,
  kaoinai.merge_phone(sf.mobile, s.phone) AS canonical_phone,
  COUNT(DISTINCT s.order_id) AS lifetime_shopify_orders,
  MAX(z.last_ticket_date) AS recent_support_touchpoint
FROM shopify_db.customers s
FULL OUTER JOIN salesforce_db.accounts sf 
  ON LOWER(s.email) = LOWER(sf.work_email) 
  OR kaoinai.clean_phone(s.phone) = kaoinai.clean_phone(sf.mobile)
FULL OUTER JOIN zendesk_db.users z 
  ON LOWER(s.email) = LOWER(z.email)
GROUP BY golden_customer_id, authoritative_company, primary_email, canonical_phone;`,
    lineage: {
      sources: ['Shopify Store DB', 'Salesforce CRM', 'Zendesk Support'],
      transformation: 'KaoinAI MDM Rule Engine & Fuzzy Entity Resolution',
      destination: 'Customer 360 Golden Mart (PostgreSQL)',
      latency: 'Continuous sync via CDC'
    }
  },
  {
    id: 'dpia-inventory',
    title: 'Table-Bound DPIA & Inventory',
    category: 'Privacy by Design',
    icon: ShieldCheck,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    prompt: 'Show all database tables containing PII bound directly to our statutory DPIA assessments and Singapore PDPA / GDPR Data Inventory.',
    executionTime: '142ms',
    confidenceScore: '99.8%',
    summary: 'Directly linked 14 production database tables containing PII to DPIA-2026-08 and active Data Inventory (RoPA) with real-time schema drift tracking.',
    insights: [
      'Physical Table Binding: `rds.customer_kyc` & `snowflake.orders` directly bound to DPIA Registry (Risk Level: Low / AES-256 Tokenized)',
      'Automated RoPA Generation: Legal Basis (PDPA §13 Contractual Necessity) & Retention (MAS TRM 7 Years) mapped per column',
      'Schema Drift Shield: Auto-detected newly migrated column `user_biometrics` in PostgreSQL; immediately flagged DPIA drift & queued impact assessment'
    ],
    sql: `/* KaoinAI Table-Bound DPIA & Living Data Inventory (RoPA) Engine */
SELECT 
  t.table_schema,
  t.table_name,
  c.column_name,
  dpia.assessment_id,
  dpia.risk_tier,
  dpia.mitigation_status,
  ropa.legal_basis,
  ropa.retention_period_years,
  ropa.cross_border_safeguard
FROM information_schema.tables t
JOIN information_schema.columns c 
  ON t.table_name = c.table_name AND t.table_schema = c.table_schema
JOIN kaoinai.data_inventory_ropa ropa 
  ON c.table_name = ropa.bound_table_name AND c.column_name = ropa.bound_column_name
JOIN kaoinai.dpia_registry dpia 
  ON t.table_name = dpia.target_table_name
WHERE ropa.contains_pii = TRUE
ORDER BY dpia.risk_tier DESC, t.table_name, c.column_name;`,
    lineage: {
      sources: ['PostgreSQL (rds_prod.customer_kyc)', 'Snowflake (finance_mart.orders)'],
      transformation: 'KaoinAI Table-Level DPIA Binder & Living RoPA Generator',
      destination: 'Audit-Ready PDPA / GDPR Article 30 Compliance Export',
      latency: 'Continuous schema synchronization'
    }
  }
]

export default function InteractiveDemo() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0])
  const [activeTab, setActiveTab] = useState<'insights' | 'sql' | 'lineage'>('insights')
  const [copied, setCopied] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [customSubmitted, setCustomSubmitted] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScenario.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    trackEvent('copy_demo_sql', { scenario: activeScenario.id })
  }

  const handleScenarioChange = (scenario: Scenario) => {
    setActiveScenario(scenario)
    trackEvent('switch_demo_scenario', { scenario: scenario.id })
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customPrompt.trim()) return
    setCustomSubmitted(true)
    trackEvent('try_custom_query_demo', { query: customPrompt.trim() })
  }

  const handleScrollToCta = () => {
    const el = document.getElementById('cta')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section id="demo" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles size={14} />
            <span>Interactive Live Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            See KaoinAI in Action — Before Touching Your Database
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Select an enterprise scenario below. Watch how KaoinAI autonomously understands natural language, synthesizes dialect SQL, and traces table-bound lineage in sub-second time.
          </p>
        </div>

        {/* Scenario Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {scenarios.map((scenario) => {
            const IconComponent = scenario.icon
            const isSelected = activeScenario.id === scenario.id
            return (
              <button
                key={scenario.id}
                onClick={() => handleScenarioChange(scenario)}
                className={`flex flex-col text-left p-3.5 sm:p-4 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-purple-900/40 border-purple-400 ring-2 ring-purple-500/30 shadow-lg shadow-purple-950/40'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                    <IconComponent size={18} />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${scenario.badgeColor}`}>
                    {scenario.category}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white mb-1 leading-snug">{scenario.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{scenario.prompt}</p>
              </button>
            )
          })}
        </div>

        {/* Main Terminal Window */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-12">
          {/* Terminal Window Header */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-400 flex items-center gap-1.5">
                <Terminal size={13} /> kaoinai-agent // live_engine
              </span>
            </div>

            {/* Performance metrics pill */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
                <Clock size={12} /> {activeScenario.executionTime}
              </span>
              <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded border border-purple-800/60">
                <CheckCircle2 size={12} /> {activeScenario.confidenceScore} match
              </span>
            </div>
          </div>

          {/* Prompt Bar */}
          <div className="p-4 sm:p-5 bg-slate-900/50 border-b border-slate-800/80 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
              <Play size={14} className="fill-purple-300" />
            </div>
            <div className="flex-grow">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold mb-1">
                Natural Language Query Input:
              </div>
              <div className="text-sm sm:text-base font-medium text-slate-100">
                &ldquo;{activeScenario.prompt}&rdquo;
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="bg-slate-900/40 border-b border-slate-800 px-4 sm:px-6 flex gap-2">
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'insights'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={15} /> Business Insights & Action Plan
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'sql'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal size={15} /> Generated SQL
            </button>
            <button
              onClick={() => setActiveTab('lineage')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'lineage'
                  ? 'border-purple-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork size={15} /> Data Lineage Graph
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-4 sm:p-6 min-h-[260px] flex flex-col justify-center">
            {activeTab === 'insights' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">Executive Summary</h4>
                    <p className="text-slate-300 text-sm mt-0.5">{activeScenario.summary}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Synthesized Findings & Automated Remediation:
                  </span>
                  <div className="grid gap-2.5">
                    {activeScenario.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-purple-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sql' && (
              <div className="relative animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">PostgreSQL / Snowflake Compliant Dialect</span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy Query
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-purple-200 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{activeScenario.sql}</code>
                </pre>
              </div>
            )}

            {activeTab === 'lineage' && (
              <div className="space-y-6 py-2 animate-in fade-in duration-300">
                <div className="text-xs font-mono text-slate-400">
                  Automated End-to-End Lineage Path (Zero manual YAML configuration required):
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  {/* Step 1: Ingestion Sources */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                        <span>1. Raw Systems</span>
                        <span className="text-emerald-400">Connected</span>
                      </div>
                      <div className="space-y-1.5">
                        {activeScenario.lineage.sources.map((src, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono text-white bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
                            <Database size={13} className="text-purple-400" /> {src}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: KaoinAI Engine */}
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-700/50 flex flex-col justify-between shadow-lg shadow-purple-950/50">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-purple-300 mb-2">
                        <span>2. KaoinAI Neural Layer</span>
                        <span className="text-purple-300 font-mono">{activeScenario.lineage.latency}</span>
                      </div>
                      <div className="p-2.5 rounded bg-purple-900/40 text-xs font-medium text-purple-100 border border-purple-700/40">
                        {activeScenario.lineage.transformation}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-purple-300">
                      <Sparkles size={13} /> Zero customer data retention
                    </div>
                  </div>

                  {/* Step 3: Destination */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                        <span>3. Target Destination</span>
                        <span className="text-emerald-400">Synchronized</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950 text-xs font-mono text-emerald-300 border border-slate-800">
                        {activeScenario.lineage.destination}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                      <CheckCircle2 size={13} className="text-emerald-400" /> Audited & Verified
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Try Your Own Prompt Interactive Box */}
        <div className="bg-gradient-to-r from-purple-900/30 via-slate-900 to-purple-900/30 rounded-2xl p-6 sm:p-8 border border-purple-500/30 text-center max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Want to test your own business question?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Type an operational inquiry below or test it on your actual database schema during our complimentary 14-day pilot.
          </p>

          {customSubmitted ? (
            <div className="bg-slate-950/80 p-5 rounded-xl border border-emerald-500/40 text-left max-w-2xl mx-auto space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 size={16} />
                <span>Query Analyzed & Schema Prepared!</span>
              </div>
              <p className="text-xs text-slate-300">
                Query: <span className="text-white font-medium">&ldquo;{customPrompt}&rdquo;</span>
              </p>
              <div className="text-xs text-purple-300 bg-purple-950/50 p-3 rounded border border-purple-800/40">
                To execute this query across your live schema with zero data retention, activate your complimentary 14-day pilot or test directly with an engineer.
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  onClick={handleScrollToCta}
                  size="sm"
                  className="bg-gradient-brand text-white font-semibold text-xs"
                >
                  Start 14-Day Free Pilot
                </Button>
                <a
                  href={getWhatsAppUrl(`Hi KaoinAI, I want to test this query on our database: "${customPrompt}"`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs"
                >
                  Test on WhatsApp with Data Engineer
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl mx-auto">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Find duplicate leads created between Zendesk and Salesforce..."
                className="flex-grow px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <Button
                type="submit"
                className="bg-gradient-brand text-white font-semibold px-6 py-3 rounded-xl text-sm whitespace-nowrap hover:opacity-90 transition-opacity"
              >
                <span>Inspect Query</span>
                <ArrowRight size={15} className="ml-1.5" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
