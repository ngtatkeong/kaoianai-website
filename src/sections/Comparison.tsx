import { Check, X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface ComparisonRow {
  feature: string
  description: string
  kaoinai: {
    highlight: string
    positive: boolean
  }
  legacy: {
    text: string
    positive: boolean
  }
  manual: {
    text: string
    positive: boolean
  }
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Time to Value & Setup',
    description: 'How long before you see your first data health scan and lineage map?',
    kaoinai: {
      highlight: '< 15 Minutes (Instant schema discovery)',
      positive: true
    },
    legacy: {
      text: '3 to 9 Months (Requires external system integrators)',
      positive: false
    },
    manual: {
      text: 'Never finished (Continuous maintenance debt)',
      positive: false
    }
  },
  {
    feature: 'Annual Total Cost of Ownership',
    description: 'Licensing, infrastructure, and required consulting hours',
    kaoinai: {
      highlight: '$3,840 – $11,880 / yr ($320–$990/mo) • Setup fee waived on annual',
      positive: true
    },
    legacy: {
      text: '$30,000 – $100,000+ / yr commit plus $25,000 consulting retainers',
      positive: false
    },
    manual: {
      text: 'Hidden $60k+ in wasted developer & analyst hours every quarter',
      positive: false
    }
  },
  {
    feature: 'User Accessibility',
    description: 'Who in your company can extract answers and audit data?',
    kaoinai: {
      highlight: 'Plain English for Everyone (Ops, Product, Execs)',
      positive: true
    },
    legacy: {
      text: 'Certified Data Architects & Engineers only',
      positive: false
    },
    manual: {
      text: 'Fragmented spreadsheets with copy-paste errors',
      positive: false
    }
  },
  {
    feature: 'Automated Lineage & Tracing',
    description: 'Track where columns originate and where they are consumed',
    kaoinai: {
      highlight: 'Real-time AI-Synthesized Lineage Graph',
      positive: true
    },
    legacy: {
      text: 'Complex manual rule mappings & YAML scripts',
      positive: false
    },
    manual: {
      text: 'Stale diagrams in Confluence or nonexistent',
      positive: false
    }
  },
  {
    feature: 'Singapore PDPA & PII Protection',
    description: 'Scanning sensitive columns and applying compliance masking',
    kaoinai: {
      highlight: 'Automated Scanner & Dynamic SHA-256 Masking',
      positive: true
    },
    legacy: {
      text: 'Heavy compliance add-on module with extra license',
      positive: false
    },
    manual: {
      text: 'Severe exposure risk to statutory PDPA fines',
      positive: false
    }
  },
  {
    feature: 'DPIA & Data Inventory Storage',
    description: 'How DPIAs and living Data Inventories (RoPA) are linked and stored',
    kaoinai: {
      highlight: 'Bound Directly to Database Tables (Real-time schema sync, automated drift alerts)',
      positive: true
    },
    legacy: {
      text: 'Disconnected surveys & static portals (Decoupled from physical database schemas)',
      positive: false
    },
    manual: {
      text: 'Outdated Excel spreadsheets forgotten until an audit or breach occurs',
      positive: false
    }
  },
  {
    feature: 'Data Privacy & LLM Isolation',
    description: 'Guarantees that your data is not stored or used to train models',
    kaoinai: {
      highlight: 'Zero Raw Data Stored • Zero Model Training',
      positive: true
    },
    legacy: {
      text: 'Varies; complex multi-tenant cloud storage',
      positive: false
    },
    manual: {
      text: 'Unencrypted CSV files passed over Slack and email',
      positive: false
    }
  },
  {
    feature: 'Support & Onboarding Experience',
    description: 'Getting help when you have an urgent architecture question',
    kaoinai: {
      highlight: 'Direct WhatsApp & Slack Dedicated Data Lead',
      positive: true
    },
    legacy: {
      text: 'Tiered ticket queues with 24–48hr SLA responses',
      positive: false
    },
    manual: {
      text: 'Internal developers get interrupted repeatedly',
      positive: false
    }
  }
]

export default function Comparison() {
  const handleScrollToCta = () => {
    trackEvent('click_comparison_cta', { location: 'comparison_section' })
    const el = document.getElementById('cta')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section id="compare" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-xs font-semibold mb-4">
            <Sparkles size={14} />
            <span>Honest Evaluation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Why Growing Businesses Choose KaoinAI
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Enterprise governance capability without the six-figure price tag, six-month consulting engagements, or fragile spreadsheet chaos.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-6 text-sm font-bold text-slate-700 w-1/4">
                    Capability / Dimension
                  </th>
                  <th className="p-4 sm:p-6 text-sm font-extrabold text-[#5b2d6e] bg-purple-50/60 w-1/3 border-x border-purple-200/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5b2d6e]" />
                      <span>KaoinAI</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#5b2d6e] text-white px-2 py-0.5 rounded-full ml-auto">
                        Recommended
                      </span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-6 text-sm font-bold text-slate-700 w-1/4">
                    Atlan, Alation & Collibra <span className="block text-xs font-normal text-slate-400">($30k–$100k+/yr enterprise commit)</span>
                  </th>
                  <th className="p-4 sm:p-6 text-sm font-bold text-slate-700 w-1/4">
                    Manual Spreadsheets <span className="block text-xs font-normal text-slate-400">(& In-house Python scripts)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:p-6 font-medium text-slate-900">
                      <div className="font-bold text-slate-900 text-sm mb-1">{row.feature}</div>
                      <div className="text-xs text-slate-500">{row.description}</div>
                    </td>

                    {/* KaoinAI column */}
                    <td className="p-4 sm:p-6 bg-purple-50/30 border-x border-purple-200/40 font-semibold text-slate-900">
                      <div className="flex items-start gap-2 text-purple-950">
                        <Check size={18} className="text-[#5b2d6e] shrink-0 mt-0.5" />
                        <span>{row.kaoinai.highlight}</span>
                      </div>
                    </td>

                    {/* Legacy column */}
                    <td className="p-4 sm:p-6 text-slate-600">
                      <div className="flex items-start gap-2">
                        <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <span>{row.legacy.text}</span>
                      </div>
                    </td>

                    {/* Manual column */}
                    <td className="p-4 sm:p-6 text-slate-600">
                      <div className="flex items-start gap-2">
                        <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                        <span>{row.manual.text}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-purple-50/80 border border-purple-100 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-[#5b2d6e] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Try KaoinAI risk-free for 14 days on your actual schema
              </h4>
              <p className="text-xs text-slate-600">
                No credit card required • Zero raw data stored • Fully verified in 15 minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              onClick={handleScrollToCta}
              className="bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              Deploy 14-Day Pilot
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
            <a
              href={getWhatsAppUrl('Hi KaoinAI, I saw your comparison with legacy tools. How does your pricing compare for our setup?')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Consult Solutions Architect</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
