import { Shield, Scale, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

export default function TermsOfService() {
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
          <Scale size={14} />
          <span>Enterprise SaaS Agreement • Singapore Commercial Law</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">
          Last Updated &amp; Effective: September 28, 2026 • Version 2.2
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-12">
        <h2 className="text-base font-bold text-slate-950 mb-3 flex items-center gap-2">
          <Shield size={18} className="text-purple-600" />
          Enterprise Data Ownership &amp; IP Protection
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          You retain 100% ownership, title, and intellectual property rights over your databases, schemas, queries, metadata, and generated compliance records. KaoinAI asserts zero ownership over your proprietary information and never trains foundational public AI models on your private schema metadata.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using the KaoinAI platform (the &quot;Service&quot;), including our cloud web application, on-premises Docker containers, API connectors, and software tools provided by KaoinAI Pte. Ltd. (&quot;KaoinAI&quot;, &quot;we&quot;, &quot;us&quot;), you (&quot;Customer&quot; or &quot;User&quot;) agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you possess the authority to bind such entity.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            2. License &amp; Permitted Use
          </h2>
          <p className="mb-3">
            Subject to your compliance with these Terms and payment of applicable subscription fees, KaoinAI grants you a non-exclusive, non-transferable, revocable license to access and use the Service strictly for your internal business data governance, quality monitoring, and statutory compliance purposes.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <strong className="text-slate-900 block mb-1">Permitted:</strong>
              <p className="text-slate-600">Connecting PostgreSQL, Snowflake, BigQuery, MySQL, and ERP instances for metadata cataloging, PII scanning, RoPA generation, and lineage tracking.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-white">
              <strong className="text-slate-900 block mb-1">Prohibited:</strong>
              <p className="text-slate-600">Reverse-engineering platform code, reselling access as an unauthorized bureau, or attempting to circumvent security rate limits.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            3. Free Trial &amp; Subscription Terms
          </h2>
          <p className="mb-2">
            <strong>14-Day Free Trial:</strong> We offer a 14-day risk-free trial of all core governance modules with no credit card required. Upon expiration of the trial period, continuous access requires selection of an active subscription tier (Growth, Enterprise Cloud, or On-Premises Air-Gapped).
          </p>
          <p>
            <strong>Billing &amp; Cancellation:</strong> Paid subscriptions are billed on a monthly or annual cadence. You may cancel your subscription at any time prior to the next billing renewal cycle through your account dashboard or by notifying your account manager.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            4. Service Level Agreement (SLA)
          </h2>
          <p>
            For Enterprise Tier customers, KaoinAI commits to a <strong>99.9% monthly service uptime</strong> for our cloud metadata mesh and API services, excluding scheduled maintenance windows announced at least 48 hours in advance. For air-gapped on-premises deployments, uptime is maintained under the client&apos;s infrastructure governance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            5. Confidentiality &amp; Security Standards
          </h2>
          <p>
            Each party agrees to safeguard the confidential information of the other with the same degree of care it exercises with its own proprietary materials (at least reasonable care). KaoinAI maintains organizational and technical security measures aligned with SOC 2 Type II and ISO/IEC 27001, including mandatory TLS 1.3 encryption, automated vulnerability patching, and strict role-based access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, neither party will be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or business goodwill. KaoinAI&apos;s total aggregate liability arising out of or related to this agreement shall not exceed the amounts actually paid by Customer to KaoinAI in the twelve (12) months preceding the incident.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            7. Governing Law &amp; Dispute Resolution
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the substantive laws of the <strong>Republic of Singapore</strong>. Any dispute, controversy, or claim arising out of or relating to this contract, including its formation or validity, shall be resolved through good-faith negotiation, failing which it shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre (SIAC).
          </p>
        </section>

        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h2 className="text-base font-bold text-slate-950 mb-2">
            8. Questions &amp; Legal Notices
          </h2>
          <p className="text-xs text-slate-600 mb-2">
            For formal legal notices, service of process, or inquiries concerning these Terms:
          </p>
          <p className="text-xs text-slate-800">
            <strong>Legal Counsel:</strong> KaoinAI Pte. Ltd. • <a href="mailto:legal@kaoinai.com" className="text-purple-600 hover:underline">legal@kaoinai.com</a> / <a href="mailto:tk.ng@kaoinai.com" className="text-purple-600 hover:underline">tk.ng@kaoinai.com</a>
          </p>
        </section>
      </div>
    </div>
  )
}
