import { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/analytics'

interface AnnouncementBarProps {
  onDismiss?: () => void
}

export default function AnnouncementBar({ onDismiss }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const handleCtaClick = () => {
    trackEvent('click_announcement', { label: 'Design Partner Program' })
    const el = document.getElementById('pricing')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <aside aria-label="Announcement" className="bg-slate-900 text-slate-300 text-xs sm:text-sm py-2 px-3 sm:px-4 relative z-50 border-b border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-grow justify-center text-center flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300 text-[11px] font-semibold">
            <Sparkles size={11} className="text-purple-300" />
            <span>Design Partner Program</span>
          </span>
          <span className="text-slate-300 text-xs sm:text-sm">
            Complimentary architecture setup &amp; 6-month Growth licensing for 3 founding enterprise teams.
          </span>
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1 font-semibold text-white hover:text-purple-300 cursor-pointer transition-colors text-xs sm:text-sm group ml-1"
          >
            <span>Learn More</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <span className="hidden md:inline text-slate-700">|</span>
          <a
            href={getWhatsAppUrl('Hi KaoinAI team, I would like to learn more about the Design Partner Program for enterprise teams.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 font-medium text-xs sm:text-sm transition-colors"
            onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'announcement_bar' })}
          >
            <span>Speak with Solutions Architect</span>
          </a>
        </div>
        <button
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
          aria-label="Dismiss announcement"
          className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  )
}
