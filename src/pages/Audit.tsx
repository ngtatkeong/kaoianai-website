import MaturityRiskAudit from '@/sections/MaturityRiskAudit'
import FAQ from '@/sections/FAQ'
import CTA from '@/sections/CTA'

export default function AuditPage() {
  return (
    <div className="pt-4">
      <MaturityRiskAudit asHeading1={true} />
      <FAQ />
      <CTA />
    </div>
  )
}
