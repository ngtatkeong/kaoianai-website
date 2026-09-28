import { Database, ShieldCheck, Zap, Activity } from 'lucide-react'

export default function TrustedBy() {
  const logos = [
    {
      name: 'NextPay Technologies',
      category: 'Fintech & Cross-Border Payments',
      badge: 'PostgreSQL • MAS TRM',
      iconText: 'NP',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      name: 'UrbanCart Commerce',
      category: 'Omnichannel Retail & Logistics',
      badge: 'Snowflake • PDPA §24',
      iconText: 'UC',
      color: 'from-purple-600 to-pink-600',
    },
    {
      name: 'MediSync Asia',
      category: 'Healthcare AI & Telemedicine',
      badge: 'MySQL • HIPAA / PDPA',
      iconText: 'MS',
      color: 'from-emerald-600 to-teal-600',
    },
    {
      name: 'FinMesh Capital',
      category: 'Algorithmic Asset Management',
      badge: 'BigQuery • dbt Lineage',
      iconText: 'FM',
      color: 'from-amber-600 to-orange-600',
    },
    {
      name: 'ASEAN Data Cloud',
      category: 'Enterprise Data Infrastructure',
      badge: 'Air-Gapped On-Premises',
      iconText: 'AD',
      color: 'from-cyan-600 to-blue-600',
    },
  ]

  const metrics = [
    {
      value: '45+',
      label: 'Production Databases Connected',
      sublabel: 'Postgres, Snowflake, BigQuery, MySQL',
      icon: Database,
    },
    {
      value: '1.8M+',
      label: 'Sensitive Records Protected',
      sublabel: 'Automated table-bound SHA-256 masking',
      icon: ShieldCheck,
    },
    {
      value: '99.98%',
      label: 'Schema Drift Detection Rate',
      sublabel: 'Continuous zero-lag CI/CD sync',
      icon: Activity,
    },
    {
      value: '< 15 Mins',
      label: 'Time to Live Catalog',
      sublabel: 'Zero consultants or months of setup',
      icon: Zap,
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-slate-200/80 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Label */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Trusted By Innovative Data &amp; Security Engineering Teams Across Singapore &amp; Malaysia
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${logo.color} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                  {logo.iconText}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-purple-700 transition-colors">
                    {logo.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {logo.category}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-mono">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 truncate max-w-full">
                  {logo.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Live Metrics Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0e0c1f] to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-purple-500/20 shadow-xl shadow-purple-950/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {metrics.map((m, idx) => {
              const Icon = m.icon
              return (
                <div key={idx} className={`flex items-start gap-4 ${idx > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-purple-400 mt-1">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                      {m.value}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
                      {m.label}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {m.sublabel}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
