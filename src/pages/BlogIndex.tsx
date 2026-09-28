import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { BookOpen, Search, ArrowRight, Clock, Tag, ArrowLeft, Sparkles, Download } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = useMemo(() => {
    return ['All', 'PDPA & Compliance', 'Data Architecture', 'AI & LLM Data', 'Industry Comparisons']
  }, [])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Top Breadcrumb */}
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
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#5b2d6e] text-xs font-semibold mb-4">
          <BookOpen size={14} />
          <span>KaoinAI Engineering &amp; Compliance Blog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
          Data Governance, AI Readiness &amp; Compliance Insights
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          In-depth technical guides, regulatory frameworks, and architecture blueprints for data leaders, CISOs, and engineering teams.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="max-w-4xl mx-auto mb-12 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            type="text"
            placeholder="Search articles by keyword, framework, or database (e.g. PDPA, Snowflake, DPIA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 rounded-2xl border-slate-200 text-sm focus-visible:ring-purple-500 bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:border-purple-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                    <Tag size={12} />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-950 mb-2 leading-snug group-hover:text-purple-700 transition-colors">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {post.publishDate}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Read Article
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto p-8 mb-16">
          <p className="text-slate-600 mb-4">No articles found matching &quot;{searchQuery}&quot;.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Free Lead Magnet Download Callout Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-purple-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} />
            <span>Complimentary 2026 Executive Handbook</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Download the 2026 Data Governance for AI Readiness Field Manual
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            48 pages of concrete architectural diagrams, Singapore PDPA checklists, and automated table-bound DPIA implementation recipes for engineers and CISOs.
          </p>
        </div>
        <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-6 px-8 rounded-2xl shrink-0 shadow-lg shadow-purple-950/50">
          <a href="/downloads/2026-Data-Governance-AI-Readiness-Handbook.pdf" download>
            <Download size={16} className="mr-2" />
            Download PDF Free
          </a>
        </Button>
      </div>
    </div>
  )
}
