import { useState, useEffect, useMemo } from 'react'
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
  MessageSquare,
  Calendar,
  CalendarCheck,
  Video,
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '@/lib/whatsapp'

interface BusinessDay {
  label: string
  dateStr: string
  displayDate: string
  isTomorrow: boolean
}

function getUpcomingBusinessDays(count = 5): BusinessDay[] {
  const days: BusinessDay[] = []
  const current = new Date()
  let added = 0
  let dayOffset = 1

  while (added < count && dayOffset < 20) {
    const nextDate = new Date(current)
    nextDate.setDate(current.getDate() + dayOffset)
    const dayOfWeek = nextDate.getDay() // 0 = Sun, 6 = Sat

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const year = nextDate.getFullYear()
      const month = String(nextDate.getMonth() + 1).padStart(2, '0')
      const day = String(nextDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      const weekdayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' })
      const monthDay = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const fullDate = nextDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

      days.push({
        label: dayOffset === 1 ? `Tomorrow (${weekdayName}, ${monthDay})` : `${weekdayName}, ${monthDay}`,
        dateStr,
        displayDate: fullDate,
        isTomorrow: dayOffset === 1,
      })
      added++
    }
    dayOffset++
  }
  return days
}

const TIME_SLOTS = [
  { time: '10:00', label: '10:00 AM SGT', hour: 10, min: 0 },
  { time: '11:30', label: '11:30 AM SGT', hour: 11, min: 30 },
  { time: '14:00', label: '02:00 PM SGT', hour: 14, min: 0 },
  { time: '15:30', label: '03:30 PM SGT', hour: 15, min: 30 },
  { time: '16:30', label: '04:30 PM SGT', hour: 16, min: 30 },
]

const SESSION_DURATIONS = [
  {
    minutes: 15,
    title: '15-min Quick Q&A',
    description: 'Rapid alignment on compliance goals & architecture fit.',
  },
  {
    minutes: 30,
    title: '30-min Technical Demo',
    description: 'Live walkthrough of zero-ingestion PII scanning & RoPA automation.',
    recommended: true,
  },
  {
    minutes: 45,
    title: '45-min Enterprise Deep Dive',
    description: 'Detailed scope for ERP integrations, multi-jurisdiction PDPA, or custom audit rules.',
  },
]

function generateGoogleCalendarUrl({
  title,
  details,
  date,
  time,
  durationMinutes,
}: {
  title: string
  details: string
  date: string
  time: string
  durationMinutes: number
}) {
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)

  // Singapore is UTC+8
  const startUtc = new Date(Date.UTC(year, month - 1, day, hours - 8, minutes, 0))
  const endUtc = new Date(startUtc.getTime() + durationMinutes * 60000)

  const toCompactIso = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const startIso = toCompactIso(startUtc)
  const endIso = toCompactIso(endUtc)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startIso}/${endIso}`,
    details: details,
    location: 'Google Meet / Virtual Video Call',
    add: 'tk.ng@kaoinai.com',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function Contact() {
  const businessDays = useMemo(() => getUpcomingBusinessDays(5), [])

  // Tab state: 'calendar' (default) or 'inquiry'
  const [activeTab, setActiveTab] = useState<'calendar' | 'inquiry'>('calendar')

  // 1-on-1 Booking State
  const [selectedDuration, setSelectedDuration] = useState<number>(30)
  const [selectedDate, setSelectedDate] = useState<string>(businessDays[0]?.dateStr || '')
  const [selectedTime, setSelectedTime] = useState<string>('14:00')
  const [bookingName, setBookingName] = useState('')
  const [bookingEmail, setBookingEmail] = useState('')
  const [bookingCompany, setBookingCompany] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [bookingTopic, setBookingTopic] = useState('Data Governance & RoPA / Data Inventory Pilot')
  const [bookingNotes, setBookingNotes] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingRefId, setBookingRefId] = useState('')
  const [bookingGCalUrl, setBookingGCalUrl] = useState('')

  // Inquiry Form State
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
  const [bookingCopied, setBookingCopied] = useState(false)

  const defaultContactMessage =
    'Hi KaoinAI team, I would like to enquire about your AI Data Governance, Data Quality & PII Detection platform.'
  const whatsappUrl = getWhatsAppUrl(defaultContactMessage)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = 'Schedule 1-on-1 with TK Ng | Contact Us — KaoinAI'
  }, [])

  const handleCopyRef = () => {
    if (!referenceId) return
    navigator.clipboard.writeText(referenceId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyBookingRef = () => {
    if (!bookingRefId) return
    navigator.clipboard.writeText(bookingRefId)
    setBookingCopied(true)
    setTimeout(() => setBookingCopied(false), 2000)
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

  const handleResetBooking = () => {
    setBookingName('')
    setBookingEmail('')
    setBookingCompany('')
    setBookingPhone('')
    setBookingNotes('')
    setBookingConfirmed(false)
    setBookingRefId('')
    setBookingGCalUrl('')
  }

  // Booking submit handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingName || !bookingEmail || !selectedDate || !selectedTime) return

    setBookingLoading(true)

    const refId = `KAI-CAL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    const slotLabel = TIME_SLOTS.find((s) => s.time === selectedTime)?.label || `${selectedTime} SGT`
    const durationObj = SESSION_DURATIONS.find((d) => d.minutes === selectedDuration)
    const sessionName = durationObj?.title || `${selectedDuration}-min Consultation`

    const selectedDayObj = businessDays.find((d) => d.dateStr === selectedDate)
    const formattedDate = selectedDayObj ? selectedDayObj.displayDate : selectedDate

    const meetingTitle = `KaoinAI: ${sessionName} with TK Ng & ${bookingName.trim()}`
    const meetingDetails = `1-on-1 Consultation with TK Ng (Principal AI & Data Governance Architect, KaoinAI)

Host: TK Ng (tk.ng@kaoinai.com)
Attendee: ${bookingName.trim()} (${bookingEmail.trim()})
Company: ${bookingCompany.trim() || 'Not Specified'}
Session: ${sessionName}
Date & Time: ${formattedDate} at ${slotLabel}
Topic / Focus: ${bookingTopic}
Agenda / Questions: ${bookingNotes.trim() || 'None provided'}
Booking Ref: ${refId}
Host Direct Email: tk.ng@kaoinai.com`

    const gcalUrl = generateGoogleCalendarUrl({
      title: meetingTitle,
      details: meetingDetails,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: selectedDuration,
    })

    try {
      const formData = new FormData()
      formData.append('booking_type', 'Google Calendar 1-on-1 Consultation')
      formData.append('host', 'TK Ng (tk.ng@kaoinai.com)')
      formData.append('name', bookingName.trim())
      formData.append('email', bookingEmail.trim())
      formData.append('_replyto', bookingEmail.trim())
      formData.append('company', bookingCompany.trim() || 'Not Specified')
      formData.append('phone', bookingPhone.trim() || 'Not Specified')
      formData.append('session_duration', `${selectedDuration} mins`)
      formData.append('date_sgt', selectedDate)
      formData.append('time_sgt', slotLabel)
      formData.append('topic', bookingTopic)
      formData.append('notes', bookingNotes.trim() || 'None provided')
      formData.append('reference_id', refId)
      formData.append('google_calendar_url', gcalUrl)
      formData.append(
        '_subject',
        `[Calendar Booking] ${sessionName} from ${bookingName.trim()} (${bookingCompany.trim() || 'SME'}) on ${selectedDate} at ${slotLabel}`
      )
      formData.append('recipient', 'tk.ng@kaoinai.com')

      await fetch('https://formspree.io/f/xyegdyyj', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      }).catch(() => null)

      trackEvent('book_calendar_slot', {
        name: bookingName,
        email: bookingEmail,
        duration: selectedDuration,
        date: selectedDate,
        time: selectedTime,
        ref: refId,
      })

      setBookingRefId(refId)
      setBookingGCalUrl(gcalUrl)
      setBookingConfirmed(true)

      // Open Google Calendar in new tab automatically
      window.open(gcalUrl, '_blank', 'noopener,noreferrer')
    } catch {
      setBookingRefId(refId)
      setBookingGCalUrl(gcalUrl)
      setBookingConfirmed(true)
      window.open(gcalUrl, '_blank', 'noopener,noreferrer')
    } finally {
      setBookingLoading(false)
    }
  }

  // Inquiry submit handler
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
    } catch {
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
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-24 bg-transparent min-h-screen">
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
          {/* Left Column: Direct Channels (Host Card, WhatsApp & Contact Cards) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            {/* TK Ng Host Profile Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-purple-200/80 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
              
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5b2d6e] to-[#8d448b] text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0 ring-4 ring-purple-50">
                  TK
                </div>
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5b2d6e] text-[11px] font-bold mb-1 border border-purple-100">
                    <UserCheck size={12} />
                    <span>Direct Architecture Host</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">TK Ng</h3>
                  <p className="text-xs font-semibold text-gray-600">Principal AI &amp; Data Governance Architect</p>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#5b2d6e] shrink-0" />
                  <a href="mailto:tk.ng@kaoinai.com" className="font-semibold text-gray-900 hover:text-[#5b2d6e] transition-colors underline decoration-purple-200">
                    tk.ng@kaoinai.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#5b2d6e] shrink-0" />
                  <span>Singapore / Malaysia Time (SGT, UTC+8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video size={14} className="text-[#5b2d6e] shrink-0" />
                  <span>Google Meet / Calendar 1-Click Sync</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-4 leading-relaxed bg-purple-50/50 p-3 rounded-xl border border-purple-100/60">
                "Direct calendar consultations with zero sales fluff. We'll examine your data sources, assess zero-ingestion architecture, and map out your PDPA/RoPA timeline."
              </p>

              <div className="mt-4 pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('calendar')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5b2d6e] hover:underline"
                >
                  <CalendarCheck size={14} />
                  <span>Book Free Session</span>
                </button>
                <a
                  href="https://calendar.google.com/calendar/u/0/r?add=tk.ng@kaoinai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <span>Check Calendar Schedule</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Highlighted WhatsApp Card */}
            <div className="bg-gradient-to-br from-[#128C7E]/10 via-[#25D366]/15 to-emerald-50 rounded-3xl p-5 sm:p-7 border-2 border-[#25D366]/40 shadow-xl relative overflow-hidden">
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

              <p className="text-xs text-gray-700 leading-relaxed mb-5">
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
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                Other Ways to Connect
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">General &amp; Technical Support</span>
                    <a href="mailto:hello@kaoinai.com" className="text-xs font-medium text-gray-900 hover:text-[#5b2d6e] transition-colors">
                      hello@kaoinai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">ERP &amp; Channel Partnerships</span>
                    <a href="mailto:partners@kaoinai.com" className="text-xs font-medium text-gray-900 hover:text-[#5b2d6e] transition-colors">
                      partners@kaoinai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Headquarters &amp; Cloud Infrastructure</span>
                    <span className="text-xs font-medium text-gray-900">
                      Kuala Lumpur, Malaysia &bull; Global SaaS
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center gap-2.5 text-[11px] text-emerald-700 bg-emerald-50/60 p-2.5 rounded-xl">
                <ShieldCheck size={16} className="shrink-0" />
                <span>Zero-data-ingestion architecture. Customer metadata encrypted via TLS 1.3 &amp; AES-256.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Tab (1-on-1 Calendar Booking or Inquiry Form) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-gray-200 shadow-xl">
            {/* Top Navigation Tabs */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-white text-[#5b2d6e] shadow-sm ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar size={16} className={activeTab === 'calendar' ? 'text-[#5b2d6e]' : 'text-gray-500'} />
                <span>Book 1-on-1 with TK</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-[#5b2d6e] font-semibold">
                  Google Calendar
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiry')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'inquiry'
                    ? 'bg-white text-[#5b2d6e] shadow-sm ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail size={16} className={activeTab === 'inquiry' ? 'text-[#5b2d6e]' : 'text-gray-500'} />
                <span>Send General Inquiry</span>
              </button>
            </div>

            {/* TAB 1: GOOGLE CALENDAR 1-ON-1 BOOKING */}
            {activeTab === 'calendar' && (
              <>
                {bookingConfirmed ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Header Status */}
                    <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center shrink-0 shadow-sm">
                        <CalendarCheck size={28} />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                          Google Calendar Invite Generated
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">
                          1-on-1 Session with TK Ng
                        </h2>
                      </div>
                    </div>

                    {/* Booking Reference Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200">
                        <div>
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                            Booking Reference ID
                          </span>
                          <span className="text-lg sm:text-xl font-mono font-extrabold text-[#5b2d6e]">
                            {bookingRefId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyBookingRef}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-purple-300 text-xs font-semibold text-gray-700 hover:text-[#5b2d6e] shadow-xs active:scale-95 transition-all self-start sm:self-auto"
                        >
                          {bookingCopied ? (
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

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div>
                          <span className="text-gray-400 block font-medium">Host</span>
                          <span className="font-semibold text-gray-900">TK Ng &bull; tk.ng@kaoinai.com</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">Session Duration</span>
                          <span className="font-semibold text-purple-800">{selectedDuration} Minutes Consultation</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">Scheduled Date &amp; Time</span>
                          <span className="font-semibold text-emerald-700 flex items-center gap-1">
                            <Clock size={12} /> {selectedDate} &bull; {TIME_SLOTS.find(s => s.time === selectedTime)?.label || `${selectedTime} SGT`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">Attendee</span>
                          <span className="font-semibold text-gray-800">{bookingName} {bookingCompany ? `(${bookingCompany})` : ''}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-gray-400 block font-medium">Topic Focus</span>
                          <span className="font-semibold text-gray-800">{bookingTopic}</span>
                        </div>
                        {bookingNotes && (
                          <div className="sm:col-span-2">
                            <span className="text-gray-400 block font-medium">Agenda / Notes</span>
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-gray-700 mt-1 whitespace-pre-wrap">
                              {bookingNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Google Calendar Link Button */}
                    <div className="space-y-3 pt-2">
                      <a
                        href={bookingGCalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold rounded-xl shadow-lg transition-all text-sm group"
                      >
                        <Calendar size={18} />
                        <span>Open &amp; Save in Google Calendar</span>
                        <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>

                      {/* WhatsApp Confirmation to TK */}
                      <a
                        href={getWhatsAppUrl(
                          `Hi TK, I have booked a 1-on-1 session on Google Calendar.\n\n• Ref ID: ${bookingRefId}\n• Date: ${selectedDate}\n• Time: ${TIME_SLOTS.find(s => s.time === selectedTime)?.label || selectedTime}\n• Topic: ${bookingTopic}\n• Attendee: ${bookingName} (${bookingEmail})\n\nLooking forward to meeting with you!`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) =>
                          handleWhatsAppClick(
                            e,
                            'calendar_booking_whatsapp',
                            `Hi TK, I have booked a 1-on-1 session on Google Calendar.\n\n• Ref ID: ${bookingRefId}\n• Date: ${selectedDate}\n• Time: ${TIME_SLOTS.find(s => s.time === selectedTime)?.label || selectedTime}\n• Topic: ${bookingTopic}\n• Attendee: ${bookingName} (${bookingEmail})\n\nLooking forward to meeting with you!`
                          )
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs shadow transition-all"
                      >
                        <MessageSquare size={14} />
                        <span>Send 1-Click WhatsApp Confirmation to TK</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleResetBooking}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs transition-colors"
                      >
                        <RefreshCw size={13} />
                        <span>Book Another Time Slot</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-50 text-[#5b2d6e] text-xs font-bold mb-2">
                        <Sparkles size={13} />
                        <span>Direct Host: TK Ng &bull; tk.ng@kaoinai.com</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Schedule 1-on-1 Discovery</h2>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Reserve a dedicated Google Meet video call with our Principal AI &amp; Data Governance Architect.
                        Invite is automatically synchronized to <strong>tk.ng@kaoinai.com</strong>.
                      </p>
                    </div>

                    {/* Step 1: Session Duration */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                        1. Select Session Type &amp; Duration
                      </label>
                      <div className="grid sm:grid-cols-3 gap-2.5">
                        {SESSION_DURATIONS.map((dur) => (
                          <button
                            key={dur.minutes}
                            type="button"
                            onClick={() => setSelectedDuration(dur.minutes)}
                            className={`p-3 rounded-xl border text-left transition-all relative ${
                              selectedDuration === dur.minutes
                                ? 'border-[#5b2d6e] bg-purple-50/70 shadow-xs ring-2 ring-[#5b2d6e]/20'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            {dur.recommended && (
                              <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#5b2d6e] text-white text-[9px] font-bold">
                                Recommended
                              </span>
                            )}
                            <div className="font-bold text-xs text-gray-900">{dur.title}</div>
                            <div className="text-[11px] text-gray-500 mt-1 leading-snug">{dur.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Select Date */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                          2. Select Meeting Date
                        </label>
                        <span className="text-[11px] text-gray-500">Upcoming Business Days</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {businessDays.map((day) => (
                          <button
                            key={day.dateStr}
                            type="button"
                            onClick={() => setSelectedDate(day.dateStr)}
                            className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                              selectedDate === day.dateStr
                                ? 'border-[#5b2d6e] bg-[#5b2d6e] text-white font-bold shadow-xs'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/30 text-xs font-medium'
                            }`}
                          >
                            <span className="block text-[11px] leading-tight">{day.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Custom Date Picker */}
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Or pick specific date:</span>
                        <Input
                          type="date"
                          value={selectedDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-auto h-9 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Step 3: Select SGT Time Slot */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                          3. Select Time Slot (Singapore Time &bull; SGT UTC+8)
                        </label>
                        <a
                          href="https://calendar.google.com/calendar/u/0/r?add=tk.ng@kaoinai.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#5b2d6e] font-semibold hover:underline"
                        >
                          <span>Check TK's Schedule</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-2 px-1 rounded-xl border text-center transition-all ${
                              selectedTime === slot.time
                                ? 'border-[#5b2d6e] bg-[#5b2d6e] text-white font-bold shadow-xs'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50/30 text-xs font-medium'
                            }`}
                          >
                            <span className="block text-xs">{slot.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 4: Attendee Details */}
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                        4. Your Contact &amp; Business Information
                      </label>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                          <Input
                            type="text"
                            required
                            placeholder="e.g. Alex Tan"
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            className="rounded-xl text-base sm:text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700">Work Email *</label>
                          <Input
                            type="email"
                            required
                            placeholder="alex@company.com"
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                            className="rounded-xl text-base sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700">Company Name</label>
                          <Input
                            type="text"
                            placeholder="e.g. Acme Enterprise"
                            value={bookingCompany}
                            onChange={(e) => setBookingCompany(e.target.value)}
                            className="rounded-xl text-base sm:text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-700">Phone / WhatsApp</label>
                          <Input
                            type="tel"
                            placeholder="+65 9123 4567"
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            className="rounded-xl text-base sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Primary Discussion Topic</label>
                        <select
                          value={bookingTopic}
                          onChange={(e) => setBookingTopic(e.target.value)}
                          className="w-full h-11 sm:h-10 px-3 py-2 text-base sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
                        >
                          <option value="Data Governance & RoPA / Data Inventory Pilot">
                            Data Governance &amp; RoPA / Data Inventory Pilot (SG / MY / ID)
                          </option>
                          <option value="Automated PII Scanning & Masking Demo">
                            Automated PII Scanning, Discovery &amp; Masking Demo
                          </option>
                          <option value="$0 Founding Customer Cohort (First 3 Only)">
                            $0 Founding Customer Pilot Cohort (First 3 Customers Only)
                          </option>
                          <option value="ERP & Enterprise Connectors (SAP / NetSuite / Postgres)">
                            ERP &amp; Database Connectors (SAP, NetSuite, PostgreSQL, Snowflake)
                          </option>
                          <option value="Custom Architecture & Compliance Strategy">
                            Custom Architecture, Data Quality &amp; Multi-Jurisdiction Strategy
                          </option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Agenda / Current Data Stack Notes</label>
                        <Textarea
                          rows={3}
                          placeholder="Briefly share your current databases or specific PDPA compliance deadlines..."
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          className="rounded-xl resize-none text-base sm:text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={bookingLoading}
                      size="lg"
                      className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity py-6 text-sm font-semibold rounded-xl shadow-lg group"
                    >
                      <CalendarCheck size={18} className="mr-2" />
                      {bookingLoading ? 'Generating Calendar Invite...' : 'Confirm Slot & Open in Google Calendar'}
                    </Button>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-[11px] text-gray-500 text-center sm:text-left">
                      <span>✓ Dispatches invite to tk.ng@kaoinai.com</span>
                      <span>✓ Auto-attaches Google Meet video link</span>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* TAB 2: GENERAL WRITTEN INQUIRY */}
            {activeTab === 'inquiry' && (
              <>
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
                          Inquiry Logged &amp; Acknowledged
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
                        A notification copy has been transmitted directly to TK Ng (<strong>tk.ng@kaoinai.com</strong>). We will review your data requirements and respond directly to <strong>{email}</strong>.
                      </span>
                    </div>

                    {/* Direct Fast-Track Escalation Buttons */}
                    <div className="space-y-2.5 pt-2">
                      <p className="text-xs font-semibold text-gray-600 text-center">
                        Need an immediate answer or live architecture discussion?
                      </p>

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
                        <option value="Data Governance & Compliance">Data Governance &amp; Compliance (PDPA/GDPR)</option>
                        <option value="Automated PII Detection">Automated PII Scanning &amp; Masking</option>
                        <option value="Data Quality & MDM">Data Quality Monitoring &amp; Golden Records</option>
                        <option value="ERP & Warehouse Connectors">ERP / Database Connectors &amp; Setup</option>
                        <option value="Pricing & Enterprise Pilot">Pricing &amp; $0 Founding Customer Cohort (First 3 Only)</option>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
