import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Server, 
  FileCheck2, 
  CheckCircle2, 
  FileText, 
  Cpu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp'

const securityPillars = [
  {
    icon: EyeOff,
    title: 'Zero Raw Data Stored',
    badge: 'Metadata Only',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'KaoinAI operates exclusively on schema metadata, column definitions, and statistical distributions. Your sensitive customer records and financial ledgers never leave your private database perimeter.'
  },
  {
    icon: Cpu,
    title: 'Zero AI Model Training',
    badge: 'Contractual Guarantee',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'We hold strict zero-data-retention enterprise SLAs. Your proprietary queries, table structures, and internal vocabulary are never stored or used to train or fine-tune public LLMs (OpenAI, Anthropic, or others).'
  },
  {
    icon: Lock,
    title: 'Bank-Grade Cryptography',
    badge: 'TLS 1.3 & AES-256',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'All telemetry and communications are encrypted with TLS 1.3 in transit. Any cached operational configuration is safeguarded with AES-256 at rest with automated key rotation.'
  },
  {
    icon: Server,
    title: 'VPC & Self-Hosted Ready',
    badge: 'Air-Gapped Option',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Need total data sovereignty? Deploy KaoinAI as an isolated container in your AWS, GCP, or Azure Virtual Private Cloud (VPC), or on-premise without external outbound data egress.'
  }
]

const complianceItems = [
  {
    name: 'Singapore PDPA & MAS TRM',
    description: 'Living Data Inventory (RoPA) & statutory DPIAs bound directly to physical database tables containing PII.',
    standard: 'Singapore Regulated'
  },
  {
    name: 'Malaysia PDPA (2024 Amendments)',
    description: 'Data Inventory & Register of Processing Activities (Daftar Pemprosesan Data Peribadi) mandated under JPDP.',
    standard: 'Malaysia JPDP'
  },
  {
    name: 'Indonesia UU PDP (No. 27/2022)',
    description: 'Inventaris Data Pribadi & Catatan Kegiatan Pemrosesan Data (Article 31 compliance) across local databases.',
    standard: 'Indonesia Sovereign'
  },
  {
    name: 'MAS TRM Guidelines',
    description: 'Monetary Authority of Singapore Technology Risk Management security baseline compliance & schema auditing.',
    standard: 'Financial Grade'
  },
  {
    name: 'EU GDPR Article 30',
    description: 'Automated Records of Processing Activities (RoPA) generated directly from live database schema metadata.',
    standard: 'Global Privacy'
  },
  {
    name: 'SOC 2 Type II Alignment',
    description: 'Strict audit trails, role-based access control (RBAC), and continuous vulnerability monitoring.',
    standard: 'Enterprise Ready'
  }
]

export default function SecurityTrust() {
  const handleWhitepaperClick = () => {
    trackEvent('click_security_whitepaper', { location: 'security_section' })
    const el = document.getElementById('cta')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <section id="security" className="py-16 sm:py-24 bg-slate-50/70 border-y border-purple-100/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5b2d6e]/10 border border-[#5b2d6e]/20 text-[#5b2d6e] text-xs font-semibold mb-4">
            <ShieldCheck size={15} />
            <span>Enterprise Trust & Privacy by Design</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Your Data Stays Yours. Never Stored. Never Trained On.
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We built KaoinAI specifically for security-conscious SME leaders, fintechs, and regulated operations who require enterprise AI without risking regulatory fines or confidential data leaks.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {securityPillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#5b2d6e] flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>Verified Architecture</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Compliance & Regulatory Framework Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5b2d6e] mb-1">
                <FileCheck2 size={16} /> Regulatory Alignment
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Built for Singapore PDPA & Global Standards
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl mt-1">
                Our governance blueprints map directly to statutory guidelines so your compliance and legal teams can approve pilots in days, not quarters.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleWhitepaperClick}
                variant="outline"
                className="text-xs sm:text-sm border-slate-300 hover:bg-slate-50 text-slate-700"
              >
                <FileText size={15} className="mr-1.5 text-purple-600" />
                Request Security Architecture Sheet
              </Button>
              <a
                href={getWhatsAppUrl('Hi KaoinAI, our security team has questions regarding your PDPA compliance and data architecture.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'security_section' })}
              >
                <span>Consult Security Architect</span>
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {complianceItems.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {item.standard}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Table-to-DPIA Architectural Anchor Callout */}
          <div className="mt-6 p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="text-[#5b2d6e] shrink-0" size={20} />
              <div className="text-xs sm:text-sm text-slate-800 font-medium">
                <span className="font-bold text-[#5b2d6e]">Table-Level DPIA Association: </span>
                Every DPIA and Data Inventory entry is directly anchored to your physical database schemas and tables containing PII—eliminating disconnected spreadsheets and manual audit panic.
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
              Live Schema Proof
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
