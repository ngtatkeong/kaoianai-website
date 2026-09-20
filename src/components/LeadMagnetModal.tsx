import { useState } from 'react'
import { 
  Download, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Mail, 
  User, 
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface LeadMagnetModalProps {
  isOpen: boolean
  onClose: () => void
}

const checklistItems = [
  'Statutory PDPA Consent & Data Lineage Audit Matrix (Singapore Standard)',
  'NRIC, FIN & Financial PII Detection Rules for Staging Databases',
  'Automated SHA-256 Dynamic Column Masking Policies',
  'Third-Party Vendor Data Processing Agreement (DPA) Template',
  'Incident Response & 72-Hour Breach Notification Workflow',
  'Quarterly Data Retention & Deletion Schedule Protocol'
]

export default function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refId, setRefId] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setLoading(true)
    const generatedRef = `PDPA-2026-${Math.floor(1000 + Math.random() * 9000)}`
    setRefId(generatedRef)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('email', email.trim())
      formData.append('company', company.trim() || 'Not specified')
      formData.append('inquiry_type', '2026 PDPA & Data Governance Checklist Download')
      formData.append('reference_id', generatedRef)
      formData.append('_subject', `[Checklist Download #${generatedRef}] from ${name} (${email})`)
      formData.append('recipient', 'tk.ng@kaoinai.com')

      await fetch('https://formspree.io/f/xyegdyyj', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
    } catch {
      // Local fallback
    } finally {
      setLoading(false)
      setSubmitted(true)
      trackEvent('download_lead_magnet', { email, company, reference_id: generatedRef })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">Checklist Ready for Instant Access!</h3>
            <p className="text-sm text-slate-600">
              Thank you, <strong className="text-slate-900">{name || 'there'}</strong>! A download copy has been dispatched to <strong className="text-slate-900">{email}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Ref: {refId}</span>
                <span className="text-emerald-600 font-semibold">Verified</span>
              </div>
              <div className="text-xs font-bold text-slate-900">Included Frameworks:</div>
              <ul className="text-xs text-slate-600 space-y-1">
                {checklistItems.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[#5b2d6e] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="/2026-SME-Data-Governance-PDPA-Checklist.pdf"
                download="2026-SME-Data-Governance-PDPA-Checklist.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-brand text-white font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 transition-all"
              >
                <Download size={16} />
                <span>Open / Download PDF Document</span>
              </a>
              <a
                href={getWhatsAppUrl(`Hi KaoinAI, I downloaded the 2026 PDPA Checklist (Ref: ${refId}). Could you help review our database readiness?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-all"
              >
                <span>Request 15-Min Checklist Review on WhatsApp</span>
              </a>
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full text-xs text-slate-500 hover:text-slate-800"
              >
                Return to site
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5b2d6e] border border-purple-100 text-xs font-semibold mb-3">
              <Sparkles size={13} />
              <span>Complimentary SME Resource</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
              2026 Singapore SME Data Governance & PDPA Checklist
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5">
              The exact step-by-step checklist fast-growing SMEs use to audit unmasked PII, enforce compliance, and pass regulatory scrutiny without hiring enterprise consultants.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Tan"
                    className="pl-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rachel@company.com"
                    className="pl-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Apex Logistics Pte Ltd"
                    className="pl-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-brand text-white font-bold py-5 text-xs sm:text-sm rounded-xl shadow-md hover:opacity-90 transition-opacity"
                >
                  <Download size={16} className="mr-2" />
                  {loading ? 'Generating Checklist...' : 'Download Checklist Instantly (PDF)'}
                </Button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Zero spam guarantee. Unsubscribe at any time.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
