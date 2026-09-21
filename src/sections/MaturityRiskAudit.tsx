import { useState } from 'react'
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  Database, 
  Lock, 
  FileText, 
  TrendingUp,
  Sliders
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface Question {
  id: number
  dimension: string
  title: string
  subtitle: string
  icon: typeof Database
  options: {
    text: string
    points: number
    detail: string
    risk: 'Low' | 'Moderate' | 'Critical'
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    dimension: 'Data Lineage & Architecture Visibility',
    title: 'How is your data lineage and schema topology currently tracked?',
    subtitle: 'Evaluate how changes in upstream tables propagate to downstream analytics and ERPs.',
    icon: Database,
    options: [
      {
        text: 'Fully automated, column-level graph synced in real-time across all databases',
        points: 20,
        detail: 'Instant visibility into upstream origins and downstream dashboard impact.',
        risk: 'Low'
      },
      {
        text: 'Documented manually in Confluence, Notion, or diagram tools (Lucidchart)',
        points: 10,
        detail: 'Documentation drifts out of date whenever engineers run schema migrations.',
        risk: 'Moderate'
      },
      {
        text: 'Tribal knowledge only — stored in individual engineers’ heads or undocumented',
        points: 0,
        detail: 'High single-point-of-failure risk and slow debugging when data pipelines break.',
        risk: 'Critical'
      }
    ]
  },
  {
    id: 2,
    dimension: 'Schema Drift & Anomaly Alerting',
    title: 'How do you detect schema mutations, deleted columns, or pipeline anomalies?',
    subtitle: 'Assess how quickly your team identifies data downtime and type discrepancies.',
    icon: Activity,
    options: [
      {
        text: 'Autonomous alerts trigger in Slack/Email immediately upon CDC or schema mutation',
        points: 20,
        detail: 'Proactive detection before broken queries reach business stakeholders.',
        risk: 'Low'
      },
      {
        text: 'Engineers spot errors during scheduled manual batch tests or weekly sanity checks',
        points: 10,
        detail: 'Pipeline breaks may persist for days before detection.',
        risk: 'Moderate'
      },
      {
        text: 'Reactively — when executives or clients see #ERROR, NaN, or corrupted dashboards',
        points: 0,
        detail: 'Severe reporting blind spots and loss of executive stakeholder trust.',
        risk: 'Critical'
      }
    ]
  },
  {
    id: 3,
    dimension: 'PII Protection & Table-Bound DPIA',
    title: 'How are sensitive customer identifiers (NRIC, cards, phones) governed?',
    subtitle: 'Measure your exposure to statutory Singapore PDPA, MAS TRM, or GDPR penalties.',
    icon: Lock,
    options: [
      {
        text: 'Automatically scanned, bound directly to physical table DPIAs, and dynamically masked',
        points: 20,
        detail: 'Living RoPA and automated SHA-256 tokenization on query execution.',
        risk: 'Low'
      },
      {
        text: 'Access is partially restricted via database roles, but raw PII is visible to developers',
        points: 10,
        detail: 'Internal insider leak risk and unmaintained statutory DPIA spreadsheets.',
        risk: 'Moderate'
      },
      {
        text: 'Unrestricted or plain text customer records stored in unencrypted tables/spreadsheets',
        points: 0,
        detail: 'High catastrophic risk of regulatory fines (up to 10% annual turnover under PDPA).',
        risk: 'Critical'
      }
    ]
  },
  {
    id: 4,
    dimension: 'Business Data Access & Analytics Velocity',
    title: 'How do non-technical teams (Finance, Ops, Sales) query governed data?',
    subtitle: 'Assess engineering bottleneck hours spent writing custom SQL extracts.',
    icon: TrendingUp,
    options: [
      {
        text: 'Autonomous conversational agent synthesizes validated dialect SQL in plain language',
        points: 20,
        detail: 'Sub-second access with zero developer backlog or security compromises.',
        risk: 'Low'
      },
      {
        text: 'They file engineering tickets and wait 2 to 5 business days for data extracts',
        points: 10,
        detail: 'Engineers lose 15+ hours weekly maintaining ad-hoc reporting scripts.',
        risk: 'Moderate'
      },
      {
        text: 'Manual CSV exports dumped onto local laptops and circulating via personal Excel files',
        points: 0,
        detail: 'Data silos, version confusion, and immediate security compliance breaches.',
        risk: 'Critical'
      }
    ]
  },
  {
    id: 5,
    dimension: 'Statutory Compliance & Audit Readiness',
    title: 'Are your production systems prepared for an unannounced regulatory audit?',
    subtitle: 'Evaluate your readiness for Singapore PDPA, MAS TRM, and GDPR Article 30 reviews.',
    icon: FileText,
    options: [
      {
        text: '1-click exportable audit reports: living RoPA, table-level DPIAs, and lineage logs ready',
        points: 20,
        detail: 'Complete mathematical schema proof ready for auditors in minutes.',
        risk: 'Low'
      },
      {
        text: 'Would require 3 to 6 weeks of manual cross-department spreadsheet assembly and panic',
        points: 10,
        detail: 'Substantial labor cost and inevitable documentation inconsistencies.',
        risk: 'Moderate'
      },
      {
        text: 'Completely unprepared — would expose severe compliance and governance violations',
        points: 0,
        detail: 'Critical exposure to regulatory enforcement, public censure, and liability.',
        risk: 'Critical'
      }
    ]
  }
]

export default function MaturityRiskAudit() {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [isCompleted, setIsCompleted] = useState(false)

  const handleSelect = (questionId: number, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: points }))
    trackEvent('audit_select_option', { question_id: questionId, points })
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsCompleted(true)
      const total = Object.values(answers).reduce((a, b) => a + b, 0)
      trackEvent('audit_completed', { final_score: total })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleRestart = () => {
    setAnswers({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
    setCurrentStep(1)
    setIsCompleted(false)
    trackEvent('audit_restart', {})
  }

  // Scoring Logic
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  
  // Maturity Level (1 to 5)
  let maturityLevel = 1
  let maturityTitle = 'Level 1: Initial / Ad-Hoc'
  let riskClassification = 'Critical Risk'
  let riskColor = 'text-rose-500'
  let riskBg = 'bg-rose-500/10 border-rose-500/30'
  let summaryText = 'Your data architecture operates with significant blind spots. Unmasked PII, untracked schema migrations, and manual spreadsheet dependencies create severe regulatory liability under Singapore PDPA and MAS TRM.'
  
  if (totalScore >= 85) {
    maturityLevel = 5
    maturityTitle = 'Level 5: Autonomous & Optimized'
    riskClassification = 'Low Risk'
    riskColor = 'text-emerald-400'
    riskBg = 'bg-emerald-500/10 border-emerald-500/30'
    summaryText = 'Outstanding governance posture. Your infrastructure enforces real-time schema tracking, table-bound DPIAs, and automated anomaly detection. KaoinAI can further accelerate non-technical query velocity.'
  } else if (totalScore >= 70) {
    maturityLevel = 4
    maturityTitle = 'Level 4: Managed & Governed'
    riskClassification = 'Low to Moderate Risk'
    riskColor = 'text-emerald-400'
    riskBg = 'bg-emerald-500/10 border-emerald-500/30'
    summaryText = 'Strong operational foundations. Minor vulnerabilities remain in cross-system lineage or ad-hoc query backlogs. Implementing automated living RoPAs will provide 100% audit confidence.'
  } else if (totalScore >= 50) {
    maturityLevel = 3
    maturityTitle = 'Level 3: Defined / Partial Visibility'
    riskClassification = 'Moderate Risk'
    riskColor = 'text-amber-400'
    riskBg = 'bg-amber-500/10 border-amber-500/30'
    summaryText = 'Your team loses substantial hours to manual documentation, SQL ticket queues, and reactive schema debugging. An estimated $40,000+ in engineering capacity is lost annually to data firefighting.'
  } else if (totalScore >= 30) {
    maturityLevel = 2
    maturityTitle = 'Level 2: Repeatable / Reactive'
    riskClassification = 'High Risk'
    riskColor = 'text-rose-400'
    riskBg = 'bg-rose-500/10 border-rose-500/30'
    summaryText = 'High vulnerability across production pipelines. Schema changes frequently break reporting, and customer PII is at risk of undocumented exposure during migrations.'
  }

  const currentQ = questions.find(q => q.id === currentStep)!
  const IconComponent = currentQ.icon

  return (
    <section id="audit" className="py-20 sm:py-28 bg-slate-950 text-white relative overflow-hidden scroll-mt-20 border-b border-slate-900">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-purple-300 text-xs font-semibold mb-4">
            <Sliders size={14} className="text-purple-400" />
            <span>Interactive Diagnostic • DAMA &amp; ISO/IEC 38505 Aligned</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Data Governance Maturity &amp; Risk Assessment
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Evaluate your organization's data maturity across 5 operational dimensions. Calculate your composite maturity level and associated risk profile in under 2 minutes.
          </p>
        </div>

        {!isCompleted ? (
          /* Assessment Card */
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                <span>Dimension {currentStep} of 5</span>
                <span>{currentStep * 20}% Complete</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${currentStep * 20}%` }}
                />
              </div>
            </div>

            {/* Question Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-800/40 text-purple-300 flex items-center justify-center shrink-0 mt-1">
                <IconComponent size={24} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                  {currentQ.dimension}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
                  {currentQ.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {currentQ.subtitle}
                </p>
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === opt.points
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(currentQ.id, opt.points)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-lg'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'border-purple-400 bg-purple-600' : 'border-slate-500'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="text-sm sm:text-base font-semibold text-white">
                          {opt.text}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase shrink-0 w-fit ${
                          opt.risk === 'Low' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' :
                          opt.risk === 'Moderate' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' :
                          'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                        }`}>
                          {opt.risk} Risk (+{opt.points} pts)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {opt.detail}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Previous
                </Button>
              ) : <div />}

              <Button
                onClick={handleNext}
                className="bg-white text-slate-950 hover:bg-slate-100 font-semibold px-6 shadow-md transition-colors"
              >
                {currentStep === 5 ? 'Compute Maturity & Risk' : 'Next Dimension'}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          /* Results Container */
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 backdrop-blur-xl animate-fade-in">
            <div className="text-center max-w-xl mx-auto mb-10">
              {/* Score Badge */}
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner mb-4 relative">
                <div className="text-center">
                  <span className="block text-4xl font-extrabold font-mono text-white">
                    {totalScore}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    out of 100
                  </span>
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${riskBg} ${riskColor}`}>
                {riskClassification === 'Low Risk' ? <ShieldCheck size={15} /> : <AlertTriangle size={15} />}
                <span>{maturityTitle} (Level {maturityLevel} of 5) • {riskClassification}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Maturity Score: {totalScore} / 100
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {summaryText}
              </p>
            </div>

            {/* Diagnostic Matrix Breakdown */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {questions.map(q => {
                const pts = answers[q.id] || 0
                const isPassing = pts >= 20
                const isPartial = pts === 10
                return (
                  <div key={q.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-300 truncate">{q.dimension}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isPassing ? 'bg-emerald-950/80 text-emerald-400' :
                        isPartial ? 'bg-amber-950/80 text-amber-400' :
                        'bg-rose-950/80 text-rose-400'
                      }`}>
                        {pts}/20 pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {isPassing ? 'Optimized: Fully automated control' :
                       isPartial ? 'Moderate: Manual process debt' :
                       'Vulnerable: Critical exposure point'}
                    </p>
                  </div>
                )
              })}
              <div className="bg-purple-950/30 p-4 rounded-2xl border border-purple-800/40 sm:col-span-2 lg:col-span-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-purple-200 mb-1">Estimated Annual Risk Exposure</span>
                <span className="text-xl font-bold font-mono text-purple-300">
                  {totalScore >= 80 ? '$0 (Fully Mitigated)' : totalScore >= 50 ? '$42,500/yr' : '$125,000+/yr'}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Based on developer debugging hours &amp; statutory compliance audits
                </p>
              </div>
            </div>

            {/* Executive Recommendations Box */}
            <div className="bg-slate-950/90 rounded-2xl p-5 sm:p-6 border border-slate-800 mb-8 text-left">
              <h4 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Immediate Remediation Recommendations</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Bind Physical Tables to Statutory DPIAs:</strong> Eliminate unmaintained spreadsheets by linking PostgreSQL/Snowflake tables directly to living RoPAs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Deploy CDC Schema Shift Monitoring:</strong> Auto-detect column additions and schema mutations before downstream queries and reports fail.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Activate Dynamic SHA-256 Masking:</strong> Protect sensitive identifiers at rest and in transit with zero-latency tokenization on read queries.</span>
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-100 font-semibold text-sm px-8 py-6 rounded-xl shadow-lg transition-colors"
                onClick={() => {
                  trackEvent('click_cta', { location: 'audit_results', label: `Deploy Pilot (Score ${totalScore})` })
                  document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Deploy KaoinAI to Remediate Vulnerabilities (14-Day Pilot)
                <ArrowRight size={16} className="ml-2" />
              </Button>

              <a
                href={getWhatsAppUrl(`Hi KaoinAI, we just completed the Data Governance Maturity Assessment. Our score was ${totalScore}/100 (${maturityTitle}, ${riskClassification}). Could we review our remediation plan?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors"
              >
                <span>Discuss with Solutions Architect</span>
              </a>

              <Button
                variant="ghost"
                onClick={handleRestart}
                className="text-slate-400 hover:text-white text-xs"
              >
                <RotateCcw size={14} className="mr-1.5" />
                Retake Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
