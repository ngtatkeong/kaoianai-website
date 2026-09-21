import { 
  Shield, 
  CheckCircle, 
  Database, 
  Brain, 
  GitBranch, 
  FileSearch, 
  TrendingUp, 
  AlertTriangle, 
  Zap,
  BarChart3,
  Leaf,
  ShieldCheck,
  Layers,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Data Governance (DG)',
    description: 'Enterprise-grade governance framework with role-based access control, audit trails, and compliance reporting for SOX, GDPR, HIPAA, and PDPA.',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: CheckCircle,
    title: 'Data Quality (DQ)',
    description: 'AI-powered quality monitoring with intelligent rule suggestions, natural language rule creation, completeness metrics, and violation tracking.',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Database,
    title: 'Master Data Management (MDM)',
    description: 'Automatic golden record creation, hierarchy management, deduplication, and cross-system master data synchronization.',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Table-Bound DPIA & Data Inventory',
    description: 'Binds statutory DPIAs and living Data Inventories (RoPA) directly to physical database tables & columns containing PII, with automated drift alerts and dynamic masking.',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: Brain,
    title: 'Ask Data — Natural Language',
    description: 'Query your ERP data in plain English. No SQL required. Get instant answers, visualizations, and export options.',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: GitBranch,
    title: 'Data Lineage',
    description: 'End-to-end column-level lineage tracing. Understand where your data comes from, how it transforms, and what it impacts.',
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
  },
  {
    icon: FileSearch,
    title: 'Smart Data Catalog',
    description: 'AI-generated documentation, business glossary, usage statistics, and intelligent search across all your data assets.',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
  },
  {
    icon: TrendingUp,
    title: 'Auto-Insights',
    description: 'Proactive anomaly detection, trend analysis, correlation discovery, and AI-generated actionable recommendations.',
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Zap,
    title: 'Data Transformations (dbt)',
    description: 'Create dbt models using natural language. Auto-generate SQL, YAML, tests, and documentation. Deploy to dbt Cloud in one click.',
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Scoring',
    description: 'Identify data risks before they become problems. Automated risk assessment with severity classification and remediation guidance.',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Leaf,
    title: 'ESG Analytics',
    description: 'Track and report Environmental, Social, and Governance metrics. AI-powered ESG insights aligned with global standards.',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: BarChart3,
    title: 'Schema Shifts Detection',
    description: 'Automatically detect schema changes, track drift, and get alerted when your database structure evolves unexpectedly.',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
  },
  {
    icon: Layers,
    title: 'Data Architect & Optimization',
    description: 'Autonomous schema analysis, normal form validation, index optimization recommendations, and SQL query efficiency tuning.',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50',
  },
  {
    icon: Globe,
    title: 'DPO Toolkit & ASEAN Compliance',
    description: 'Dedicated Data Protection Officer toolkit covering Singapore PDPA, Malaysia PDPA (2024), and Indonesia UU PDP with DSR workflows and review queues.',
    color: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[#5b2d6e] text-sm font-semibold mb-4 shadow-2xs">
            <Zap size={16} />
            <span>All-in-One Platform</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Everything You Need for Data Excellence
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From governance to analytics, KaoinAI covers every aspect of modern data management. 
            No more piecing together expensive point solutions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={26} className={`text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`} style={{ color: 'inherit' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2.5">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table-Bound DPIA & Data Inventory Spotlight Banner */}
        <div className="mt-16 sm:mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50 rounded-full blur-3xl -z-0 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Zero-Stale-Spreadsheets Guarantee</span>
              </span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                Direct Schema-to-Compliance Architecture
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Why Table-Linked DPIA & Data Inventory Storage Changes Everything
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mb-8 leading-relaxed">
              Traditional compliance platforms (OneTrust, manual surveys, static Excel sheets) store compliance records in isolated silos. When software engineers add tables or migrate schemas, compliance documents immediately become obsolete. <strong className="text-gray-900 font-semibold">KaoinAI binds DPIAs and Data Inventories (RoPA) directly to your production database tables containing PII</strong>, creating a living, audit-ready link between code and compliance.
            </p>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Physical Table Binding</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Every table with PII (Postgres, Snowflake, MySQL) is directly associated with its statutory DPIA assessment, legal processing basis, and retention schedule.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1">Autonomous Drift Alerts</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  When a developer introduces a new table or column containing customer identifiers, KaoinAI detects it via CDC and instantly triggers a DPIA drift notification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5b2d6e] flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h4 className="font-bold text-gray-900 text-base mb-1">1-Click Statutory Data Inventory (RoPA)</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Export auditable Data Inventories customized to Singapore PDPA, Malaysia PDPA (Daftar Pemprosesan), Indonesia UU PDP (Inventaris Data Pribadi), and GDPR Article 30 backed by live schema proof.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-12 sm:mt-16 bg-gradient-brand rounded-2xl p-6 sm:p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white">14+</div>
              <div className="text-purple-200 text-xs sm:text-sm mt-1">Core Modules</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white">6+</div>
              <div className="text-purple-200 text-xs sm:text-sm mt-1">Compliance Standards</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white">AI</div>
              <div className="text-purple-200 text-xs sm:text-sm mt-1">Native Throughout</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-white">1</div>
              <div className="text-purple-200 text-xs sm:text-sm mt-1">Unified Platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
