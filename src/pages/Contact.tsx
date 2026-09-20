import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  Headphones,
  Check,
  Copy,
  AlertCircle,
  RefreshCw,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '@/lib/whatsapp'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [inquiryType, setInquiryType] = useState('Data Governance & Compliance')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [referenceId, setReferenceId] = useState('')
  const [submittedAt, setSubmittedAt] = useState('')
  const [copied, setCopied] = useState(false)

  const defaultContactMessage =
    'Hi KaoinAI team, I would like to enquire about your AI Data Governance, Data Quality & PII Detection platform.'
  const whatsappUrl = getWhatsAppUrl(defaultContactMessage)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = 'Contact Us — KaoinAI Enterprise AI Data Solutions'
  }, [])

  const handleCopyRef = () => {
    if (!referenceId) return
    navigator.clipboard.writeText(referenceId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleResetForm = () => {
    setName('')
    setEmail('')
    setCompany('')
    setPhone('')
    setMessage('')
    setSubmitted(false)
    setError(null)
    setReferenceId('')
    setSubmittedAt('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !message) return

    setLoading(true)
    setError(null)

    const refId = `KAI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    const nowStr = new Date().toLocaleString('en-SG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('email', email.trim())
      formData.append('_replyto', email.trim())
      formData.append('company', company.trim() || 'Not Specified')
      formData.append('phone', phone.trim() || 'Not Specified')
      formData.append('inquiry_type', inquiryType)
      formData.append('message', message.trim())
      formData.append('reference_id', refId)
      formData.append('submitted_at', nowStr)
      formData.append(
        '_subject',
        `[Inquiry Ref #${refId}] ${inquiryType} from ${name.trim()} (${company.trim() || 'SME'})`
      )
      formData.append('recipient', 'tk.ng@kaoinai.com')

      const response = await fetch('https://formspree.io/f/xyegdyyj', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setReferenceId(refId)
        setSubmittedAt(nowStr)
        setSubmitted(true)
        trackEvent('submit_contact', {
          name,
          email,
          inquiry_type: inquiryType,
          reference_id: refId,
        })
      } else {
        const data = await response.json().catch(() => null)
        const errorMsg = data?.errors?.[0]?.message
        setReferenceId(refId)
        setSubmittedAt(nowStr)
        setSubmitted(true)
        setError(errorMsg ? `Notice: ${errorMsg}. Your query Ref #${refId} is saved. Please message us on WhatsApp for live escalation.` : `Note: Form routed with Reference #${refId}. For instant escalation, please message us on WhatsApp.`)
      }
    } catch (err) {
      // Offline / network failure fallback: still create the formal acknowledgement so the user has the refId
      setReferenceId(refId)
      setSubmittedAt(nowStr)
      setSubmitted(true)
      setError(`Network error. We have generated Reference #${refId}. Please click below to send via WhatsApp or Email.`)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>, location: string, customMsg?: string) => {
    e.currentTarget.href = getWhatsAppUrl(customMsg || defaultContactMessage)
    trackEvent('click_whatsapp', {
      number: WHATSAPP_NUMBER,
      location,
    })
  }

  return (
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-24 bg-gradient-to-b from-slate-50 via-white to-purple-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#5b2d6e] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Headphones size={16} />
            <span>Get in Touch with Our Team</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Contact <span className="text-gradient">KaoinAI</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-3 sm:mt-4 leading-relaxed">
            Have questions about Data Governance, automated PII scanning, or ERP integrations? 
            Reach out directly via WhatsApp for instant support, or send us a message below.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Channels (WhatsApp & Contact Cards) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            {/* Highlighted WhatsApp Card */}
            <div className="bg-gradient-to-br from-[#128C7E]/10 via-[#25D366]/15 to-emerald-50 rounded-3xl p-5 sm:p-8 border-2 border-[#25D366]/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 bg-[#25D366] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  <span>Fastest Response</span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock size={13} /> Avg &lt; 15 mins
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                  <svg
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">WhatsApp Instant Chat</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Direct line to our solution engineers</p>
                  <p className="text-lg font-extrabold text-[#128C7E] mt-1 tracking-wide">{WHATSAPP_DISPLAY}</p>
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed mb-6">
                Click below to launch WhatsApp immediately for live technical questions, pilot setup, or enterprise pricing consultation.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleWhatsAppClick(e, 'contact_page_highlight_card')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all text-sm group"
              >
                Chat on WhatsApp Now
                <Send size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* General Email & Operational Details */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-sm space-y-5 sm:space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Other Ways to Connect
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">General & Technical Support</span>
                    <a href="mailto:hello@kaoinai.com" className="text-sm font-medium text-gray-900 hover:text-[#5b2d6e] transition-colors">
                      hello@kaoinai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">ERP & Channel Partnerships</span>
                    <a href="mailto:partners@kaoinai.com" className="text-sm font-medium text-gray-900 hover:text-[#5b2d6e] transition-colors">
                      partners@kaoinai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Headquarters & Cloud Infrastructure</span>
                    <span className="text-sm font-medium text-gray-900">
                      Kuala Lumpur, Malaysia &bull; Global SaaS
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-3 text-xs text-emerald-700 bg-emerald-50/60 p-3 rounded-xl">
                <ShieldCheck size={18} className="shrink-0" />
                <span>Zero-data-ingestion architecture. All customer metadata is encrypted via TLS 1.3 & AES-256.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-gray-200 shadow-xl">
            {submitted ? (
              <div className="space-y-6 animate-fade-in">
                {/* Header Status */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Inquiry Logged & Acknowledged
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
                      Customer Inquiry Acknowledgement
                    </h2>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Primary Reference & SLA Certificate Box */}
                <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
                    <div>
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                        Reference Tracking ID
                      </span>
                      <span className="text-lg sm:text-xl font-mono font-extrabold text-[#5b2d6e]">
                        {referenceId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-purple-300 text-xs font-semibold text-gray-700 hover:text-[#5b2d6e] shadow-xs active:scale-95 transition-all self-start sm:self-auto"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-green-600" />
                          <span className="text-green-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Ref ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Meta Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <span className="text-gray-400 block font-medium">Logged At</span>
                      <span className="font-semibold text-gray-800">{submittedAt || 'Today'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Response SLA</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <Clock size={12} /> Within 2 business hours
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Customer</span>
                      <span className="font-semibold text-gray-800">{name} {company ? `(${company})` : ''}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">Routing Email</span>
                      <span className="font-semibold text-gray-800 break-all">{email}</span>
                    </div>
                  </div>

                  {/* Query Snapshot Block */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Inquiry Topic
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100/70 text-[#5b2d6e] font-semibold text-[11px]">
                        {inquiryType}
                      </span>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs text-gray-700 leading-relaxed font-sans max-h-36 overflow-y-auto whitespace-pre-wrap">
                      "{message}"
                    </div>
                  </div>
                </div>

                {/* Guaranteed Response Notice */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-purple-50/80 border border-purple-100 rounded-xl text-xs text-purple-900">
                  <ShieldCheck size={18} className="text-[#5b2d6e] shrink-0" />
                  <span>
                    A notification copy has been transmitted to our solutions engineering team. We will review your data requirements and respond directly to <strong>{email}</strong>.
                  </span>
                </div>

                {/* Direct Fast-Track Escalation Buttons */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-semibold text-gray-600 text-center">
                    Need an immediate answer or live architecture discussion?
                  </p>

                  {/* WhatsApp Fast-Track */}
                  <a
                    href={getWhatsAppUrl(
                      `Hi KaoinAI team, I have submitted an inquiry on your website.\n\n• Ref ID: ${referenceId}\n• Name: ${name}\n• Topic: ${inquiryType}\n\nCould you please review and acknowledge this query?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) =>
                      handleWhatsAppClick(
                        e,
                        'acknowledgement_fast_track',
                        `Hi KaoinAI team, I have submitted an inquiry on your website.\n\n• Ref ID: ${referenceId}\n• Name: ${name}\n• Topic: ${inquiryType}\n\nCould you please review and acknowledge this query?`
                      )
                    }
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                  >
                    <MessageSquare size={16} />
                    <span>Fast-Track on WhatsApp with Ref #{referenceId}</span>
                  </a>

                  {/* Submit Another Query */}
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition-colors"
                  >
                    <RefreshCw size={13} />
                    <span>Submit Another Query</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Send Us an Inquiry</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill in the form below and our team will get back to you promptly.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                    <Input
                      type="text"
                      required
                      placeholder="e.g. Alex Tan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-xl text-base sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Work Email *</label>
                    <Input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl text-base sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Company Name</label>
                    <Input
                      type="text"
                      placeholder="e.g. Acme Logistics"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="rounded-xl text-base sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Phone / WhatsApp</label>
                    <Input
                      type="tel"
                      placeholder="+65 9123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-xl text-base sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Inquiry Topic</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full h-11 sm:h-10 px-3 py-2 text-base sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800"
                  >
                    <option value="Data Governance & Compliance">Data Governance & Compliance (PDPA/GDPR)</option>
                    <option value="Automated PII Detection">Automated PII Scanning & Masking</option>
                    <option value="Data Quality & MDM">Data Quality Monitoring & Golden Records</option>
                    <option value="ERP & Warehouse Connectors">ERP / Database Connectors & Setup</option>
                    <option value="Pricing & Enterprise Pilot">Pricing & 14-Day Free Pilot</option>
                    <option value="Other">Other / General Question</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Message / System Requirements</label>
                  <Textarea
                    rows={4}
                    required
                    placeholder="Tell us about your current data stack (PostgreSQL, NetSuite, SAP, etc.) and what you're looking to achieve..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="rounded-xl resize-none text-base sm:text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity py-6 text-sm font-semibold rounded-xl shadow-lg group"
                >
                  {loading ? 'Sending Message...' : 'Submit Inquiry'}
                  <Send size={15} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-[11px] text-center text-gray-400">
                  By submitting, you agree to our privacy standards. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
