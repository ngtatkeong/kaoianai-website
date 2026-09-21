import Navigation from '@/sections/Navigation'
import MaturityRiskAudit from '@/sections/MaturityRiskAudit'
import FAQ from '@/sections/FAQ'
import CTA from '@/sections/CTA'
import Footer from '@/sections/Footer'

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <div className="pt-16">
        <MaturityRiskAudit />
      </div>
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
