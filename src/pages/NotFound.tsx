import { Link } from 'react-router'
import { ArrowLeft, Home, BookOpen, ShieldCheck, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="pt-28 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold mb-6">
        <span>HTTP Error 404 • Page Not Found</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight mb-4">
        Lost in the Metadata Mesh?
      </h1>

      <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
        The table, column, or page you were looking for doesn&apos;t exist or may have been reorganized. Let&apos;s get you back on track.
      </p>

      {/* Suggested Helpful Quick Links */}
      <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10 text-left">
        <Link
          to="/"
          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Home size={18} />
          </div>
          <div>
            <strong className="text-sm font-bold text-slate-900 block group-hover:text-purple-700 transition-colors">Platform Home</strong>
            <span className="text-xs text-slate-500">Autonomous governance, column lineage &amp; living RoPA.</span>
          </div>
        </Link>

        <Link
          to="/blog"
          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen size={18} />
          </div>
          <div>
            <strong className="text-sm font-bold text-slate-900 block group-hover:text-purple-700 transition-colors">Engineering Blog</strong>
            <span className="text-xs text-slate-500">Singapore PDPA guides, MAS TRM &amp; LLM lineage blueprints.</span>
          </div>
        </Link>

        <Link
          to="/audit"
          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck size={18} />
          </div>
          <div>
            <strong className="text-sm font-bold text-slate-900 block group-hover:text-purple-700 transition-colors">Free Risk Audit</strong>
            <span className="text-xs text-slate-500">Assess your data maturity &amp; compliance exposure in 5 mins.</span>
          </div>
        </Link>

        <Link
          to="/contact"
          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 transition-all flex items-start gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Mail size={18} />
          </div>
          <div>
            <strong className="text-sm font-bold text-slate-900 block group-hover:text-purple-700 transition-colors">Schedule Consultation</strong>
            <span className="text-xs text-slate-500">Book a 1-on-1 architecture call with our engineering team.</span>
          </div>
        </Link>
      </div>

      <div>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
          <Link to="/">
            <ArrowLeft size={16} className="mr-2" />
            Return to Homepage
          </Link>
        </Button>
      </div>
    </div>
  )
}
