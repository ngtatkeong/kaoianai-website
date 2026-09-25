import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '@/lib/whatsapp'
import AnnouncementBar from '@/components/AnnouncementBar'

// Primary links directly displayed on the desktop horizontal navbar
const primaryNavLinks = [
  { label: 'Live Demo', href: '#demo' },
  { label: 'Features', href: '#features' },
  { label: 'Maturity Audit', href: '#audit' },
  { label: 'Knowledge Center', href: '#knowledge-center' },
  { label: 'Pricing', href: '#pricing' },
]

// Secondary links neatly organized under the "More ▾" dropdown on desktop
const moreLinks = [
  { label: 'Security & Trust', href: '#security', description: 'Zero-egress, MAS TRM & PDPA blueprints' },
  { label: 'Case Studies', href: '#case-studies', description: 'Enterprise reference architectures' },
  { label: 'Compare vs Legacy', href: '#compare', description: 'KaoinAI vs Atlan, Alation, Collibra' },
  { label: 'FAQ', href: '#faq', description: 'Frequently asked technical questions' },
]

// Complete directory for mobile screens
const allMobileNavLinks = [
  { label: 'Live Demo', href: '#demo' },
  { label: 'Features', href: '#features' },
  { label: 'Maturity Audit', href: '#audit' },
  { label: 'Knowledge Center', href: '#knowledge-center' },
  { label: 'Security & Trust', href: '#security' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Compare vs Legacy', href: '#compare' },
  { label: 'Pricing ($0 First 3)', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [hasAnnouncement, setHasAnnouncement] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('')
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const isContactPage = location.pathname === '/contact'
  const whatsappUrl = getWhatsAppUrl()

  // Scroll detection for navbar background & ScrollSpy (RAF throttled to avoid layout thrashing)
  useEffect(() => {
    let ticking = false
    let lastScrolledState = false

    const updateScroll = () => {
      const scrollY = window.scrollY
      const isScrolledNow = scrollY > 15
      if (isScrolledNow !== lastScrolledState) {
        lastScrolledState = isScrolledNow
        setScrolled(isScrolledNow)
      }

      // Only perform ScrollSpy on landing page
      if (location.pathname !== '/') {
        setActiveSection('')
        ticking = false
        return
      }

      if (scrollY < 250) {
        setActiveSection('')
        ticking = false
        return
      }

      const header = document.querySelector('header')
      const navHeight = header ? header.clientHeight : 80

      const sectionIds = [
        'demo',
        'features',
        'security',
        'case-studies',
        'compare',
        'how-it-works',
        'audit',
        'pricing',
        'knowledge-center',
        'faq',
      ]

      let current = ''
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el) {
          const top = el.offsetTop - navHeight - 60
          if (scrollY >= top) {
            current = sectionIds[i]
            break
          }
        }
      }
      setActiveSection(current)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  const scrollToAnchor = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const header = document.querySelector('header')
      const headerHeight = header ? header.getBoundingClientRect().height : 76
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    setMoreOpen(false)

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

  const handleMoreEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setMoreOpen(true)
  }

  const handleMoreLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false)
    }, 180)
  }

  const handleStartTrial = () => {
    setMobileMenuOpen(false)
    trackEvent('click_cta', { location: 'navbar', label: 'Nav Start Free Trial' })
    if (isContactPage) {
      navigate('/#cta')
    } else {
      scrollToAnchor('cta')
    }
  }

  const isMoreActive = moreLinks.some((item) => activeSection === item.href.replace('#', ''))

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-white/90 backdrop-blur-xl shadow-xs border-b border-purple-100/60'
          : 'bg-white/80 backdrop-blur-lg border-b border-gray-100/60'
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
              setMobileMenuOpen(false)
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

          {/* Desktop Horizontal Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
            {primaryNavLinks.map((link) => {
              const linkId = link.href.replace('#', '')
              const isActive = !isContactPage && activeSection === linkId

              return (
                <a
                  key={link.href}
                  href={isContactPage && link.href.startsWith('#') ? '/' + link.href : link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-xl ${
                    isActive
                      ? 'text-[#5b2d6e] font-bold bg-purple-100/70 border border-purple-200/80 shadow-2xs'
                      : 'text-gray-600 hover:text-[#5b2d6e] hover:bg-purple-50/50'
                  }`}
                >
                  {link.label}
                </a>
              )
            })}

            {/* Desktop "More" Dropdown Menu with Hover Intent */}
            <div 
              className="relative"
              onMouseEnter={handleMoreEnter}
              onMouseLeave={handleMoreLeave}
            >
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 text-sm font-semibold tracking-wide transition-all cursor-pointer px-3 py-1.5 rounded-xl ${
                  isMoreActive || moreOpen
                    ? 'text-[#5b2d6e] font-bold bg-purple-100/70 border border-purple-200/80 shadow-2xs'
                    : 'text-gray-600 hover:text-[#5b2d6e] hover:bg-purple-50/50'
                }`}
                aria-expanded={moreOpen}
              >
                <span>More</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleMoreEnter}
                  onMouseLeave={handleMoreLeave}
                >
                  <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-100/80 p-2 space-y-1">
                    {moreLinks.map((item) => {
                      const isItemActive = !isContactPage && activeSection === item.href.replace('#', '')
                      return (
                        <a
                          key={item.href}
                          href={isContactPage && item.href.startsWith('#') ? '/' + item.href : item.href}
                          onClick={(e) => {
                            setMoreOpen(false)
                            handleNavClick(e, item.href)
                          }}
                          className={`block p-2.5 rounded-xl transition-colors group cursor-pointer ${
                            isItemActive
                              ? 'bg-purple-50 border border-purple-100'
                              : 'hover:bg-purple-50/60'
                          }`}
                        >
                          <div className={`text-xs font-bold ${isItemActive ? 'text-[#5b2d6e]' : 'text-gray-900 group-hover:text-[#5b2d6e]'}`}>
                            {item.label}
                          </div>
                          <div className="text-[11px] text-gray-500 line-clamp-1">
                            {item.description}
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Link */}
            <Link
              to="/contact"
              className={`text-sm font-semibold tracking-wide transition-all cursor-pointer px-3 py-1.5 rounded-xl ${
                isContactPage
                  ? 'text-[#5b2d6e] font-bold bg-purple-100/70 border border-purple-200/80 shadow-2xs'
                  : 'text-gray-600 hover:text-[#5b2d6e] hover:bg-purple-50/50'
              }`}
            >
              Contact
            </Link>
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

            {/* Mobile Actions: WhatsApp quick icon + Mobile dropdown toggle */}
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
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-100 text-[#1da851] border border-green-300 shadow-sm active:scale-95 transition-transform"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
                </svg>
              </a>

              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 shadow-sm transition-colors"
                aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown (Complete all-section directory) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto">
            {allMobileNavLinks.map((link) => (
              <a
                key={link.href}
                href={isContactPage && link.href.startsWith('#') ? '/' + link.href : link.href}
                onClick={(e) => {
                  handleNavClick(e, link.href)
                  setMobileMenuOpen(false)
                }}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-[#5b2d6e] hover:bg-purple-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <Button
                className="w-full bg-gradient-brand text-white text-xs font-semibold py-2.5 rounded-lg"
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleStartTrial()
                }}
              >
                Deploy 14-Day Pilot
                <ArrowRight size={13} className="ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </header>
    )
}
