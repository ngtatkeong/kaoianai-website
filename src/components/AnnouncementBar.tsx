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
    trackEvent('click_announcement', { label: 'Q2 Pilot Announcement' })
    const el = document.getElementById('cta')
    if (el) {
      const yOffset = -80
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#2d1b4e] via-[#5b2d6e] to-[#9b2c2c] text-white text-xs sm:text-sm py-2 px-3 sm:px-4 relative z-50 border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-grow justify-center text-center">
          <span className="hidden xs:inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-amber-300 shrink-0">
            <Sparkles size={12} />
          </span>
          <span className="font-medium text-purple-100">
            <strong className="text-amber-300 font-bold">Launch Special:</strong> <span className="underline decoration-amber-400 font-extrabold text-white">$0 for First 3 Customers</span> ($7,930 Value Free + Waived Setup). Only 2 slots remaining!
          </span>
          <button
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            Claim $0 Slot <ArrowRight size={13} className="shrink-0" />
          </button>
          <span className="hidden md:inline text-white/40">|</span>
          <a
            href={getWhatsAppUrl('Hi KaoinAI, I would like to claim the $0 launch offer for the first 3 customers.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-semibold"
            onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'announcement_bar' })}
          >
            <span>WhatsApp Us</span>
          </a>
        </div>
        <button
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
          aria-label="Dismiss announcement"
          className="text-white/60 hover:text-white p-1 rounded transition-colors shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
