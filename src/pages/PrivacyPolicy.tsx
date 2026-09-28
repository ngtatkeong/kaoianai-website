import { ShieldCheck, Lock, EyeOff, Server, Database, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router'

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Breadcrumb / Back button */}
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#5b2d6e] text-xs font-semibold mb-4">
          <ShieldCheck size={14} />
          <span>Statutory Compliance • Singapore PDPA &amp; GDPR Aligned</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">
          Last Updated &amp; Effective: September 28, 2026 • Version 2.4
        </p>
      </div>

      {/* Core Architecture Callout */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white rounded-2xl border border-purple-200 p-6 sm:p-8 mb-12 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950 mb-2">
              Our Zero-Replication Architectural Commitment
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              KaoinAI operates on an intentional <strong>Read-Only Metadata Architecture</strong>. We do <strong>NOT</strong> copy, replicate, ingest, or store raw database rows, customer PII records, or production transaction tables on our cloud servers.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-purple-100">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Zero raw customer PII stored on KaoinAI</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-purple-100">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Metadata-only schema drift &amp; lineage analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-10 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3 flex items-center gap-2">
            1. Scope &amp; Applicable Data Protection Regulations
          </h2>
          <p className="mb-3">
            This Privacy Policy governs how KaoinAI Pte. Ltd. (operating in Singapore and Malaysia, referred to as &quot;KaoinAI&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, processes, uses, and safeguards information when you visit our website (<strong>kaoinai.com</strong>), use our cloud platform, deploy our self-hosted connectors, or communicate with our engineering and advisory team.
          </p>
          <p>
            We adhere strictly to statutory data protection frameworks across the jurisdictions where our clients operate, including the <strong>Singapore Personal Data Protection Act 2012 (PDPA)</strong>, the <strong>Monetary Authority of Singapore Technology Risk Management Guidelines (MAS TRM)</strong>, the <strong>Malaysia Personal Data Protection Act 2010 (PDPA)</strong>, the <strong>Indonesia Law No. 27/2022 on Personal Data Protection (UU PDP)</strong>, and the <strong>EU General Data Protection Regulation (GDPR)</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3 flex items-center gap-2">
            2. Categories of Information We Collect
          </h2>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Database size={16} className="text-purple-600" />
                A. Metadata &amp; Schema Information (Service Operations)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you connect your databases (PostgreSQL, Snowflake, MySQL, BigQuery, etc.), our agents query only statistical data catalog metadata: table names, column names, data types, index definitions, foreign key relationships, and statistical cardinality. <em>We never copy or extract the underlying records.</em>
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Server size={16} className="text-indigo-600" />
                B. Account &amp; Identity Information
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Business contact details including your work email address, company name, representative name, job role, and timezone when registering an account, booking a 1-on-1 architecture review, or completing a maturity diagnostic.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <EyeOff size={16} className="text-teal-600" />
                C. Ephemeral PII Scanning Samples
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When our local or cloud worker analyzes columns for sensitive PII (such as NRICs or phone numbers), data tokens are classified in-memory using local regex and lightweight models. They are instantly discarded once classification confidence is recorded in the metadata registry.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            3. Legal Processing Basis under Singapore PDPA &amp; GDPR
          </h2>
          <p className="mb-2">We process information solely under lawful statutory processing grounds:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Contractual Necessity:</strong> To provide autonomous governance, lineage graphing, and DPIA drift tracking under enterprise service agreements.</li>
            <li><strong>Consent:</strong> For inquiries, demonstration scheduling, and whitepaper downloads where you explicitly provide contact details.</li>
            <li><strong>Legitimate Interests:</strong> To detect security anomalies, prevent denial-of-service disruptions, and maintain platform uptime.</li>
            <li><strong>Legal Compliance:</strong> To generate statutory audit trails required under MAS TRM and PDPA accountability principles.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            4. Living RoPA &amp; Table-Bound DPIA Guarantees
          </h2>
          <p>
            KaoinAI assists organizations in generating their statutory <strong>Records of Processing Activities (RoPA)</strong> and <strong>Data Protection Impact Assessments (DPIAs)</strong>. In doing so, KaoinAI binds statutory registry entries directly to physical schema hashes. These records reflect the client&apos;s data governance posture and remain strictly the confidential property of the client.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            5. Sub-processors &amp; Data Residency
          </h2>
          <p className="mb-3">
            Our cloud infrastructure is hosted in top-tier, ISO 27001 and SOC 2 certified data centers located in <strong>Singapore</strong> and <strong>Malaysia</strong>. For enterprise customers requiring total air-gapped isolation, KaoinAI provides complete on-premises deployment via Docker and Kubernetes with zero external telemetry egress.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            6. Your Statutory Rights as a Data Subject
          </h2>
          <p className="mb-2">Under the Singapore PDPA, Malaysia PDPA, and GDPR, you possess the right to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Request access to personal data held by KaoinAI concerning you.</li>
            <li>Request prompt correction of any inaccurate or incomplete personal records.</li>
            <li>Withdraw consent for marketing communications or platform account retention.</li>
            <li>Request data portability or irreversible deletion of your user account profile.</li>
          </ul>
        </section>

        <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-950 mb-2 flex items-center gap-2">
            <Mail size={18} className="text-purple-600" />
            7. Data Protection Officer (DPO) Contact
          </h2>
          <p className="text-xs text-slate-600 mb-3">
            If you have questions, statutory access requests, or regulatory compliance inquiries regarding our privacy standards, please contact our designated Data Protection Officer:
          </p>
          <div className="text-xs text-slate-800 space-y-1">
            <p><strong>Designation:</strong> Data Protection Officer &amp; Security Counsel</p>
            <p><strong>Email:</strong> <a href="mailto:dpo@kaoinai.com" className="text-purple-600 hover:underline">dpo@kaoinai.com</a> / <a href="mailto:tk.ng@kaoinai.com" className="text-purple-600 hover:underline">tk.ng@kaoinai.com</a></p>
            <p><strong>Address:</strong> KaoinAI Pte. Ltd., Singapore &amp; Kuala Lumpur</p>
          </div>
        </section>
      </div>
    </div>
  )
}
