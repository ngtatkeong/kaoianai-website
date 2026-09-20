import { Database, Server, Cloud, Layers } from 'lucide-react'

const integrations = [
  { name: 'PostgreSQL', category: 'Database', icon: Database },
  { name: 'Snowflake', category: 'Data Warehouse', icon: Cloud },
  { name: 'Oracle NetSuite', category: 'ERP System', icon: Layers },
  { name: 'Google BigQuery', category: 'Cloud Warehouse', icon: Cloud },
  { name: 'SAP S/4HANA', category: 'Enterprise ERP', icon: Server },
  { name: 'MySQL', category: 'Database', icon: Database },
  { name: 'Salesforce CRM', category: 'Business Apps', icon: Layers },
  { name: 'Microsoft SQL Server', category: 'Database', icon: Database },
  { name: 'Amazon Redshift', category: 'Cloud Warehouse', icon: Cloud },
  { name: 'Databricks', category: 'Lakehouse', icon: Cloud },
  { name: 'Supabase', category: 'Modern DB', icon: Database },
  { name: 'MongoDB', category: 'NoSQL', icon: Database },
]

export default function Integrations() {
  return (
    <section className="py-12 sm:py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
            Frictionless Connectivity
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Seamlessly Integrates with Your Existing Data Stack
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-2">
            Connect securely via read-only credentials in under 5 minutes. No complex agents or firewall overhauls.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {integrations.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-purple-200 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2 text-[#5b2d6e] group-hover:scale-110 transition-transform">
                <item.icon size={20} />
              </div>
              <span className="text-sm font-semibold text-gray-800 text-center">{item.name}</span>
              <span className="text-[11px] text-gray-400 text-center">{item.category}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Zero Data Ingestion / Read-Only Metadata
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            TLS 1.3 & AES-256 Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            VPC Peering & Dedicated IPs Available
          </span>
        </div>
      </div>
    </section>
  )
}
