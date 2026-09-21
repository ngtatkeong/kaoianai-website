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
    trackEvent('click_announcement', { label: 'Architecture Release' })
    const el = document.getElementById('demo')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-purple-50 via-indigo-50/70 to-purple-50 text-slate-800 text-xs sm:text-sm py-2 px-3 sm:px-4 relative z-50 border-b border-purple-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-grow justify-center text-center flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 border border-purple-200 text-purple-800 text-[11px] font-semibold shadow-xs">
            <Sparkles size={11} className="text-purple-600" />
            <span>Architecture Release</span>
          </span>
          <span className="text-slate-700 text-xs sm:text-sm">
            Table-Bound Living Data Inventory (RoPA) Engine now supports Singapore PDPA, Malaysia PDPA (2024), &amp; Indonesia UU PDP.
          </span>
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1 font-semibold text-purple-700 hover:text-purple-950 cursor-pointer transition-colors text-xs sm:text-sm group ml-1 underline decoration-purple-300 hover:decoration-purple-700 underline-offset-2"
          >
            <span>Explore Architecture</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-purple-700" />
          </button>
          <span className="hidden md:inline text-purple-200">|</span>
          <a
            href={getWhatsAppUrl('Hi KaoinAI team, I would like to schedule a technical architecture briefing for our data governance setup.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold text-xs sm:text-sm transition-colors"
            onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'announcement_bar' })}
          >
            <span>Schedule Technical Briefing</span>
          </a>
        </div>
        <button
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
          aria-label="Dismiss announcement"
          className="text-slate-400 hover:text-slate-700 hover:bg-purple-100/50 p-1 rounded-md transition-colors shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  )
}
