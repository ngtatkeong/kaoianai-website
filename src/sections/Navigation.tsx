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
  ShieldAlert,
  X
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

// 5 core primary links to keep the top navbar spacious and uncramped
const primaryNavLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Maturity Audit', href: '#audit' },
  { label: 'Live Demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Security', href: '#security' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  // Closed by default to keep landing page spacious and uncluttered
  const [drawerOpen, setDrawerOpen] = useState(false)
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

  // Lock body scroll on small mobile screens when menu is open
  useEffect(() => {
    if (drawerOpen && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen])

  // Close menu on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const scrollToAnchor = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -76
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault()
    setDrawerOpen(false)

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
    setDrawerOpen(false)
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
          scrolled || drawerOpen
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white/95 sm:bg-white/90 backdrop-blur-md border-b border-gray-100/70'
        }`}
      >
        {hasAnnouncement && (
          <AnnouncementBar onDismiss={() => setHasAnnouncement(false)} />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              onClick={() => {
                setDrawerOpen(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg shrink-0 mr-4"
              aria-label="KaoinAI Home"
            >
              <img 
                src="/logo.png" 
                alt="KaoinAI Enterprise AI Data" 
                width="160" 
                height="36" 
                className="h-8 sm:h-9 w-auto object-contain" 
              />
            </Link>

            {/* Desktop Primary Navigation Links - Airy & Spacious */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {primaryNavLinks.map((link) => {
                const isActive = link.href.startsWith('/') && location.pathname === link.href
                return (
                  <a
                    key={link.href}
                    href={isContactPage && link.href.startsWith('#') ? '/' + link.href : link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#5b2d6e] font-bold underline underline-offset-8'
                        : 'text-gray-600 hover:text-[#5b2d6e]'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              })}
            </nav>

            {/* Desktop Action Buttons + Hamburger Menu Toggle */}
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

              {/* Desktop Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  drawerOpen
                    ? 'bg-purple-100 text-[#5b2d6e] border-purple-300 ring-2 ring-purple-500/20'
                    : 'bg-gray-100/90 hover:bg-gray-200/80 text-gray-800 border-gray-200'
                }`}
                aria-label={drawerOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
                aria-expanded={drawerOpen}
              >
                <div className="w-4 h-3.5 relative flex flex-col justify-between items-center pointer-events-none">
                  <span
                    className={`block h-0.5 w-4 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                      drawerOpen ? 'rotate-45 translate-y-[5.5px]' : 'rotate-0 translate-y-0'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-4 bg-current rounded-full transition-all duration-200 ease-in-out ${
                      drawerOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-4 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                      drawerOpen ? '-rotate-45 -translate-y-[5.5px]' : 'rotate-0 translate-y-0'
                    }`}
                  />
                </div>
                <span>{drawerOpen ? 'Close Menu' : 'Menu'}</span>
              </button>
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
                  drawerOpen 
                    ? 'bg-purple-100 text-[#5b2d6e]' 
                    : 'bg-gray-100/90 hover:bg-gray-200/80 text-gray-800'
                }`}
                aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={drawerOpen}
                aria-controls="navigation-drawer"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                <span className="sr-only">{drawerOpen ? 'Close menu' : 'Open menu'}</span>
                <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
                  <span
                    className={`block h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                      drawerOpen ? 'rotate-45 translate-y-[7px]' : 'rotate-0 translate-y-0'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-200 ease-in-out ${
                      drawerOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                      drawerOpen ? '-rotate-45 -translate-y-[7px]' : 'rotate-0 translate-y-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Universal Slide-Over Hamburger Drawer & Backdrop (Open by default, can be closed after) */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!drawerOpen}
      >
        {/* Soft darkened backdrop - clicking outside closes drawer */}
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-over menu panel */}
        <div 
          id="navigation-drawer"
          className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] md:w-[460px] bg-white/98 backdrop-blur-2xl border-l border-purple-100 shadow-2xl flex flex-col justify-between overflow-y-auto z-50 transform transition-transform duration-300 ease-out p-5 sm:p-6 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Navigation Drawer"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="KaoinAI" 
                className="h-7 w-auto object-contain" 
              />
              <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                Menu Directory
              </span>
            </div>

            {/* Close Button ("can be closed after") */}
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-[#5b2d6e] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              aria-label="Close menu"
            >
              <X size={15} />
              <span>Close</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 py-4 space-y-5 overflow-y-auto">
            {/* Spotlit Features & Maturity Audit Quick-Access Cards */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
                <span>Core Capabilities</span>
                <span className="text-[10px] text-purple-600 lowercase font-medium">Quick jump</span>
              </div>

              {/* 1. Data Governance Maturity & Risk Audit */}
              <a
                href="#audit"
                onClick={(e) => handleNavClick(e, '#audit')}
                className="group block p-4 rounded-2xl bg-gradient-to-br from-[#0e0c1f] to-[#1a1538] text-white border border-purple-500/30 shadow-lg shadow-purple-950/20 hover:border-purple-400 transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/30 text-purple-300 flex items-center justify-center shrink-0">
                    <ShieldAlert size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                    Interactive Diagnostic
                  </span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-200 transition-colors flex items-center justify-between">
                  <span>Data Governance Maturity Audit</span>
                  <ChevronRight size={16} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  5-dimension diagnostic aligned with DAMA &amp; ISO 38505. Calculate maturity level &amp; regulatory risk profile in 2 mins.
                </p>
              </a>

              {/* 2. Platform Features & Modules */}
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, '#features')}
                className="group block p-4 rounded-2xl bg-purple-50/70 hover:bg-purple-50 text-slate-900 border border-purple-200/80 shadow-xs hover:border-purple-300 transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                    14+ Core Modules
                  </span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#5b2d6e] transition-colors flex items-center justify-between">
                  <span>Platform Features &amp; Modules</span>
                  <ChevronRight size={16} className="text-[#5b2d6e] group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Table-Bound DPIA, Golden MDM, Column Lineage, Schema Drift Detection, Ask Data in plain SQL &amp; ESG tracking.
                </p>
              </a>
            </div>

            {/* Complete Section Links List */}
            <div className="space-y-1 pt-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                All Platform Sections
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = link.href.startsWith('/') && location.pathname === link.href
                return (
                  <a
                    key={link.href}
                    href={isContactPage && link.href.startsWith('#') ? '/' + link.href : link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-purple-50 text-[#5b2d6e] font-bold border border-purple-200/80 shadow-xs'
                        : 'text-gray-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? 'bg-purple-100 text-[#5b2d6e]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon size={15} />
                      </div>
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-4 border-t border-gray-100 space-y-2.5">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.currentTarget.href = getWhatsAppUrl()
                setDrawerOpen(false)
                trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'nav_drawer' })
              }}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs shadow-xs active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
              </svg>
              <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>

            {/* Start Pilot */}
            <Button
              className="w-full bg-gradient-brand text-white text-xs font-semibold py-3 rounded-xl shadow-sm active:scale-[0.98] transition-all"
              onClick={handleStartTrial}
            >
              Deploy 14-Day Pilot
              <ArrowRight size={14} className="ml-1.5" />
            </Button>

            <div className="text-center pt-1 text-[11px] text-gray-400">
              Press Esc or click outside to close
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
