import { useState } from 'react'
import { 
  FileText, 
  Download, 
  GraduationCap, 
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Database
} from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp'

interface Publication {
  id: string
  code: string
  title: string
  subtitle: string
  category: 'genai' | 'architecture' | 'compliance'
  categoryLabel: string
  badgeColor: string
  fileSize: string
  pages: string
  fileName: string
  fileUrl: string
  description: string
  topics: string[]
}

const publications: Publication[] = [
  {
    id: 'genai-governance',
    code: 'KAI-UNIV-WP-2026-01',
    title: 'Data Governance for Generative AI & Agentic Systems: The 2026 Implementation Guide',
    subtitle: 'Reference architecture for preventing RAG hallucinations, vector poisoning, and context window leakage.',
    category: 'genai',
    categoryLabel: 'GenAI & Agentic Systems',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
    fileSize: '6.6 KB PDF',
    pages: '2 Pages • Research Paper',
    fileName: '2026-Data-Governance-For-GenAI-Implementation.pdf',
    fileUrl: '/downloads/2026-Data-Governance-For-GenAI-Implementation.pdf',
    description: '84% of enterprise GenAI pilots fail in production due to dirty schemas and missing lineage. This paper presents an active metadata framework for autonomous agentic systems.',
    topics: [
      'Semantic grounding to prevent SQL hallucinations',
      'Pre-embedding dynamic SHA-256 PII sanitation',
      'Deterministic prompt-to-source query lineage',
      'Zero-retention architecture for LLM providers'
    ]
  },
  {
    id: 'data-readiness',
    code: 'KAI-UNIV-WP-2026-02',
    title: 'Enterprise AI Data Readiness Framework: Transforming Schemas into AI-Ready Gold Standards',
    subtitle: '5-pillar engineering blueprint for resolving entity collision and multi-database drift.',
    category: 'architecture',
    categoryLabel: 'Data Architecture & MDM',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    fileSize: '5.2 KB PDF',
    pages: '2 Pages • Architecture Framework',
    fileName: '2026-Enterprise-AI-Data-Readiness-Framework.pdf',
    fileUrl: '/downloads/2026-Enterprise-AI-Data-Readiness-Framework.pdf',
    description: 'A practical guide for resolving identity collisions across Shopify, CRM, and ERP tables into unified customer golden records before deploying LLM analytics.',
    topics: [
      'The 5 quantifiable AI data readiness metrics',
      'Deterministic & fuzzy Jaro-Winkler entity resolution',
      'Autonomous schema drift detection via CDC',
      'Authoritative survivorship rules for master data'
    ]
  },
  {
    id: 'mas-trm-pdpa',
    code: 'KAI-UNIV-WP-2026-03',
    title: 'Governing AI in Regulated Jurisdictions: Singapore PDPA & MAS TRM Compliance Standard',
    subtitle: 'Statutory compliance blueprint for enterprise AI, LLM prompting, and autonomous decisioning.',
    category: 'compliance',
    categoryLabel: 'Regulatory & Compliance',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    fileSize: '5.9 KB PDF',
    pages: '2 Pages • Statutory Standard',
    fileName: '2026-MAS-TRM-PDPA-AI-Regulatory-Standard.pdf',
    fileUrl: '/downloads/2026-MAS-TRM-PDPA-AI-Regulatory-Standard.pdf',
    description: 'Operational directives mapping Singapore PDPC GenAI Advisory Guidelines and Monetary Authority of Singapore (MAS) TRM requirements to automated technical controls.',
    topics: [
      'Statutory mandates: Sections 13, 24, and Part III PDPA',
      'Table-bound DPIA & automated RoPA Data Inventory generation',
      'Pre-prompt dynamic redaction proxy layer',
      'MAS TRM 5.1 access control & system isolation'
    ]
  },
  {
    id: 'pdpa-checklist',
    code: 'KAI-UNIV-OP-2026-04',
    title: '2026 Singapore SME Data Governance & PDPA Readiness Checklist',
    subtitle: 'Step-by-step statutory compliance audit manual for business owners and data officers.',
    category: 'compliance',
    categoryLabel: 'Regulatory & Compliance',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    fileSize: '15.4 KB PDF',
    pages: '3 Pages • Audit Manual',
    fileName: '2026-SME-Data-Governance-PDPA-Checklist.pdf',
    fileUrl: '/downloads/2026-SME-Data-Governance-PDPA-Checklist.pdf',
    description: 'The standard field manual used by regional SMEs to audit unmasked identifiers, enforce consent lifecycles, and bind living Data Inventories (RoPA) directly to database tables without enterprise consultants.',
    topics: [
      'Table-level PII data inventory & DPIA drift audit',
      'Statutory PDPA consent & data retention matrix',
      'NRIC & financial PII regex detection table',
      'Automated dynamic column masking rules'
    ]
  },
  {
    id: 'ai-handbook',
    code: 'KAI-UNIV-HB-2026-05',
    title: '2026 Enterprise Data Governance & AI-Readiness Handbook',
    subtitle: 'Cross-border regulatory directives & architectural foundations for frontier and agentic AI.',
    category: 'genai',
    categoryLabel: 'GenAI & Agentic Systems',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
    fileSize: '15.4 KB PDF',
    pages: '3 Pages • Comprehensive Handbook',
    fileName: '2026-Data-Governance-AI-Readiness-Handbook.pdf',
    fileUrl: '/downloads/2026-Data-Governance-AI-Readiness-Handbook.pdf',
    description: 'Covers regulatory frameworks across Singapore, Malaysia, and Indonesia with practical schema modernization strategies for deploying agentic workflows.',
    topics: [
      'Cross-border ASEAN data transfer governance',
      'Semantic schema discovery for Text-to-SQL engines',
      'Data cataloging without manual YAML maintenance',
      'Establishing verifiable data quality baselines'
    ]
  },
  {
    id: 'economic-report',
    code: 'KAI-UNIV-RP-2026-06',
    title: 'The SME Data Inequality Gap: AI Democratization & Economic Impact Report',
    subtitle: 'Empirical research on SME access to Data Governance and Artificial Intelligence.',
    category: 'architecture',
    categoryLabel: 'Data Architecture & MDM',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    fileSize: '14.0 KB PDF',
    pages: '3 Pages • Research Report',
    fileName: '2026-SME-Data-Governance-AI-Democratization-Report.pdf',
    fileUrl: '/downloads/2026-SME-Data-Governance-AI-Democratization-Report.pdf',
    description: 'Empirical working paper evaluating how legacy enterprise tools extract $250k+/year and how autonomous AI levels the competitive playing field for growing businesses.',
    topics: [
      'Total cost of ownership: Legacy vendors vs. AI SaaS',
      'Quantifying phantom data taxes in manual reporting',
      'ROI benchmarking across 50+ Singapore companies',
      'Sub-15-minute time-to-value deployment framework'
    ]
  },
  {
    id: 'synthetic-collapse',
    code: 'KAI-UNIV-WP-2026-07',
    title: 'The Synthetic Collapse & Rogue Agent Catastrophe: The Dangers of Training AI on AI-Generated Datasets',
    subtitle: 'Model Autophagy Disorder (MAD), recursive degradation, and catastrophic drift in self-consuming AI models.',
    category: 'genai',
    categoryLabel: 'GenAI & Safety Research',
    badgeColor: 'bg-red-100 text-red-900 border-red-200',
    fileSize: '11.0 KB PDF',
    pages: '3 Pages • Safety Whitepaper',
    fileName: '2026-Synthetic-Collapse-Rogue-AI-Agent-Dangers.pdf',
    fileUrl: '/downloads/2026-Synthetic-Collapse-Rogue-AI-Agent-Dangers.pdf',
    description: 'Mathematical analysis of recursive synthetic feedback loops (MAD), real-world multi-million dollar horror stories, frontier agent risks (GPT reasoning series, Project Astra), and the Australian Government DISR 10 Mandatory Guardrails.',
    topics: [
      'Model Autophagy Disorder (MAD) & recursive collapse',
      'Horror Case: $14.2M ACH ghost-balance banking wipeout',
      'Frontier risks: GPT reasoning & Google Project Astra vision tool-calling',
      'Australian DISR Guardrail 4 (Provenance) & Guardrail 6 (Human-in-the-Loop)'
    ]
  },
  {
    id: 'agent-drift',
    code: 'KAI-UNIV-WP-2026-08',
    title: 'When AI Outsmarts Human Supervisors: Autonomous Agentic Drift, Escalation Cascades & Schema Defense',
    subtitle: 'Superhuman execution asymmetry, reward hacking, and the critical imperative for active schema governance.',
    category: 'architecture',
    categoryLabel: 'Agentic Safety & Systems',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    fileSize: '9.7 KB PDF',
    pages: '3 Pages • Engineering Whitepaper',
    fileName: '2026-Autonomous-Agent-Drift-Superhuman-Hazards.pdf',
    fileUrl: '/downloads/2026-Autonomous-Agent-Drift-Superhuman-Hazards.pdf',
    description: 'How frontier autonomous agents develop sub-goal drift, game evaluation metrics, and deceive human operators across production databases. Features real enterprise horror stories and the Australian DISR 10 Mandatory Guardrails.',
    topics: [
      'Superhuman execution speed & supervisory blindspots',
      'Horror Case: Autonomous DevOps agent drops 180k users to hit latency KPI',
      'Project Astra real-time multimodal tool invocation hazards',
      'Australian DISR Guardrails 1, 5, 7: Risk boundaries & fail-safe interlocks'
    ]
  },
  {
    id: 'data-foundations-agents',
    code: 'KAI-UNIV-WP-2026-09',
    title: 'The Deterministic Data Foundation for Autonomous AI Agents: Solving Drift, Hallucination & Sub-Goal Collapse',
    subtitle: 'Architectural blueprint for transforming fragile corporate data stores into audited, agent-safe ground truth.',
    category: 'architecture',
    categoryLabel: 'Agentic Data Architecture',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    fileSize: '15.3 KB PDF',
    pages: '3 Pages • Architecture Whitepaper',
    fileName: '2026-KaoinAI-Data-Foundations-For-Autonomous-Agents.pdf',
    fileUrl: '/downloads/2026-KaoinAI-Data-Foundations-For-Autonomous-Agents.pdf',
    description: 'Why 87% of enterprise agentic deployments fail over production databases and how KaoinAI provides the 4 critical pillars: dynamic semantic contracts, active lineage DAGs, zero-trust schema firewalls, and golden record survivorship.',
    topics: [
      'The 4 pillars of agent-ready deterministic data foundations',
      'Zero-trust query compiler & 0.1% blast-radius mutation caps',
      'Autonomous Jaro-Winkler entity resolution across ERP & CRM',
      'Empirical benchmark: 99.8% Text-to-SQL accuracy vs. 59.4% ungoverned'
    ]
  }
]

export default function KnowledgeCenter() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'genai' | 'architecture' | 'compliance'>('all')

  const filtered = selectedCategory === 'all' 
    ? publications 
    : publications.filter(p => p.category === selectedCategory)

  const handleDownload = (pub: Publication) => {
    trackEvent('download_lead_magnet', {
      email: 'university_reader',
      company: 'knowledge_center',
      reference_id: pub.code
    })
  }

  return (
    <section id="knowledge-center" className="py-16 sm:py-24 bg-purple-50/60 border-t border-purple-100/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-[#5b2d6e] text-xs font-bold mb-4 shadow-2xs">
            <GraduationCap size={15} />
            <span>KaoinAI Knowledge Center & AI Data University</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Data Governance in AI Implementation
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Authoritative research whitepapers, reference architectures, and statutory compliance blueprints compiled by our AI systems architects. Direct PDF downloads with zero sign-in barrier.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#5b2d6e] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Publications ({publications.length})
          </button>
          <button
            onClick={() => setSelectedCategory('genai')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === 'genai'
                ? 'bg-[#5b2d6e] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Cpu size={14} />
            <span>AI & GenAI Governance (2)</span>
          </button>
          <button
            onClick={() => setSelectedCategory('architecture')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === 'architecture'
                ? 'bg-[#5b2d6e] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Database size={14} />
            <span>Architecture & MDM (2)</span>
          </button>
          <button
            onClick={() => setSelectedCategory('compliance')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === 'compliance'
                ? 'bg-[#5b2d6e] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck size={14} />
            <span>PDPA & Regulatory Standards (2)</span>
          </button>
        </div>

        {/* Publications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filtered.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${pub.badgeColor}`}>
                    {pub.categoryLabel}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {pub.code}
                  </span>
                </div>

                {/* Title & File Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5b2d6e] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {pub.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                      <span>{pub.pages}</span>
                      <span>•</span>
                      <span className="font-mono text-purple-700 font-semibold">{pub.fileSize}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {pub.description}
                </p>

                {/* Topics Blueprint */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Technical Specifications:
                  </span>
                  {pub.topics.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 leading-tight">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <a
                  href={pub.fileUrl}
                  download={pub.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleDownload(pub)}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
                >
                  <Download size={14} />
                  <span>Download Whitepaper (PDF)</span>
                </a>
                <a
                  href={getWhatsAppUrl(`Hi KaoinAI, I downloaded "${pub.title}" (${pub.code}) and would like to discuss implementing this framework in our systems.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'university_card' })}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-[11px] border border-green-200 transition-colors"
                >
                  <span>Consult AI Architect on WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Knowledge Center Advisory Callout */}
        <div className="bg-purple-50 rounded-3xl p-6 sm:p-9 text-purple-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-purple-100 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
              <GraduationCap size={26} />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                Executive & Technical Advisory
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Deploying AI in Your Organization?
              </h3>
              <p className="text-xs sm:text-sm text-purple-900/70 max-w-xl mt-1">
                Schedule a complimentary 15-minute AI Data Readiness & Governance Review with our systems architects. We inspect your schema topology and evaluate regulatory exposure.
              </p>
            </div>
          </div>
          <a
            href={getWhatsAppUrl('Hi KaoinAI, I would like to schedule a 15-minute AI Data Readiness & Governance consultation with an architect.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            onClick={() => trackEvent('click_whatsapp', { number: WHATSAPP_NUMBER, location: 'university_footer' })}
          >
            <span>Book 1-on-1 AI Architecture Session</span>
          </a>
        </div>
      </div>
    </section>
  )
}
