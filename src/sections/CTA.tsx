import { useState } from 'react'
import { ArrowRight, Mail, CheckCircle2, Calendar, Sparkles, FileText, Server, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '@/lib/whatsapp'
import LeadMagnetModal from '@/components/LeadMagnetModal'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [deploymentType, setDeploymentType] = useState<'onprem' | 'cloud'>('onprem')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refId, setRefId] = useState('')
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setLoading(true)
    const generatedRef = `PILOT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    setRefId(generatedRef)

    try {
      const formData = new FormData()
      formData.append('email', email.trim())
      formData.append('_replyto', email.trim())
      formData.append('deployment_mode', deploymentType === 'onprem' ? 'On-Premises / Private VPC (14-Day Free Trial)' : 'Managed Cloud SaaS (Dedicated Cloud Instance - Paid / Founding Cohort)')
      formData.append('inquiry_type', deploymentType === 'onprem' ? '14-Day Free Pilot Activation (On-Premises / VPC)' : 'Managed Cloud SaaS Enterprise Inquiry')
      formData.append('reference_id', generatedRef)
      formData.append('_subject', `[${deploymentType === 'onprem' ? '14-Day Free On-Prem Pilot' : 'Managed Cloud SaaS'}] Request #${generatedRef} from ${email.trim()}`)
      formData.append('recipient', 'tk.ng@kaoinai.com')

      await fetch('https://formspree.io/f/xyegdyyj', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
    } catch {
      // Graceful fallback: lead is acknowledged locally with refId
    } finally {
      setLoading(false)
      setSubmitted(true)
      trackEvent('submit_lead', { email, source: 'cta_form', reference_id: generatedRef, deployment_mode: deploymentType })
    }
  }

  return (
    <section id="cta" className="py-16 sm:py-24 bg-gradient-to-br from-purple-100 via-white to-purple-50 relative overflow-hidden scroll-mt-20">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold mb-6">
          <Sparkles size={14} className="text-purple-500" />
          <span>Enterprise Security • Singapore PDPA &amp; MAS TRM Compliant</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-purple-950 mb-4 sm:mb-6 tracking-tight">
          Ready to Automate Your Data Governance?
        </h2>
        <p className="text-sm sm:text-lg text-purple-900/70 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          Join engineering and compliance leaders who trust KaoinAI to automate table-bound DPIAs, detect schema drift, and eliminate PII exposure in under 48 hours.
        </p>

        {/* Free trial exclusivity badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold mb-6">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span>14-Day Free Evaluation Trial: Exclusively for Self-Hosted On-Prem / VPC (Cloud is dedicated paid SaaS)</span>
        </div>

        {submitted ? (
          <div className="max-w-md mx-auto bg-white backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-green-200 text-purple-950 shadow-lg shadow-purple-100 animate-fade-in text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl font-bold">
              {deploymentType === 'onprem' ? '14-Day Free On-Prem Trial Logged!' : 'Managed Cloud Request Logged!'}
            </h3>
            <p className="text-sm text-purple-900/70">
              We have acknowledged your registration for <strong className="text-purple-950">{email}</strong> ({deploymentType === 'onprem' ? 'On-Premises / Private VPC' : 'Managed Cloud SaaS'}).
            </p>
            <div className="inline-block px-3 py-1.5 rounded-lg bg-purple-50 text-xs font-mono font-bold text-purple-700 border border-purple-200">
              Ref ID: {refId}
            </div>
            <p className="text-xs text-purple-900/60 pt-1">
              Need immediate onboarding support?
            </p>
            <a
              href={getWhatsAppUrl(`Hi KaoinAI, I just requested a ${deploymentType === 'onprem' ? '14-day free on-premises trial' : 'managed cloud deployment'} (Ref: ${refId}) for ${email}. Could you assist with onboarding?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>Chat Directly on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Deployment selector toggle */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto bg-white/80 p-1.5 rounded-2xl border border-purple-200 text-xs shadow-xs">
              <button
                type="button"
                onClick={() => setDeploymentType('onprem')}
                className={`flex-1 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                  deploymentType === 'onprem'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                <Server size={14} />
                <span>On-Prem / Private VPC</span>
                <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded-md">
                  14-Day Free Trial
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDeploymentType('cloud')}
                className={`flex-1 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold transition-all cursor-pointer ${
                  deploymentType === 'cloud'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-purple-700 hover:text-purple-950'
                }`}
              >
                <Cloud size={14} />
                <span>Managed Cloud (SaaS)</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.5 rounded-md">
                  Paid / $0 Cohort
                </span>
              </button>
            </div>

            {/* Explanatory note based on selected deployment */}
            <div className="text-xs max-w-lg mx-auto">
              {deploymentType === 'onprem' ? (
                <p className="text-emerald-800 font-medium">
                  ✨ <strong>On-Premises / VPC:</strong> Includes 14-day free evaluation trial in your own Docker/Kubernetes environment. Zero data egress, no credit card required.
                </p>
              ) : (
                <p className="text-purple-800 font-medium">
                  ☁️ <strong>Managed Cloud:</strong> Dedicated AWS Singapore cluster with backups &amp; SLA. <em>(Free trial is on-prem only; Cloud is available as paid plan or via Founding Cohort slot.)</em>
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-lg mx-auto">
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email (e.g. name@company.com)"
                  className="pl-11 py-5 sm:py-6 bg-white border-purple-200 text-purple-950 placeholder:text-purple-400/70 w-full focus:ring-2 focus:ring-purple-400 focus:border-transparent rounded-xl text-base sm:text-sm shadow-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="bg-purple-600 text-white hover:bg-purple-700 transition-colors px-8 py-5 sm:py-6 text-sm font-semibold whitespace-nowrap group w-full sm:w-auto rounded-xl shadow-lg shadow-purple-200"
              >
                {loading ? 'Initiating...' : (deploymentType === 'onprem' ? 'Deploy 14-Day Free Trial' : 'Inquire Managed Cloud')}
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-purple-900/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-600" /> Free trial strictly On-Prem / VPC
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-600" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-green-600" /> Zero raw data stored
              </span>
            </div>

            {/* Lead Magnet Callout Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-purple-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-purple-950">
                    Not ready for a software pilot today?
                  </div>
                  <div className="text-xs text-purple-900/70">
                    Download our complimentary <strong>2026 Singapore SME Data Governance & PDPA Checklist</strong>.
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  trackEvent('open_lead_magnet_modal', { source: 'cta_card' })
                  setLeadMagnetOpen(true)
                }}
                className="text-xs font-semibold border-purple-300 text-purple-700 hover:text-purple-800 hover:bg-purple-100 shrink-0"
              >
                Get Free Checklist (PDF)
              </Button>
            </div>

            <div className="pt-6 border-t border-purple-200/70 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-purple-900/60">
              <a
                href={getWhatsAppUrl('Hi KaoinAI, I have an enquiry about your data governance platform.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold"
                onClick={(e) => {
                  e.currentTarget.href = getWhatsAppUrl('Hi KaoinAI, I have an enquiry about your data governance platform.')
                  trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'cta_section' })
                }}
              >
                <span>💬 WhatsApp Us: <strong>{WHATSAPP_DISPLAY}</strong></span>
              </a>
              <span className="hidden sm:inline text-purple-300">•</span>
              <a
                href="mailto:sales@kaoinai.com?subject=KaoinAI%20Architecture%20Demo%20Request"
                className="inline-flex items-center gap-1.5 text-purple-700 hover:text-purple-900 font-medium underline underline-offset-4"
                onClick={() => trackEvent('click_cta', { location: 'footer', label: 'Book Demo via Email' })}
              >
                <Calendar size={14} />
                Book a 15-Minute Live Demo
              </a>
            </div>
          </div>
        )}
      </div>

      <LeadMagnetModal
        isOpen={leadMagnetOpen}
        onClose={() => setLeadMagnetOpen(false)}
      />
    </section>
  )
}
