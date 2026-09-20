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
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-xs sm:text-sm font-medium">
                <Sparkles size={15} />
                <span>AI-Powered Data Intelligence for SMEs</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-slate-700 text-xs sm:text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-slate-600 font-medium">Design Partner Program:</span>
                <span className="text-[#5b2d6e] font-semibold">Complimentary Onboarding</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              Enterprise Data Tools,
              <br />
              <span className="text-gradient">Now Accessible for SMEs</span>
            </h1>

            <p className="text-sm sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Data Governance, Table-Bound DPIA & Data Inventories, Quality monitoring, and Master Data Management (MDM) — 
              capabilities that once required millions and armies of consultants, now delivered in an 
              affordable AI platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-brand text-white hover:opacity-90 transition-opacity px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold group rounded-xl shadow-md"
                onClick={() => {
                  trackEvent('click_cta', { location: 'hero', label: 'Hero Start Free Trial' })
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Start 14-Day Free Trial
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-purple-200 text-[#5b2d6e] hover:bg-purple-50 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl"
                onClick={() => {
                  trackEvent('click_cta', { location: 'hero', label: 'Hero Try Interactive Demo' })
                  const el = document.getElementById('demo')
                  if (el) {
                    const yOffset = -76
                    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
                    window.scrollTo({ top: y, behavior: 'smooth' })
                  }
                }}
              >
                <Terminal size={17} className="mr-2 text-purple-600" />
                Try Interactive Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Shield size={16} className="text-[#5b2d6e]" />
                <span>Table-Bound DPIA & RoPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database size={16} className="text-[#5b2d6e]" />
                <span>ERP & Cloud Agnostic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Brain size={16} className="text-[#5b2d6e]" />
                <span>AI-Native (Zero SQL Req.)</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md">
                  KaoinAI Live Monitor
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-red-50 rounded-xl p-3 sm:p-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#5b2d6e]">Automated Data Quality Score</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#5b2d6e]">94.2%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 sm:h-2.5 overflow-hidden">
                    <div className="bg-gradient-brand h-full rounded-full" style={{ width: '94.2%' }} />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-green-600 shrink-0" /> 18 automated rules passing across ERP tables
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                    <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Table-Bound DPIA & PII</div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900 truncate">14 Tables</div>
                    <div className="text-[9px] sm:text-[10px] text-emerald-600 font-medium mt-1 truncate">100% Schema Linked</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                    <div className="text-[11px] sm:text-xs text-gray-500 mb-1">Living RoPA Inventory</div>
                    <div className="text-lg sm:text-xl font-bold text-[#5b2d6e] truncate">PDPA / GDPR</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-500 mt-1 truncate">Zero spreadsheets</div>
                  </div>
                </div>

                <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles size={14} className="text-[#5b2d6e]" />
                    <span className="text-xs font-bold text-[#5b2d6e]">AI Governance Recommendation</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    "Identified 42 duplicate Customer IDs between NetSuite and PostgreSQL. Golden record created with 98.4% match confidence."
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Continuous monitoring active
                  </span>
                  <span>Latency: 48ms</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 hidden sm:flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Shield size={16} className="text-emerald-700" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Table-Bound DPIA & RoPA</div>
                <div className="text-[10px] text-gray-500">Live DB table binding</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 hidden sm:flex items-center gap-2 animate-bounce" style={{ animationDuration: '5s' }}>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Brain size={16} className="text-[#5b2d6e]" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Natural Language SQL</div>
                <div className="text-[10px] text-gray-400">Plain English querying</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
