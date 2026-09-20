import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const problems = [
  'Disconnected Compliance Spreadsheets: Static DPIAs and surveys that become obsolete the moment an engineer runs a schema migration.',
  'Exorbitant Implementation & Lock-In: $30,000–$100,000+/year software minimums plus six-figure system integrator retainers.',
  'Catastrophic Regulatory Exposure: Undetected PII drift leading to severe PDPA, MAS TRM, and GDPR statutory penalties.',
  'Developer & Analyst Burnout: High-friction manual SQL drafting, broken pipelines, and unmaintained custom lineage scripts.',
  'Fragmented Customer Master Data: Conflicting records and duplicate entities isolated across disparate ERPs, CRMs, and SQL tables.'
]

const solutions = [
  'Physical Table-Bound DPIA & Living RoPA: Compliance inventories generated directly from physical database schemas with automated drift alerts.',
  'Rapid Production Go-Live in Under 48h: Instant deployment via self-hosted Docker, private VPC Kubernetes, or managed cloud.',
  'Autonomous Natural Language to SQL: Sub-second conversational data querying with zero manual SQL drafting required.',
  'Continuous Schema Shift & Dynamic Masking: Real-time detection of newly migrated PII with automatic tokenization and role-based masking.',
  'Golden Record MDM Engine: Automated entity resolution across Salesforce, PostgreSQL, Shopify, and ERPs without brittle custom ETL.'
]

export default function ProblemSolution() {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Architectural Paradigm</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-5">
            Why Legacy Data Governance Fails
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Traditional data catalogs rely on disconnected compliance surveys, static spreadsheets, and multi-million dollar consulting retainers that immediately drift out of sync with actual database reality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div className="bg-slate-50/80 rounded-3xl p-7 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-slate-200/60">
                <div className="w-11 h-11 rounded-2xl bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Legacy Governance &amp; Manual Silos</h3>
                  <p className="text-xs text-slate-500">Consultant-heavy, fragile, and decoupled from production databases</p>
                </div>
              </div>
              <ul className="space-y-4 sm:space-y-5">
                {problems.map((item, i) => {
                  const [title, ...desc] = item.split(': ')
                  return (
                    <li key={i} className="flex items-start gap-3.5">
                      <XCircle size={18} className="text-red-500 mt-1 shrink-0" />
                      <div className="text-sm leading-relaxed">
                        <strong className="text-slate-900 block font-semibold">{title}</strong>
                        <span className="text-slate-600">{desc.join(': ')}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-10 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3.5 mb-8 pb-5 border-b border-slate-800">
                <div className="w-11 h-11 rounded-2xl bg-purple-900/80 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">KaoinAI Autonomous Governance</h3>
                  <p className="text-xs text-purple-300">Continuous, schema-bound, and operational in under 48 hours</p>
                </div>
              </div>
              <ul className="space-y-4 sm:space-y-5">
                {solutions.map((item, i) => {
                  const [title, ...desc] = item.split(': ')
                  return (
                    <li key={i} className="flex items-start gap-3.5">
                      <CheckCircle size={18} className="text-emerald-400 mt-1 shrink-0" />
                      <div className="text-sm leading-relaxed">
                        <strong className="text-white block font-semibold">{title}</strong>
                        <span className="text-slate-300">{desc.join(': ')}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
