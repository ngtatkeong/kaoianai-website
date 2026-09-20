import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const problems = [
  'Enterprise data tools cost $500K–$2M+ to implement',
  'SMEs lack dedicated data engineering teams',
  'Compliance (GDPR, PDPA) is complex and expensive',
  'Data quality issues go undetected for months',
  'Master data is fragmented across systems',
]

const solutions = [
  'KaoinAI delivers the same power at a fraction of the cost',
  'AI-native — no coding or SQL expertise required',
  'Built-in compliance scanning and automated reporting',
  'Real-time quality monitoring with AI-suggested rules',
  'Unified MDM with automatic golden record creation',
]

export default function ProblemSolution() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why SMEs Struggle with Data
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade data management has always been out of reach for small and medium businesses.
            Until now.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-12">
          <div className="bg-red-50/50 rounded-2xl p-5 sm:p-8 border border-red-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">The Problem</h3>
            </div>
            <ul className="space-y-3.5 sm:space-y-4">
              {problems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50/50 rounded-2xl p-5 sm:p-8 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <CheckCircle size={20} className="text-[#5b2d6e]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">The KaoinAI Solution</h3>
            </div>
            <ul className="space-y-4">
              {solutions.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
