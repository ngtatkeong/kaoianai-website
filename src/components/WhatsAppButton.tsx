import { useState } from 'react'
import { X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp'

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true)
  const defaultMessage = 'Hi KaoinAI, I have an enquiry about your AI Data Governance & Quality platform.'
  const whatsappUrl = getWhatsAppUrl(defaultMessage)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Dynamically guarantee correct destination (web.whatsapp.com for desktop, app for mobile)
    e.currentTarget.href = getWhatsAppUrl(defaultMessage)
    trackEvent('click_whatsapp', {
      number: WHATSAPP_NUMBER,
      location: 'floating_button',
    })
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-end gap-2 pointer-events-auto">
      {showTooltip && (
        <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl text-gray-800 text-xs px-3.5 py-2.5 rounded-2xl animate-fade-in">
          <span>Need help? Chat with us on <strong>WhatsApp</strong></span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full focus:outline-none"
            aria-label="Close tooltip"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300/60"
        aria-label={`Chat on WhatsApp with KaoinAI at ${WHATSAPP_NUMBER}`}
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Official SVG Icon */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
        </svg>
      </a>
    </div>
  )
}
