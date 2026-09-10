# KaoinAI Website — Comprehensive Engineering & Design Memory

> **Last Updated**: August 2026  
> **Entity**: KaoinAI Pte Ltd (Singapore & Malaysia)  
> **Product**: DataSense Platform (AI-Native Data Intelligence, Automated Lineage & 4D Quality Monitoring)  
> **Repository**: `d:\kaoinai-website`  
> **Domain**: `https://kaoinai.com`  
> **LinkedIn**: `https://www.linkedin.com/company/kaoinai-pte-ltd`

---

## 1. Core Brand Directives & Tone

* **Hero Section Dual Core Thesis (Harmonized)**:
  * **Data Governance & AI for All**: Democratic, accessible data governance and conversational intelligence for every enterprise, SME, and team—no SQL, no consultants, no enterprise price tag.
  * **Hero Subhead Value Proposition**: Directly articulates that Data Governance (DG) is indispensable for AI today because frontier models hallucinate on dirty data—yet legacy enterprise DG software and consulting implementations demand six-figure budgets that are cost-prohibitive for SMEs. KaoinAI breaks this barrier: delivering automated, AI-native data governance, real-time quality curing, and verified intelligence at a fraction of the cost.
  * **Good Data Governance is the Foundation of AI**: In the age of AI agents and LLMs, AI only knows how to answer with your data. If data is messy, unindexed, or ungoverned, frontier models hallucinate and produce junk decisions.
  * **KaoinAI Autonomous Curing**: We don't just monitor data—we clean, cure, repair schema drift, mask PII, and make data understandable and fit for purpose for AI.
  * **Phonetic Pronunciation & Ethos**: Hero badge and pronunciation bar feature `KaoinAI [Kay-on A.I.]` · `κοινή · koinai — common, shared for all. Intelligence for All.`
* **Header Architecture**:
  * **Logo Mark Only**: The top-left header contains **only the pure 72px × 72px logo icon** (`logo.webp` with `border-radius: 16px; box-shadow: 0 4px 22px rgba(0, 0, 0, 0.45)`). **No accompanying "KaoinAI" text in the header**.
  * **Navbar Height**: `88px` sticky/fixed top bar with `background: rgba(7, 7, 11, 0.88)` and `backdrop-filter: blur(24px)`.
* **Authenticity & Honest Messaging (Zero False Artifacts)**:
  * **No Fake Browser Windows**: Never use macOS colored window dots (`red`, `yellow`, `green`) or fake browser address bars (`localhost:5173/...`).
  * **Enterprise SaaS Status Headers**: Showcase UI cards use real product module toolbars (`🟢 DataSense Engine`, `Production Workspace · v19.2`, `4D Anomaly Detector`, etc.).
  * **Honest Demo Terminology & Simulation Notices**: All interactive previews are framed as **"DataSense Interactive Feature Tour"** accompanied by transparent sample data disclaimers. In `demo.html`, the "Run AI Query" workflow features both a persistent notice badge (*"Simulation Only — For a real live demo connected to your databases, contact us"*) and an interactive toast popup on click with a direct link to book a real live demo.

---

## 1.1 Search Engine Optimization (SEO) & Generative Engine Optimization (GEO) for "DG within AI"

When searches occur where the context is **DG within AI** (Data Governance within AI):
* **Core Keywords Targeted**: `DG within AI`, `data governance within AI`, `data governance for AI`, `DG in AI`, `AI data governance`, `DG in the age of agentic AI`, `data governance and AI for all`, `DG foundation of AI`, `fix messy data for AI`, `make data fit for purpose for AI`.
* **Schema.org Structured Data**: 15+ FAQPage entities embedded in [index.html](file:///d:/kaoinai-website/index.html) answering questions on DG within AI, hallucinations, and democratization.
* **LLMs.txt**: Canonical AI crawler documentation optimized for Perplexity, ChatGPT Search, Claude, and Gemini with explicit technical definitions of DG within AI.
* **Robots.txt Directives**: Unrestricted indexation for major search engines and modern AI bot user-agents.

## 1.2 Conversion Rate Optimization (CRO) & Free Trial Architecture

To prevent visitors from endlessly lingering on simulations and educational guides without converting:
* **Global Free Trial Modal (`window.openTrialModal`)**: Built into `telemetry.js` and active across all 13 production pages. Captures work email, database selection (PostgreSQL, MySQL, Snowflake, BigQuery, ClickHouse, SQL Server, Excel/CSV), and primary governance objective with 0-friction modal popup.
* **Hero Free Trial Launchpad**: Above-the-fold inline email onboarding input with 4 trust badges (14-day access, 5-min setup, no CC, read-only metadata connector) and database compatibility chips.
* **Sticky Conversion Anchor (Quick Bar)**: Replaced passive browsing links with a persistent glowing `[Start Free Trial (No CC) →]` anchor that follows user scroll.
* **Strategic Mid-Page Intercepts**: Free Trial conversion cards embedded immediately following key decision moments: "Why Bad Data Defeats Good AI", the Stack Compatibility Generator, all 4 Target Personas, the 14-module Showcase, and Pricing.
* **Subpage Conversion Bridges**: `demo.html` (persistent trial banner + bottom DB connect action), `roi-calculator.html` (converts calculated dollar savings directly into trial modal), and `audit.html` (routes audit remediation into trial onboarding).
* **Dual Exit-Intent & Lingering Hook**: Intercepts abandonments with combined Free Trial activation and 2026 AI Governance Handbook delivery; includes a subtle 50-second non-intrusive trial nudge toast.


## 2. Global Navigation & Footer Standards (Across All 11 Pages)

All 11 HTML files adhere to identical, synchronized structure:

### Desktop Navbar (11 Navigation Items + Lang Switcher):
1. `[Logo Icon Only (72px)]` &rarr; `index.html`
2. `Our Story` &rarr; `index.html#story`
3. `DataSense Platform` &rarr; `index.html#features`
4. `Who It's For` &rarr; `index.html#personas`
5. `Industries` &rarr; `index.html#use-cases`
6. `Consulting` &rarr; `index.html#services`
7. `Live Demo` &rarr; `demo.html`
8. `ROI Calculator` &rarr; `roi-calculator.html`
9. `Blog` &rarr; `blog.html`
10. `FAQ` &rarr; `index.html#faq`
11. `Start Free` &rarr; `index.html#cta`
12. **Language Switcher**: `.lang-switcher` (`EN` | `ID` | `MS` | `简`)

---

## 3. Production Page Inventory (13 Pages)

| File | Page Purpose | Key Features & Implementation |
| :--- | :--- | :--- |
| [index.html](file:///d:/kaoinai-website/index.html) | Homepage & Main Hub | Primary ranking authority for "DG and AI". Hero ("DG and AI for All"), Story, DataSense Platform, SME Personas, Day-in-the-Life, 12 Simulated UI Mockup Browsers, "Why Bad Data Defeats Good AI" visual section, Pricing, Interactive FAQ, CTA. |
| [dg-and-ai.html](file:///d:/kaoinai-website/dg-and-ai.html) | Definitive DG and AI Authority Guide | Exact-match SEO landing page for "DG and AI". Featured definition block, comparison grid (AI Without DG vs. DG and AI Unified), 5 architectural pillars, interactive simulation console, and dedicated FAQPage Schema. |
| [demo.html](file:///d:/kaoinai-website/demo.html) | Interactive Feature Tour | Query generator simulator (Natural Language &rarr; SQL), Automated Column Lineage Graph, 4D Data Quality Monitor with dual simulation notices and interactive contact toast. |
| [roi-calculator.html](file:///d:/kaoinai-website/roi-calculator.html) | SME ROI Savings Engine | Real-time interactive sliders (Team size, SQL tickets, legacy tool spend, pipeline outages) with instant annual ROI output. |
| [audit.html](file:///d:/kaoinai-website/audit.html) | Free SME Data Health Audit | 5-step interactive governance & PII assessment wizard with instant diagnostic score and recommendations. |
| [blog.html](file:///d:/kaoinai-website/blog.html) | Knowledge Base & Articles | Searchable, category-filtered engineering and SME governance blog with newsletter capture. |
| [blog-sme-data-governance-ai-cost-research.html](file:///d:/kaoinai-website/blog-sme-data-governance-ai-cost-research.html) | SME Data Inequality Research Whitepaper | Deep empirical study on the 4 hidden phantom taxes costing SMEs $75k+ annually, why 99% are priced out of legacy DG, and why democratizing DG within AI is urgent. Includes interactive phantom tax simulator. |
| [blog-avengers-data-governance.html](file:///d:/kaoinai-website/blog-avengers-data-governance.html) | Avengers Data Governance & AI Metaphor | Viral strategic analysis with interactive animated HUD battle simulator comparing Infinity War failure to Endgame victory. |
| [blog-data-governance-checklist.html](file:///d:/kaoinai-website/blog-data-governance-checklist.html) | 15-Minute Audit Checklist & Statutory Engine | Interactive 4-tab checklist and dynamic country-specific Data Inventory Map & DPIA engine for Singapore (PDPC DIM & 6-Phase DPIA), Malaysia (JPDP System Register & PIA), and Indonesia (UU PDP 27/2022 Pasal 31 RoPA & Pasal 34 DPIA). Includes printable PDF download. |
| [blog-natural-language-sql.html](file:///d:/kaoinai-website/blog-natural-language-sql.html) | Plain English SQL Guide | Tutorial on conversational data querying with zero hallucinations, RBAC enforcement, and superhero defense comparison. |
| [blog-waste-enterprise-tools.html](file:///d:/kaoinai-website/blog-waste-enterprise-tools.html) | SME Cost Guide | Detailed breakdown of why SMEs overspend $50k+ on legacy enterprise stacks and how AI-native tooling solves it. |
| [vs-collibra.html](file:///d:/kaoinai-website/vs-collibra.html) | Comparison: KaoinAI vs Collibra | Detailed B2B feature, pricing, and deployment breakdown targeting mid-market & SMEs. |
| [vs-monte-carlo.html](file:///d:/kaoinai-website/vs-monte-carlo.html) | Comparison: KaoinAI vs Monte Carlo | Observability and automated lineage comparison highlighting lightweight, unified architecture. |

---

## 4. Peer-Reviewed & Statutory PDF Publications

1. [downloads/2026-Data-Governance-AI-Readiness-Handbook.pdf](file:///d:/kaoinai-website/downloads/2026-Data-Governance-AI-Readiness-Handbook.pdf): Publication-grade PDF handbook grounded in Singapore PDPC, Malaysia JPDP Act 709 / Act A1727, Indonesia UU PDP 27/2022, ISO/IEC 42001:2023, DAMA-DMBOK2, including full country-specific Data Inventory and DPIA statutory matrices.
2. [downloads/2026-SME-Data-Governance-AI-Democratization-Report.pdf](file:///d:/kaoinai-website/downloads/2026-SME-Data-Governance-AI-Democratization-Report.pdf): Working paper (WP-2026-04) analyzing the macroeconomic SME Data Inequality Gap, 4 phantom taxes costing SMEs $75,000+ annually, and the 5 architectural pillars of democratized DG within AI.

---

## 5. Technical Architecture, Verification & Deployment Suite

* **Zero Dependencies**: Pure HTML5, Modern CSS (Custom properties, grid, flex, clamp, backdrop filters), and Vanilla ES6 JavaScript.
* **Production Repository**: `https://github.com/ngtatkeong/kaoinai.git` (`main` branch)
* **Production VPS**: `app.kaoinai.com` (`187.77.154.93`), Webroot: `/opt/kaionai-site`
* **Custom Reusable Skill**:
  * Installed at `.agents/skills/kaoinai-platform-workflow/SKILL.md` and global `~/.gemini/config/skills/kaoinai-platform-workflow/SKILL.md`.
* **Automated Audit Suite**:
  * `scratch/full_site_audit.py`: Validates 0 broken links, 0 broken images, 0 broken anchors, 100% nav/footer consistency, and valid Schema.org JSON-LD across all 12 production pages.
* **Inbound Inquiries & Telemetry**:
  * Floating widget (`telemetry.js`) and all page footers route "Request Information" and "Feedback" directly to `tk.ng@kaoinai.com` with Formspree fallback and direct mailto handlers.
* **Production Deployment Cycle**:
  * ⚠️ **LEGACY — DO NOT USE** (confirmed by owner, Sep 2026): `/opt/kaoinai-site` on the VPS and this repo's static-site files are OLD. The live kaoinai.com is a React/Vite SPA built from a different source. Never `git pull` into `/opt/kaionai-site` — it would overwrite the live homepage.
  * VPS access: `ssh -p 51322 root@187.77.154.93`.
  * Live services on the VPS: kaoinai.com (React SPA, source outside this repo) · sec.kaoinai.com (secretary app, repo `ngtatkeong/secretary`, deploy via `bash deploy/deploy.sh`, systemd `secretary`; **all state in PostgreSQL** — db `secretary` in the `cs_postgres` container, reached by the host app via `127.0.0.1:5434`; legacy JSON files in `server/data/` remain as backup) · sec.kaoinai.com/register/ (Company Secretary Register, §6 below, at `/opt/company-secretary`, port 4011).

---

## 6. Company Secretary Register (`company-secretary/`)

* **Purpose**: Internal corporate secretarial tool. PostgreSQL-backed register keyed by **UEN** with a 6-step wizard (Particulars → Directors → Secretary → Shareholders → Filings → Review).
* **Identity Persistence Rule**: Company name, UEN and registered address are entered ONCE in Step 1, then (a) mirrored in a sticky identity bar on every step, (b) rendered as a locked chip inside every subsequent form, (c) kept in `localStorage` (`cs_identity`), (d) autosaved to the `wizard_drafts` Postgres table. This is a hard UX invariant — do not regress.
* **Stack**: `docker compose` = `postgres:16-alpine` (volume `cs_postgres_data`, schema auto-applied from `server/schema.sql`) + Node/Express API (`server/`) that also serves the wizard (`public/`) same-origin. Tables: `companies`, `officers`, `shareholders`, `filings`, `wizard_drafts`; children cascade-delete.
* **API**: Upsert-by-UEN `POST /api/companies`; section-replace `PUT /api/companies/:uen/{officers,shareholders,filings}`; drafts `GET/PUT /api/drafts/:uen`. SG UEN format validated on both client and server.
* **Regression Test**: `scratch/cs-wizard-test/test-wizard.js` (jsdom, 35 checks — identity persistence, section saves, Postgres read-back, reload/draft resume). Run with the stack up: `cd scratch/cs-wizard-test && node test-wizard.js`.
* **Not part of the static site**: excluded from the 13-page marketing inventory; served separately on port 8080 (traefik attach block commented in compose for VPS deployment).
