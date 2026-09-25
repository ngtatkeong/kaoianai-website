import { MessageSquare, Search, CheckCircle, Rocket } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Connect Your Data',
    description: 'Link your ERP, database, or data warehouse in minutes. KaoinAI works with any major system — no complex setup required.',
  },
  {
    number: '02',
    icon: Search,
    title: 'AI Discovers & Scans',
    description: 'Our AI automatically catalogs your data, detects PII, assesses quality, and identifies governance gaps across all connected sources.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Review AI Suggestions',
    description: 'Get intelligent recommendations for quality rules, governance policies, and MDM configurations. Approve with one click.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Deploy & Monitor',
    description: 'Activate rules, transformations, and compliance workflows. Monitor everything from a single dashboard with real-time alerts.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white/75 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How KaoinAI Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            From connection to insight in four simple steps. No data engineering team required.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-200 to-transparent" />
              )}
              <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all">
                <div className="text-3xl sm:text-4xl font-black text-purple-100 mb-3 sm:mb-4">{step.number}</div>
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-brand flex items-center justify-center mb-3 sm:mb-4">
                  <step.icon size={22} className="text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
