import { ArrowRight, Sparkles, Shield, Database, Brain, CheckCircle2, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Ambient background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/40 to-red-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50/90 border border-purple-200/70 text-[#5b2d6e] text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles size={14} className="text-[#7c3aed]" />
                <span>Autonomous Data Governance for Enterprise AI</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-300">Singapore PDPA &amp; MAS TRM</span>
                <span className="text-purple-300 font-semibold">• Live Schema Binding</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-950">
              Autonomous Data Governance
              <br />
              <span className="text-gradient">For Safe, Trustworthy AI</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              AI is only as reliable as the data feeding it. Connect PostgreSQL, Snowflake, RDS, and ERPs in minutes. Eliminate LLM hallucinations, sanitize PII before prompt ingestion, and automate table-bound DPIAs and column-level lineage — with zero multi-month consulting overhead.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-slate-950 text-white hover:bg-slate-800 transition-colors px-7 py-6 text-sm sm:text-base font-semibold group rounded-xl shadow-lg"
                onClick={() => {
                  trackEvent('click_cta', { location: 'hero', label: 'Deploy 14-Day Pilot' })
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

            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Brain size={16} className="text-[#5b2d6e]" />
                <span>AI Governance &amp; Hallucination Guard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={16} className="text-[#5b2d6e]" />
                <span>Table-Bound DPIA &amp; RoPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database size={16} className="text-[#5b2d6e]" />
                <span>Zero SQL Required for AI Queries</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Obsidian Live Telemetry Console */}
            <div className="relative bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800/90 p-5 sm:p-7 overflow-hidden backdrop-blur-xl">
              {/* Subtle ambient glow behind console */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Console Window Header */}
                <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-slate-400">kaoinai-telemetry // prod_sg</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE ENGINE
                  </div>
                </div>

                <div className="space-y-3.5">
                  {/* Automated Quality Score */}
                  <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300">Automated Data Quality Health</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">99.4%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full" style={{ width: '99.4%' }} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> 
                      <span>24 validation rules continuously enforced across PostgreSQL &amp; Snowflake</span>
                    </p>
                  </div>

                  {/* 2-column Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1">Table-Bound DPIA &amp; PII</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-white truncate">14 Tables</div>
                      <div className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1 truncate">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        100% Schema Linked
                      </div>
                    </div>
                    <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800">
                      <div className="text-[11px] text-slate-400 mb-1">Living RoPA Inventory</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-purple-300 truncate">PDPA &amp; GDPR</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                        <span className="w-1 h-1 rounded-full bg-purple-400" />
                        Zero spreadsheets
                      </div>
                    </div>
                  </div>

                  {/* AI Governance Synthesis Alert */}
                  <div className="bg-purple-950/30 rounded-2xl p-4 border border-purple-800/40">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-300" />
                        <span className="text-xs font-bold text-purple-200">AI Safety &amp; Lineage Guard Active</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">18ms</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      Detected schema migration on <code className="text-purple-300 bg-purple-900/40 px-1 py-0.5 rounded">users_v2</code>: Auto-classified NRIC &amp; Phone, bound to DPIA-2026-08, blocked raw PII from LLM prompt ingestion.
                    </p>
                  </div>

                  {/* Telemetry Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Continuous Schema Sync Active
                    </span>
                    <span>Latency: 28ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Static Professional Badges (No childish bounce) */}
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
