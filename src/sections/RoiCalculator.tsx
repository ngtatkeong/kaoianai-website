import { useState } from 'react'
import { Calculator, ArrowRight, DollarSign, Clock, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

export default function RoiCalculator() {
  const [teamSize, setTeamSize] = useState<number>(10)
  const [recordCount, setRecordCount] = useState<number>(2) // Millions

  // Calculations
  // Average engineer/analyst spends ~12 hours/month on manual data hygiene, formatting, and PII checks
  const hoursSavedPerMonth = Math.round(teamSize * 14)
  // Average engineering rate $45/hour loaded cost
  const annualSavingsUsd = Math.round(hoursSavedPerMonth * 45 * 12)
  // Risk index
  const riskIndex = recordCount > 5 ? 'High' : recordCount > 1 ? 'Moderate' : 'Low'

  const handleSliderChange = (newTeamSize: number, newRecords: number) => {
    setTeamSize(newTeamSize)
    setRecordCount(newRecords)
    trackEvent('calculate_roi', {
      team_size: newTeamSize,
      db_records_millions: newRecords,
      estimated_annual_savings_usd: annualSavingsUsd,
      compliance_risk_score: riskIndex,
    })
  }

  return (
    <section id="roi-calculator" className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-sm font-medium mb-4">
            <Calculator size={16} />
            <span>Interactive ROI & Risk Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Calculate Your SME's Data Savings
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            See how much time and budget KaoinAI saves your team compared to manual validation scripts or enterprise consultants.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {/* Controls */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-sm space-y-6 sm:space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-800">
                  Data & Business Team Size:
                </label>
                <span className="text-base font-bold text-[#5b2d6e] bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                  {teamSize} People
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                value={teamSize}
                onChange={(e) => handleSliderChange(Number(e.target.value), recordCount)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b2d6e]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2 Users</span>
                <span>25 Users</span>
                <span>50+ Users</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-800">
                  Database & ERP Records Under Management:
                </label>
                <span className="text-base font-bold text-[#5b2d6e] bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                  {recordCount}M Records
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={recordCount}
                onChange={(e) => handleSliderChange(teamSize, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b2d6e]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>500k Records</span>
                <span>10M Records</span>
                <span>20M+ Records</span>
              </div>
            </div>

            <div className="bg-purple-50/60 rounded-xl p-4 border border-purple-100 text-xs text-gray-600 space-y-1.5">
              <p className="font-semibold text-[#5b2d6e]">💡 Assumptions based on SME benchmarks:</p>
              <p>• 14 hours saved per team member/month from automated DQ and lineage.</p>
              <p>• 99.4% automated detection of unmasked customer PII before audits.</p>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] rounded-2xl p-5 sm:p-8 text-white flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                Estimated Annual Impact
              </span>
              <div className="mt-4 space-y-5">
                <div>
                  <div className="text-xs text-gray-300 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-emerald-400" />
                    Estimated Annual Value & Savings
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                    ${annualSavingsUsd.toLocaleString()}
                    <span className="text-xs font-normal text-gray-400 ml-1">/yr</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div>
                    <div className="text-[11px] text-gray-300 flex items-center gap-1">
                      <Clock size={12} className="text-purple-300" />
                      Hours Saved
                    </div>
                    <div className="text-xl font-bold text-purple-200">
                      {hoursSavedPerMonth * 12} hrs/yr
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-gray-300 flex items-center gap-1">
                      <ShieldAlert size={12} className="text-amber-400" />
                      Compliance Risk
                    </div>
                    <div className="text-xl font-bold text-amber-300">
                      {riskIndex} (Mitigated)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Button
                size="lg"
                className="w-full bg-gradient-brand hover:opacity-95 text-white font-semibold shadow-lg group py-6 text-sm"
                onClick={() => {
                  trackEvent('click_cta', { location: 'roi_calculator', label: 'Claim ROI Assessment' })
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Claim Free Risk Audit
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[11px] text-center text-gray-400 mt-2">
                Includes full PII risk score and automated DQ benchmark.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
