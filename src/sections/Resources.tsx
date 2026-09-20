import { 
  FileText, 
  Download, 
  BookOpen, 
  CheckCircle2,
  FileCheck
} from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp'

interface ResourceItem {
  id: string
  title: string
  subtitle: string
  category: string
  badgeColor: string
  fileSize: string
  fileName: string
  fileUrl: string
  description: string
  highlights: string[]
}

const resources: ResourceItem[] = [
  {
    id: 'pdpa-checklist',
    title: '2026 Singapore SME Data Governance & PDPA Readiness Checklist',
    subtitle: 'Statutory compliance audit guide for Singapore SMEs and regional entities.',
    category: 'Regulatory Checklist',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    fileSize: '15.4 KB PDF',
    fileName: '2026-SME-Data-Governance-PDPA-Checklist.pdf',
    fileUrl: '/downloads/2026-SME-Data-Governance-PDPA-Checklist.pdf',
    description: 'The complete practical audit protocol covering consent lifecycle management, staging database sanitization, and automated SHA-256 masking policies.',
    highlights: [
      'Singapore PDPA consent & data retention matrix',
      'NRIC & financial PII regex detection table',
      'Automated dynamic column masking rules',
      'Mandatory 72-hour breach response workflow'
    ]
  },
  {
    id: 'ai-handbook',
    title: '2026 Data Governance & AI Readiness Handbook',
    subtitle: 'Step-by-step blueprint for deploying AI data intelligence across dirty schemas.',
    category: 'Architecture Guide',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    fileSize: '15.4 KB PDF',
    fileName: '2026-Data-Governance-AI-Readiness-Handbook.pdf',
    fileUrl: '/downloads/2026-Data-Governance-AI-Readiness-Handbook.pdf',
    description: 'A comprehensive field guide showing engineering and business leaders how to unify fragmented databases, eliminate data drift, and establish golden records.',
    highlights: [
      'Multi-source entity resolution (Shopify, CRM, ERP)',
      'Sub-second schema discovery & cataloging',
      'Preventing hallucinations in business SQL queries',
      'Zero-data-retention security architecture'
    ]
  },
  {
    id: 'economic-report',
    title: 'The SME Data Inequality Gap: AI Democratization Report',
    subtitle: 'Peer-reviewed research paper on enterprise software cost parity (WP-2026-04).',
    category: 'Industry Research',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    fileSize: '14.0 KB PDF',
    fileName: '2026-SME-Data-Governance-AI-Democratization-Report.pdf',
    fileUrl: '/downloads/2026-SME-Data-Governance-AI-Democratization-Report.pdf',
    description: 'Empirical analysis exploring how enterprise tools extract $250k+/year in consulting retainers, and how autonomous AI levels the playing field for growing businesses.',
    highlights: [
      'Cost comparison: Enterprise vendors vs. AI SaaS',
      'Hidden labor waste in manual spreadsheet reporting',
      'ROI benchmarking across 50+ Singapore SMEs',
      'Roadmap for sub-15-minute time-to-value'
    ]
  }
]

export default function Resources() {
  const handleDownload = (res: ResourceItem) => {
    trackEvent('download_lead_magnet', {
      email: 'direct_download',
      company: 'website_visitor',
      reference_id: res.id
    })
  }

  return (
    <section id="resources" className="py-16 sm:py-24 bg-white border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-xs font-semibold mb-4">
            <BookOpen size={14} />
            <span>Free SME Knowledge Base • Instant PDF Downloads</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Downloadable Data Governance & PDPA Guides
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            No gates. No mandatory phone calls. Download our authoritative field manuals, statutory checklists, and research reports compiled directly by our engineering leads.
          </p>
        </div>

        {/* 3 Prominent PDF Resource Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                {/* Category & File Info Header */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${res.badgeColor}`}>
                    {res.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                    {res.fileSize}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                      {res.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                  {res.description}
                </p>

                {/* Highlights */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Key Topics Covered:
                  </span>
                  {res.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <a
                  href={res.fileUrl}
                  download={res.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleDownload(res)}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-brand text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all"
                >
                  <Download size={15} />
                  <span>Download PDF Document</span>
                </a>
                <a
                  href={getWhatsAppUrl(`Hi KaoinAI, I downloaded the "${res.title}" and would like to ask a question about implementing it in our company.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'resource_card' })}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs border border-green-200 transition-colors"
                >
                  <span>Ask Data Engineer on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-purple-50 p-6 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-[#5b2d6e] flex items-center justify-center shrink-0">
              <FileCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Need a customized data architecture evaluation?
              </h4>
              <p className="text-xs text-slate-600">
                Book a complimentary 15-minute architecture review with our data leads on WhatsApp.
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hi KaoinAI, I would like to schedule a 15-minute architecture review for our company data setup.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0"
            onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'resource_bottom_bar' })}
          >
            <span>WhatsApp Architecture Review</span>
          </a>
        </div>
      </div>
    </section>
  )
}
