import { Link } from 'react-router'
import { Mail, MapPin, Shield, CheckCircle2 } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '@/lib/whatsapp'

const footerLinks = {
  Product: [
    { label: 'Data Governance', href: '/#features' },
    { label: 'Data Quality & AI Rules', href: '/#features' },
    { label: 'Master Data Management', href: '/#features' },
    { label: 'PII Detection & Masking', href: '/#features' },
    { label: 'Schema Drift Detection', href: '/#features' },
    { label: 'Ask Data in Plain English', href: '/#features' },
  ],
  Solutions: [
    { label: 'Data Governance Maturity Audit', href: '/#audit' },
    { label: 'For Growing Startups & SMEs', href: '/#features' },
    { label: 'GDPR & PDPA Compliance', href: '/#faq' },
    { label: 'ERP Data Migration & Sync', href: '/#how-it-works' },
    { label: 'Automated dbt Pipelines', href: '/#features' },
    { label: 'ROI & Savings Calculator', href: '/#roi-calculator' },
  ],
  Resources: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing & Plans', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact Us & Support', href: '/contact' },
    { label: 'Schedule Architecture Review', href: '/#cta' },
  ],
}

export default function Footer() {
  const defaultMessage = 'Hi KaoinAI team, I would like to enquire about your data intelligence platform.'
  const whatsappUrl = getWhatsAppUrl(defaultMessage)

  return (
    <footer className="bg-[#0b0816] text-gray-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="KaoinAI Enterprise AI Data" width="160" height="36" className="h-9 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-gray-400">
              Autonomous Data Governance, Table-Bound DPIA &amp; RoPA, Column Lineage, and Master Data Management for regulated enterprises and agile engineering teams.
            </p>
            <div className="space-y-2.5 pt-2">
              {/* WhatsApp direct contact channel */}
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                    <path d="M12.031 2C6.494 2 2 6.494 2 12.031c0 1.996.586 3.86 1.602 5.438L2 22l4.695-1.574A9.99 9.99 0 0 0 12.031 22C17.568 22 22 17.506 22 12.031 22 6.494 17.568 2 12.031 2zm0 18.281c-1.742 0-3.375-.5-4.781-1.375l-.344-.219-3.234 1.078 1.094-3.156-.234-.375A8.253 8.253 0 0 1 3.75 12.031c0-4.562 3.719-8.281 8.281-8.281 4.562 0 8.281 3.719 8.281 8.281 0 4.563-3.719 8.281-8.281 8.281zm4.844-6.172c-.266-.14-1.578-.781-1.828-.875-.25-.094-.438-.14-.625.14-.188.281-.719.875-.875 1.062-.156.188-.328.203-.594.078-.266-.125-1.125-.406-2.14-1.312-.797-.703-1.328-1.578-1.484-1.844-.156-.266-.016-.406.125-.531.125-.125.266-.328.406-.484.14-.156.188-.266.281-.438.094-.172.047-.328-.031-.469-.078-.14-.625-1.516-.859-2.078-.234-.563-.469-.484-.641-.484h-.547c-.188 0-.484.078-.734.344-.25.266-.969.953-.969 2.328 0 1.375 1 2.703 1.141 2.891.14.188 1.969 3.016 4.781 4.219.672.297 1.188.469 1.609.609.672.219 1.281.188 1.766.109.547-.078 1.578-.641 1.812-1.266.234-.625.234-1.156.156-1.266-.078-.109-.266-.172-.531-.312z" />
                  </svg>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.currentTarget.href = getWhatsAppUrl(defaultMessage)
                    trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'footer_link' })
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  WhatsApp: {WHATSAPP_DISPLAY} (Instant Support)
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <Mail size={15} className="text-purple-400 shrink-0" />
                <a href="mailto:hello@kaoinai.com" className="hover:text-white transition-colors">
                  hello@kaoinai.com (General & Support)
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <Mail size={15} className="text-purple-400 shrink-0" />
                <a href="mailto:partners@kaoinai.com" className="hover:text-white transition-colors">
                  partners@kaoinai.com (ERP & Channel Partners)
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-300">
                <MapPin size={15} className="text-purple-400 shrink-0" />
                <span>Kuala Lumpur, Malaysia • Global Cloud SaaS</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 size={13} /> SOC 2 Aligned
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield size={13} /> GDPR & PDPA Ready
              </span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((item, idx) => (
                  <li key={idx}>
                    {item.href.startsWith('/contact') ? (
                      <Link
                        to={item.href}
                        className="text-xs text-gray-400 hover:text-purple-300 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="text-xs text-gray-400 hover:text-purple-300 transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} KaoinAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-purple-300 transition-colors">Contact Support</Link>
            <a href="/#faq" className="hover:text-purple-300 transition-colors">Privacy Policy</a>
            <a href="/#faq" className="hover:text-purple-300 transition-colors">Terms of Service</a>
            <a href="/#faq" className="hover:text-purple-300 transition-colors">Security Overview</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
