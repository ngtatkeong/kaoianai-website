import { useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, ArrowRight, Clock, Tag, Calendar, Sparkles } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { Button } from '@/components/ui/button'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  const post = useMemo(() => {
    return blogPosts.find((p) => p.slug === slug)
  }, [slug])

  if (!post) {
    return (
      <div className="pt-28 pb-20 max-w-xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-sm text-slate-600 mb-6">The blog article you are looking for does not exist or may have been relocated.</p>
        <Button asChild>
          <Link to="/blog">Browse All Articles</Link>
        </Button>
      </div>
    )
  }

  const relatedPosts = useMemo(() => {
    return blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)
  }, [post.slug])

  const schemaData = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `https://kaoinai.com/blog/${post.slug}#article`,
      'headline': post.title,
      'alternativeHeadline': post.subtitle,
      'description': post.description,
      'image': 'https://kaoinai.com/og-cover.png',
      'author': {
        '@type': 'Person',
        'name': post.author.name,
        'jobTitle': post.author.role,
        'url': 'https://kaoinai.com/contact'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'KaoinAI',
        'url': 'https://kaoinai.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://kaoinai.com/logo.png'
        }
      },
      'datePublished': '2026-09-26T08:00:00+08:00',
      'dateModified': '2026-10-02T12:00:00+08:00',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://kaoinai.com/blog/${post.slug}`
      },
      'articleSection': post.category,
      'keywords': post.tags.join(', ')
    }
  }, [post])

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {/* Back to Blog */}
      <div className="mb-8 flex items-center justify-between">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Articles
        </Link>

        <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
          <Tag size={12} />
          {post.category}
        </span>
      </div>

      {/* Article Header */}
      <header className="border-b border-slate-200 pb-8 mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
          {post.subtitle}
        </p>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold shrink-0">
              {post.author.name[0]}
            </div>
            <div>
              <div className="font-bold text-slate-900">{post.author.name}</div>
              <div className="text-[11px] text-slate-500">{post.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {post.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <article className="prose prose-slate max-w-none mb-16 text-slate-700 leading-relaxed text-sm sm:text-base space-y-6">
        {post.content.split('\n\n').map((paragraph, idx) => {
          const trimmed = paragraph.trim()
          if (!trimmed) return null

          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl font-bold text-slate-950 mt-10 mb-4 border-b border-slate-100 pb-2">
                {trimmed.replace('## ', '')}
              </h2>
            )
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-3">
                {trimmed.replace('### ', '')}
              </h3>
            )
          }

          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-base font-bold text-purple-900 mt-4 mb-2">
                {trimmed.replace('#### ', '')}
              </h4>
            )
          }

          if (trimmed.startsWith('```')) {
            const codeContent = trimmed.replace(/```[a-z]*\n?/, '').replace(/```$/, '')
            return (
              <div key={idx} className="bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs overflow-x-auto border border-purple-500/20 my-6 shadow-md">
                <pre>{codeContent}</pre>
              </div>
            )
          }

          if (trimmed.startsWith('- ')) {
            const items = trimmed.split('\n- ').map(item => item.replace(/^- /, ''))
            return (
              <ul key={idx} className="list-disc pl-5 space-y-2 my-4 text-slate-700">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            )
          }

          if (trimmed.startsWith('| ')) {
            const rows = trimmed.split('\n').filter(r => !r.includes(':---'))
            const headerRow = rows[0].split('|').filter(c => c.trim().length > 0)
            const bodyRows = rows.slice(1).map(r => r.split('|').filter(c => c.trim().length > 0))
            return (
              <div key={idx} className="overflow-x-auto my-6 border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
                    <tr>
                      {headerRow.map((cell, cellIdx) => (
                        <th key={cellIdx} className="p-3 font-bold">{cell.trim().replace(/\*\*/g, '')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3">{cell.trim().replace(/\*\*/g, '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }

          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {trimmed}
            </p>
          )
        })}
      </article>

      {/* Author Bio Box */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 mb-16 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
          TK
        </div>
        <div>
          <div className="font-bold text-slate-950 text-base">{post.author.name}</div>
          <div className="text-xs text-purple-700 font-semibold mb-2">{post.author.role}</div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Leading engineering and architecture at KaoinAI. Specializing in autonomous metadata mesh, table-bound DPIA automation, and Singapore PDPA / MAS TRM regulatory compliance architectures.
          </p>
        </div>
      </div>

      {/* Book a 1-on-1 CTA banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-purple-500/20 shadow-2xl mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles size={14} />
            <span>Interactive Architecture Review</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold mb-1">
            Discuss Your Enterprise Data Stack 1-on-1 with TK Ng
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            Review your PostgreSQL or Snowflake schemas, verify Singapore PDPA obligations, and explore table-bound living compliance.
          </p>
        </div>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-500 text-white shrink-0">
          <Link to="/contact">
            Schedule 1-on-1 Session
          </Link>
        </Button>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="pt-10 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-950 mb-6">Related Technical Articles</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <div
                key={related.slug}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                    {related.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                    <Link to={`/blog/${related.slug}`} className="hover:text-purple-700 transition-colors">
                      {related.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {related.description}
                  </p>
                </div>
                <Link
                  to={`/blog/${related.slug}`}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1"
                >
                  Read Article
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
