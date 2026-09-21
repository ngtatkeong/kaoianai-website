import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { 
  ArrowRight, 
  Sparkles, 
  Calculator, 
  MessageSquare,
  ChevronRight,
  Terminal,
  Lock,
  Users,
  Scale,
  GraduationCap,
  ShieldAlert
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '@/lib/whatsapp'
import AnnouncementBar from '@/components/AnnouncementBar'

const navLinks = [
  { label: 'Live Demo', href: '#demo', icon: Terminal },
  { label: 'Features', href: '#features', icon: Sparkles },
  { label: 'Maturity Audit', href: '#audit', icon: ShieldAlert },
  { label: 'Security', href: '#security', icon: Lock },
  { label: 'Case Studies', href: '#case-studies', icon: Users },
  { label: 'Compare', href: '#compare', icon: Scale },
  { label: 'Pricing', href: '#pricing', icon: Calculator },
  { label: 'Knowledge Center', href: '#knowledge-center', icon: GraduationCap },
  { label: 'Contact', href: '/contact', icon: MessageSquare },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hasAnnouncement, setHasAnnouncement] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const isContactPage = location.pathname === '/contact'
  const whatsappUrl = getWhatsAppUrl()

  // Scroll detection for navbar background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileOpen])

  const scrollToAnchor = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -76
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)

    if (href.startsWith('#')) {
      const id = href.replace('#', '')
      if (isContactPage) {
        navigate('/' + href)
      } else {
        scrollToAnchor(id)
      }
    } else if (href.startsWith('/')) {
      navigate(href)
    }
  }

  const handleStartTrial = () => {
    setMobileOpen(false)
    trackEvent('click_cta', { location: 'navbar', label: 'Nav Start Free Trial' })
    if (isContactPage) {
      navigate('/#cta')
    } else {
      scrollToAnchor('cta')
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white/95 sm:bg-white/90 backdrop-blur-md border-b border-gray-100/70'
        }`}
      >
        {hasAnnouncement && (
          <AnnouncementBar onDismiss={() => setHasAnnouncement(false)} />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              onClick={() => {
                setMobileOpen(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
              aria-label="KaoinAI Home"
            >
              <img 
                src="/logo.png" 
                alt="KaoinAI Enterprise AI Data" 
                width="160" 
                height="36" 
                className="h-7 sm:h-9 w-auto object-contain" 
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navLinks.map((link) => {
                const isActive = link.href.startsWith('/') && location.pathname === link.href
                return (
                  <a
                    key={link.href}
                    href={isContactPage && link.href.startsWith('#') ? '/' + link.href : link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#5b2d6e] font-bold underline underline-offset-4'
                        : 'text-gray-700 hover:text-[#5b2d6e]'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.currentTarget.href = getWhatsAppUrl()
                  trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'navbar_badge' })
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold border border-green-200/80 transition-colors"
                title={`Chat with us directly on WhatsApp (${WHATSAPP_DISPLAY})`}
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
                </svg>
                <span>WhatsApp: {WHATSAPP_NUMBER}</span>
              </a>

              <Button
                size="sm"
                className="bg-gradient-brand text-white hover:opacity-95 text-xs font-semibold px-4 sm:px-5 py-2 shadow-sm rounded-lg"
                onClick={handleStartTrial}
              >
                Deploy 14-Day Pilot
                <ArrowRight size={13} className="ml-1.5" />
              </Button>
            </div>

            {/* Mobile Actions: WhatsApp quick icon + Animated Morphing Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat on WhatsApp (${WHATSAPP_DISPLAY})`}
                onClick={(e) => {
                  e.currentTarget.href = getWhatsAppUrl()
                  trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'mobile_nav_icon' })
                }}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-50 text-[#25D366] border border-green-200/80 active:scale-90 transition-transform duration-200"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
                </svg>
              </a>

              {/* Animated Morphing Hamburger Button */}
              <button
                type="button"
                className={`relative w-11 h-11 flex flex-col items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 active:scale-90 ${
                  mobileOpen 
                    ? 'bg-purple-100 text-[#5b2d6e]' 
                    : 'bg-gray-100/90 hover:bg-gray-200/80 text-gray-800'
                }`}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation-drawer"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
                {/* 3-bar morphing container */}
                <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
                  <span
                    className={`block h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                      mobileOpen ? 'rotate-45 translate-y-[7px]' : 'rotate-0 translate-y-0'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                      mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                      mobileOpen ? '-rotate-45 -translate-y-[7px]' : 'rotate-0 translate-y-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer & Backdrop with Smooth Transitions */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Dark blurred backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Drawer Content with Slide-Down Animation */}
        <nav 
          id="mobile-navigation-drawer"
          className={`fixed left-0 right-0 overflow-y-auto bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-2xl p-4 flex flex-col gap-4 transition-all duration-300 ease-out transform ${
            hasAnnouncement 
              ? 'top-[88px] sm:top-[94px] max-h-[calc(100dvh-88px)] sm:max-h-[calc(100dvh-94px)]' 
              : 'top-[54px] sm:top-[60px] max-h-[calc(100dvh-54px)] sm:max-h-[calc(100dvh-60px)]'
          } ${
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
          }`}
          aria-label="Mobile Navigation"
        >
          {/* Nav list */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = link.href.startsWith('/') && location.pathname === link.href
              return (
                <a
                  key={link.href}
                  href={isContactPage && link.href.startsWith('#') ? '/' + link.href : link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-50 text-[#5b2d6e] font-bold border border-purple-200/80 shadow-xs'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-purple-50/60 active:scale-[0.99]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-purple-100 text-[#5b2d6e]' : 'bg-purple-50/80 text-[#5b2d6e]'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-200 ${isActive ? 'text-[#5b2d6e] translate-x-0.5' : 'text-gray-400'}`} />
                </a>
              )
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-3 border-t border-gray-100 space-y-2.5">
            {/* WhatsApp direct callout */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.currentTarget.href = getWhatsAppUrl()
                setMobileOpen(false)
                trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'mobile_drawer' })
              }}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white rounded-xl font-bold text-sm shadow-sm active:scale-[0.98] transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
              </svg>
              <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>

            {/* Start Trial */}
            <Button
              className="w-full bg-gradient-brand text-white text-sm font-semibold py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all"
              onClick={handleStartTrial}
            >
              Deploy 14-Day Pilot
              <ArrowRight size={15} className="ml-1.5" />
            </Button>
          </div>

          {/* Footer note inside mobile menu */}
          <div className="text-center pt-2 text-xs text-gray-400">
            <span>Autonomous Data Governance &amp; Living Compliance</span>
          </div>
        </nav>
      </div>
    </>
  )
}
