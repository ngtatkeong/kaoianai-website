import { 
  ArrowRight, 
  Quote, 
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface CaseStudy {
  company: string
  industry: string
  logoText: string
  headlineMetric: string
  metricLabel: string
  challenge: string
  solution: string
  results: string[]
  quote: string
  author: string
  role: string
}

const caseStudies: CaseStudy[] = [
  {
    company: 'NextPay Technologies',
    industry: 'Fintech & Payment Gateway',
    logoText: 'NextPay',
    headlineMetric: '92% Faster',
    metricLabel: 'MAS Compliance Audit Prep',
    challenge: 'Quarterly compliance audits required 3 data engineers spending 3 full weeks manually tracing transaction lineages across Stripe, PostgreSQL, and AWS S3 ledgers.',
    solution: 'Deployed KaoinAI to autonomously index schema metadata and build real-time column lineage graphs with continuous PII scanning.',
    results: [
      'Audit report generation compressed from 15 business days to 4 hours',
      'Identified and masked 14 legacy developer endpoints exposing customer NRICs',
      'Zero non-compliance flags during annual MAS technology review'
    ],
    quote: 'KaoinAI turned our quarterly regulatory audit nightmare into a one-click automated report. The automated lineage alone saved us hundreds of engineering hours.',
    author: 'Darren K.',
    role: 'Head of Engineering & Compliance'
  },
  {
    company: 'UrbanCart Commerce',
    industry: 'Omnichannel Retail (50K+ SKUs)',
    logoText: 'UrbanCart',
    headlineMetric: '18 hrs/wk',
    metricLabel: 'Saved in Manual Ops Reporting',
    challenge: 'Operations and marketing teams had to wait 3 to 5 days for custom SQL queries to reconcile inventory counts between Shopify, warehouse WMS, and TikTok Shop.',
    solution: 'Empowered non-technical business teams with KaoinAI’s plain-English query engine and automated golden product master records.',
    results: [
      'Over 18 hours per week saved for senior business analysts',
      'Inventory reconciliation errors reduced by 87% within the first 30 days',
      'Eliminated stockout blind spots across 4 regional fulfillment centers'
    ],
    quote: 'Our inventory managers now ask questions in simple conversational English and get verified SQL answers in seconds without ever tapping our data engineering team.',
    author: 'Rachel T.',
    role: 'VP of E-Commerce Operations'
  },
  {
    company: 'MediSync Asia',
    industry: 'Digital Health & Telemedicine',
    logoText: 'MediSync',
    headlineMetric: '100% Pass',
    metricLabel: 'Zero PII Leaks Across 12 Clinics',
    challenge: 'Scaling doctor-patient consultation portals created an urgent risk of patient health identifiers slipping into staging databases and analytics dashboards.',
    solution: 'Implemented KaoinAI Privacy Shield to enforce autonomous metadata scanning and automated dynamic SHA-256 masking rules across all 12 database clusters.',
    results: [
      'Over 45,000 historical patient records audited and protected in under 48 hours',
      'Zero sensitive data transferred to third-party AI models',
      'Full compliance with Singapore PDPA and MOH telemedicine guidelines'
    ],
    quote: 'The deciding factor was KaoinAI’s zero-raw-data retention guarantee. We get the intelligence of generative AI without exposing a single patient record.',
    author: 'Dr. Aaron Lim',
    role: 'Chief Medical & Technology Officer'
  }
]

export default function CaseStudies() {
  const handleScrollToCta = () => {
    trackEvent('click_case_study_cta', { location: 'case_studies_section' })
    const el = document.getElementById('cta')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section id="case-studies" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-xs font-semibold mb-4">
            <Sparkles size={14} />
            <span>Proven Customer Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Enterprise Deployments. Measurable Architectural ROI.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            See how regulated enterprises and agile engineering teams eliminate compliance drift and automate governance with KaoinAI.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                {/* Industry & Badge */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                    {study.industry}
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {study.company}
                  </span>
                </div>

                {/* Hero Metric */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 to-slate-50 border border-purple-100/80">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#5b2d6e] tracking-tight">
                    {study.headlineMetric}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                    {study.metricLabel}
                  </div>
                </div>

                {/* The Challenge & Solution */}
                <div className="space-y-3 mb-6 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">The Challenge:</span>
                    <p className="text-slate-600 leading-relaxed">{study.challenge}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">The KaoinAI Solution:</span>
                    <p className="text-slate-600 leading-relaxed">{study.solution}</p>
                  </div>
                </div>

                {/* Bullet Results */}
                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Outcomes:</span>
                  {study.results.map((res, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial Quote */}
              <div className="pt-5 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 sm:p-6 rounded-b-3xl mt-4">
                <Quote size={20} className="text-[#5b2d6e]/40 mb-2" />
                <p className="text-xs sm:text-sm text-slate-700 italic mb-3 leading-relaxed">
                  &ldquo;{study.quote}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{study.author}</div>
                  <div className="text-[11px] text-slate-500">{study.role} • {study.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Ready to achieve similar results for your company?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Get an automated data health audit on your database schema in under 15 minutes during your free 14-day pilot.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={handleScrollToCta}
              size="lg"
              className="bg-gradient-brand text-white font-semibold text-xs sm:text-sm px-6 py-5 rounded-xl shadow-lg hover:opacity-90"
            >
              Start Free 14-Day Pilot
              <ArrowRight size={15} className="ml-1.5" />
            </Button>
            <a
              href={getWhatsAppUrl('Hi KaoinAI, I would like to explore a pilot tailored to our industry.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>Discuss via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
