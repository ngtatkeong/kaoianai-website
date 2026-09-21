import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const faqs = [
  {
    question: 'What is KaoinAI and how is it different from legacy tools?',
    answer:
      'KaoinAI is an all-in-one AI data intelligence platform engineered specifically for SMEs. Unlike legacy tools (Collibra, Informatica, Alation) that cost $100k–$1M+ and take 6 months to deploy, KaoinAI connects in minutes, uses AI to auto-generate rules and metadata, and costs a fraction of enterprise software.',
  },
  {
    question: 'How does KaoinAI connect to our databases? Is our data secure?',
    answer:
      'KaoinAI operates on a read-only metadata architecture. We do NOT replicate or store your raw database rows on our servers. All connections use TLS 1.3 encryption with options for VPC peering and IP whitelisting. KaoinAI is built according to SOC 2 Type II and ISO 27001 security standards.',
  },
  {
    question: 'Which databases, data warehouses, and ERPs are supported?',
    answer:
      'KaoinAI is ERP-agnostic. We provide native connectors for PostgreSQL, MySQL, Google BigQuery, Snowflake, Amazon Redshift, Microsoft SQL Server, Oracle NetSuite, SAP, Salesforce, and Supabase. Custom JDBC/ODBC connectors are also available.',
  },
  {
    question: 'How does the PII Detection and compliance workflow work?',
    answer:
      'KaoinAI scans column names and sample data distributions using AI classification models to detect sensitive attributes (names, IC/NRIC, passport numbers, emails, payment data, health records). It flags compliance violations across GDPR, PDPA, HIPAA, and CCPA, and recommends automated masking rules.',
  },
  {
    question: 'How does KaoinAI tie DPIA and Data Inventory (RoPA) directly to database tables?',
    answer:
      'Unlike legacy privacy tools that store compliance records in disconnected spreadsheets or survey portals, KaoinAI anchors DPIA risk assessments and statutory Data Inventories directly to the physical database tables, schemas, and columns where PII resides. If an engineer migrates a schema or adds a new sensitive column in Postgres, MySQL, or Snowflake, KaoinAI automatically flags DPIA drift and updates your Singapore PDPA & GDPR Article 30 Data Inventory in real time.',
  },
  {
    question: 'Do we need data engineers or SQL experts to use KaoinAI?',
    answer:
      'No! KaoinAI features natural language interfaces ("Ask Data in Plain English"), AI-suggested validation rules, and automated dbt model generators. Non-technical compliance officers, business analysts, and fractional CTOs can manage the platform with ease.',
  },
  {
    question: 'What happens after the Free Trial ends?',
    answer:
      'Your free trial gives you full access to all core modules for 14 days without a credit card. At the end of the trial, you can choose a transparent monthly plan based on your connected data sources or transition to custom enterprise terms.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    const isOpening = openIndex !== index
    setOpenIndex(isOpening ? index : null)
    if (isOpening) {
      trackEvent('faq_toggle', {
        question: faqs[index].question,
        action: 'expand',
      })
    }
  }

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white/50 backdrop-blur-[2px] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-sm font-medium mb-4">
            <HelpCircle size={16} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about architecture, deployment, and autonomous governance with KaoinAI.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-purple-200 bg-purple-50/20 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 font-semibold text-gray-900 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-lg leading-snug">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#5b2d6e] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-5 text-xs sm:text-base text-gray-600 leading-relaxed border-t border-purple-100/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
