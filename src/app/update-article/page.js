'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { api } from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, BookOpen, ArrowRight, Search } from 'lucide-react'
import DashboardShell, { DashboardLoader } from '@/components/DashboardShell'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function UpdateArticlePicker() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await axios.get(api.article.display)
      setArticles(response.data?.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    if (!article) return false
    const title = article.title || ''
    const author = article.author || ''
    const search = searchTerm.toLowerCase()
    return title.toLowerCase().includes(search) || author.toLowerCase().includes(search)
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return 'Invalid date'
    }
  }

  if (loading) {
    return <DashboardLoader label="Loading articles..." />
  }

  return (
    <DashboardShell
      title="Update Article"
      subtitle="Choose an article to edit"
    >
      {/* Search */}
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </motion.div>

      {filteredArticles.length === 0 ? (
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try a different search term' : 'No articles have been published yet'}
          </p>
          <Link
            href="/create-article"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Create an Article
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => {
            if (!article || typeof article !== 'object') return null
            const title = article.title || 'Untitled'
            const author = article.author || 'Unknown Author'
            const date = formatDate(article.createdAt || article.updatedAt)
            const imageUrl = article.image || null

            return (
              <motion.div
                key={article._id || `article-${index}`}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
              >
                {imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {date}
                    </span>
                  </div>
                  <Link
                    href={`/update-article/${article._id}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Article <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
