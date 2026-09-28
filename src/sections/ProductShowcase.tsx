import { useState } from 'react'
import { 
  GitFork, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  Lock
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

type ShowcaseTab = 'lineage' | 'dpia' | 'sql' | 'mdm'

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('lineage')

  const tabs = [
    {
      id: 'lineage' as ShowcaseTab,
      label: 'Column-Level Lineage',
      badge: 'Visual DAG',
      description: 'Trace data flows from raw PostgreSQL tables to Snowflake and BI dashboards.',
      icon: GitFork,
    },
    {
      id: 'dpia' as ShowcaseTab,
      label: 'Table-Bound DPIA & RoPA',
      badge: 'Statutory Shield',
      description: 'Inspect live PII classification and Singapore PDPA / MAS TRM schema bindings.',
      icon: ShieldCheck,
    },
    {
      id: 'sql' as ShowcaseTab,
      label: 'Ask Data SQL Studio',
      badge: 'Natural Language',
      description: 'Query verified schemas in plain English with automated pre-prompt masking.',
      icon: Terminal,
    },
    {
      id: 'mdm' as ShowcaseTab,
      label: 'MDM Golden Records',
      badge: 'Entity Resolution',
      description: 'Resolve customer identities across Salesforce, HubSpot, and billing ERPs.',
      icon: Layers,
    },
  ]

  return (
    <section id="product-tour" className="py-20 sm:py-28 bg-gradient-to-b from-white via-purple-50/20 to-white relative z-20 scroll-mt-20 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-[#5b2d6e] text-xs font-bold mb-4 shadow-2xs">
            <Sparkles size={14} className="text-purple-700" />
            <span>Interactive Product Tour • Live UI Walkthrough</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
            See the Autonomous Governance Platform in Action
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            No mockups or vague promises. Explore the actual dashboards and intelligence workflows that keep data stacks clean, compliant, and AI-ready.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-purple-950 text-white border-purple-500 shadow-xl shadow-purple-950/20 ring-2 ring-purple-500/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-purple-800 text-purple-200' : 'bg-purple-50 text-purple-700'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${isActive ? 'bg-purple-900 text-purple-300' : 'bg-slate-100 text-slate-600'}`}>
                    {tab.badge}
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base mb-1">
                  {tab.label}
                </div>
                <p className={`text-xs line-clamp-2 ${isActive ? 'text-purple-200' : 'text-slate-500'}`}>
                  {tab.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Screen Showcase Container */}
        <div className="bg-slate-950 rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-950/30 overflow-hidden text-white">
          {/* Mock Browser/App Chrome Header */}
          <div className="bg-slate-900 border-b border-white/10 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="bg-slate-950/80 border border-white/10 px-3 py-1 rounded-lg text-xs font-mono text-slate-400 flex items-center gap-2">
                <Lock size={11} className="text-emerald-400" />
                <span>app.kaoinai.com/{activeTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Cluster: prod-sg-01
              </span>
              <span className="hidden sm:inline text-slate-400 text-xs">
                TLS 1.3 Verified
              </span>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-5 sm:p-8 min-h-[460px] flex flex-col justify-between">
            {/* 1. Lineage Graph */}
            {activeTab === 'lineage' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <GitFork className="text-purple-400" size={18} />
                      End-to-End Column Lineage DAG: <code className="text-purple-300 font-mono text-sm">revenue_mrr</code>
                    </h3>
                    <p className="text-xs text-slate-400">Upstream dependency graph across PostgreSQL ➔ dbt Core ➔ Snowflake ➔ Metabase</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono">
                      <AlertTriangle size={13} />
                      Schema Drift Shield: Active
                    </span>
                  </div>
                </div>

                {/* Interactive DAG Nodes Flow */}
                <div className="grid md:grid-cols-4 gap-4 py-4">
                  {/* Node 1 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group hover:border-purple-500 transition-colors">
                    <div className="text-[10px] font-mono text-purple-400 uppercase mb-1">Source 01 • PostgreSQL</div>
                    <div className="font-bold text-sm text-slate-200 mb-2">rds.public.invoices</div>
                    <div className="space-y-1 font-mono text-xs text-slate-400">
                      <div className="flex justify-between"><span>invoice_id</span><span className="text-purple-400">UUID</span></div>
                      <div className="flex justify-between"><span>amount_cents</span><span className="text-purple-400">INT8</span></div>
                      <div className="flex justify-between text-emerald-400"><span>customer_nric</span><span>MASKED</span></div>
                    </div>
                    <div className="mt-3 text-[10px] text-slate-500 flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      14,280 rows/sec sync
                    </div>
                  </div>

                  {/* Node 2 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-purple-500 transition-colors">
                    <div className="text-[10px] font-mono text-indigo-400 uppercase mb-1">Transform • dbt Core</div>
                    <div className="font-bold text-sm text-slate-200 mb-2">stg_recurring_revenue</div>
                    <div className="space-y-1 font-mono text-xs text-slate-400">
                      <div className="flex justify-between"><span>mrr_monthly</span><span className="text-indigo-400">NUMERIC</span></div>
                      <div className="flex justify-between"><span>arr_annual</span><span className="text-indigo-400">CALC</span></div>
                      <div className="flex justify-between text-slate-500"><span>churn_tag</span><span>ENUM</span></div>
                    </div>
                    <div className="mt-3 text-[10px] text-slate-500 flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      Passing 12 Data Quality tests
                    </div>
                  </div>

                  {/* Node 3 */}
                  <div className="bg-purple-950/40 border border-purple-500/40 rounded-2xl p-4 shadow-lg shadow-purple-950/50">
                    <div className="text-[10px] font-mono text-purple-300 uppercase mb-1">Target Mart • Snowflake</div>
                    <div className="font-bold text-sm text-white mb-2">marts.finance.revenue</div>
                    <div className="space-y-1 font-mono text-xs text-slate-300">
                      <div className="flex justify-between font-bold text-purple-300"><span>revenue_mrr</span><span>AUDITED</span></div>
                      <div className="flex justify-between"><span>cohort_year</span><span>INT</span></div>
                      <div className="flex justify-between"><span>entity_jurisdiction</span><span>SG</span></div>
                    </div>
                    <div className="mt-3 text-[10px] text-purple-300 flex items-center gap-1">
                      <Sparkles size={11} />
                      Golden metric bound
                    </div>
                  </div>

                  {/* Node 4 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-purple-500 transition-colors">
                    <div className="text-[10px] font-mono text-teal-400 uppercase mb-1">Consumption • BI &amp; AI</div>
                    <div className="font-bold text-sm text-slate-200 mb-2">Executive Board Deck</div>
                    <div className="space-y-1 font-mono text-xs text-slate-400">
                      <div>• Metabase KPI Dashboard</div>
                      <div>• LLM Financial Copilot</div>
                      <div className="text-emerald-400">• Zero Unmasked PII</div>
                    </div>
                    <div className="mt-3 text-[10px] text-slate-500 flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-400" />
                      100% verified provenance
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
                  <span>Impact Analysis: If <code className="text-purple-300">invoices.amount_cents</code> changes type, 3 downstream models and 2 BI boards flag warning in &lt; 200ms.</span>
                  <span className="text-emerald-400 font-bold">Safe for Production</span>
                </div>
              </div>
            )}

            {/* 2. DPIA & RoPA */}
            {activeTab === 'dpia' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="text-emerald-400" size={18} />
                      Living Statutory Data Inventory &amp; Table-Bound DPIA
                    </h3>
                    <p className="text-xs text-slate-400">Anchored to Singapore PDPA §13 &amp; EU GDPR Article 30 living schemas</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg">
                      Audit Readiness: 100%
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="py-2.5 px-3">Physical Database Column</th>
                        <th className="py-2.5 px-3">Detected PII Category</th>
                        <th className="py-2.5 px-3">Risk Tier</th>
                        <th className="py-2.5 px-3">Statutory Basis (PDPA)</th>
                        <th className="py-2.5 px-3">Enforced Masking</th>
                        <th className="py-2.5 px-3">DPIA Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="py-3 px-3 text-purple-300 font-bold">rds_prod.users.nric_fin</td>
                        <td className="py-3 px-3"><span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded">Singapore NRIC / FIN</span></td>
                        <td className="py-3 px-3 text-rose-400">Tier 1 (High)</td>
                        <td className="py-3 px-3">PDPA §13 Deemed Consent</td>
                        <td className="py-3 px-3 text-emerald-400">SHA-256 Pseudonymized</td>
                        <td className="py-3 px-3 text-purple-400 underline">DPIA-2026-SG-01</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 text-purple-300 font-bold">rds_prod.users.mobile_phone</td>
                        <td className="py-3 px-3"><span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded">E.164 Phone Number</span></td>
                        <td className="py-3 px-3 text-amber-400">Tier 2 (Moderate)</td>
                        <td className="py-3 px-3">Service Delivery Contract</td>
                        <td className="py-3 px-3 text-emerald-400">AES-256 Vaulted</td>
                        <td className="py-3 px-3 text-purple-400 underline">DPIA-2026-SG-04</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 text-purple-300 font-bold">snowflake.orders.billing_address</td>
                        <td className="py-3 px-3"><span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded">Physical Home Address</span></td>
                        <td className="py-3 px-3 text-amber-400">Tier 2 (Moderate)</td>
                        <td className="py-3 px-3">Fulfillment Purpose</td>
                        <td className="py-3 px-3 text-emerald-400">Dynamic UI Masking</td>
                        <td className="py-3 px-3 text-purple-400 underline">DPIA-2026-SG-07</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 size={16} />
                    <span>Living RoPA automatically updated upon today&apos;s migration. Zero spreadsheets required.</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-300 hover:bg-emerald-900/40 text-xs">
                    Export Statutory PDF
                  </Button>
                </div>
              </div>
            )}

            {/* 3. Ask Data SQL */}
            {activeTab === 'sql' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Terminal className="text-purple-400" size={18} />
                      Natural Language &quot;Ask Data in Plain English&quot; Studio
                    </h3>
                    <p className="text-xs text-slate-400">Governed Text-to-SQL with automatic pre-prompt PII redaction</p>
                  </div>
                  <span className="bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs px-2.5 py-1 rounded-lg font-mono">
                    Query Latency: 124ms
                  </span>
                </div>

                {/* Natural Language Prompt */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="text-[11px] font-mono text-purple-400 uppercase mb-1">Human Executive Prompt:</div>
                  <div className="text-sm font-semibold text-slate-100">
                    &quot;Show me the top 3 customer cohorts by MRR this quarter, with customer names masked and churn rate calculated.&quot;
                  </div>
                </div>

                {/* Synthesized Dialect SQL */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-purple-500/20 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
                  <div className="text-slate-500">-- Auto-generated PostgreSQL 16 dialect with pre-prompt PII shielding</div>
                  <div><span className="text-purple-400">SELECT</span></div>
                  <div className="pl-4">c.cohort_quarter,</div>
                  <div className="pl-4 text-emerald-400">kaoinai.mask_sha256(c.customer_name) AS masked_customer,</div>
                  <div className="pl-4">ROUND(SUM(i.amount_usd), 2) AS total_mrr,</div>
                  <div className="pl-4">ROUND(AVG(c.churn_probability), 3) AS avg_churn_risk</div>
                  <div><span className="text-purple-400">FROM</span> prod_analytics.cohorts c</div>
                  <div><span className="text-purple-400">JOIN</span> prod_billing.invoices i <span className="text-purple-400">ON</span> c.customer_id = i.customer_id</div>
                  <div><span className="text-purple-400">WHERE</span> i.invoice_date &gt;= &apos;2026-07-01&apos;</div>
                  <div><span className="text-purple-400">GROUP BY</span> 1, 2 <span className="text-purple-400">ORDER BY</span> total_mrr <span className="text-purple-400">DESC LIMIT</span> 3;</div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Confidence: <strong className="text-emerald-400 font-mono">99.8% match</strong> • Foreign keys verified against data catalog</span>
                  <span className="text-purple-300 font-mono">Execution Safety: Guaranteed Read-Only</span>
                </div>
              </div>
            )}

            {/* 4. MDM Golden Record */}
            {activeTab === 'mdm' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="text-indigo-400" size={18} />
                      Master Data (MDM) Entity Resolution &amp; Golden Record Creation
                    </h3>
                    <p className="text-xs text-slate-400">Automated deduplication across Salesforce, Stripe, and billing ERP</p>
                  </div>
                  <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-2.5 py-1 rounded-lg font-mono">
                    Match Confidence: 99.4%
                  </span>
                </div>

                {/* Duplicate Collision Resolution */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-blue-400 uppercase">Source 1 • Salesforce CRM</span>
                    <div className="font-bold text-sm text-slate-200">Acme Technologies Pte Ltd</div>
                    <div className="text-xs font-mono text-slate-400">UEN: 202418920K • SG</div>
                    <div className="text-xs font-mono text-slate-400">Email: billing@acme.sg</div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Source 2 • Stripe Billing</span>
                    <div className="font-bold text-sm text-slate-200">Acme Tech (Singapore)</div>
                    <div className="text-xs font-mono text-slate-400">Customer ID: cus_9821xa</div>
                    <div className="text-xs font-mono text-slate-400">Email: finance@acmetech.io</div>
                  </div>

                  <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-950/40 space-y-2 shadow-lg shadow-purple-950/50">
                    <span className="text-[10px] font-mono text-purple-300 uppercase font-bold flex items-center gap-1">
                      <Sparkles size={11} /> Golden Record Consolidated
                    </span>
                    <div className="font-bold text-sm text-white">Acme Technologies Pte. Ltd.</div>
                    <div className="text-xs font-mono text-purple-300">Unified Entity ID: ENT-8492</div>
                    <div className="text-xs text-slate-300">Cross-platform revenue merged without ETL drift</div>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                  <span>Resolved 3,842 duplicate enterprise entities across 3 systems. Zero customer collision tickets.</span>
                  <span className="text-emerald-400 font-mono font-bold">Auto-Sync Enabled</span>
                </div>
              </div>
            )}

            {/* Bottom Showcase CTA Strip */}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Want to see this running on your own database schemas? 15-minute zero-commitment demo.
              </div>
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl">
                <Link to="/contact">
                  Schedule Live Platform Demo
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
