'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { Calendar, User, BookOpen, MessageCircle, Send, Heart, Clock, TrendingUp, ChevronDown, ChevronUp, LogOut, RefreshCw, ArrowRight, Sparkles, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } }
};
const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
}

function AnimatedCounter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = Math.ceil(value / (duration * 60));
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{formatNumber(count)}</span>;
}

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center group cursor-default"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: delay + 0.2 }}
        className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center`}
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </motion.div>
      <div className="text-3xl font-bold" style={{ color }}>
        <AnimatedCounter value={value} />
      </div>
      <div className="text-gray-600 mt-1 text-sm">{label}</div>
    </motion.div>
  );
}

export default function ArticleDisplay() {
    const router = useRouter();
    
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('all');
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentLoading, setCommentLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [greeting, setGreeting] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const commentRef = useRef(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    useEffect(() => {
        checkAuthStatus();
        fetchArticles();
        afterlogindisplaycomment();
    }, []);

    useEffect(() => {
        setDisplayCount(9);
    }, [searchTerm, selectedAuthor]);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 600);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const checkAuthStatus = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            setIsLoggedIn(!!token);
            if (!token && window.location.pathname !== '/login') router.push('/login');
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    setUserName(userData.name || userData.firstname || userData.email || 'User');
                    setUserEmail(userData.email || '');
                } catch {
                    setUserName('User');
                }
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        router.push('/login');
    };

    const fetchArticles = async () => {
        try {
            const response = await axios.get(api.article.display);
            setArticles(response.data?.articles || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const afterlogindisplaycomment = async () => {
        try {
            const response = await axios.get(api.comment.afterlogincommentsget);
            setComments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleLoadMore = () => setDisplayCount(prev => prev + 9);
    const handleShowLess = () => setDisplayCount(9);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) { alert('Please login to post a comment'); router.push('/login'); return; }
        if (!newComment.trim()) { alert('Please enter a comment'); return; }
        try {
            setSubmitting(true);
            await axios.post(api.comment.afterlogincomment, { comment: newComment.trim(), user: userName });
            setNewComment('');
            afterlogindisplaycomment();
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLoginRedirect = () => router.push('/login');

    const getUniqueAuthors = () => {
        const authorsSet = new Set();
        articles.forEach(article => { if (article?.author) authorsSet.add(article.author); });
        return ['all', ...Array.from(authorsSet)];
    };

    const authors = getUniqueAuthors();

    const filteredArticles = articles.filter(article => {
        if (!article || typeof article !== 'object') return false;
        const title = article.title || '';
        const content = article.content || '';
        const author = article.author || '';
        const matchesSearch = searchTerm === '' ||
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            author.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && (selectedAuthor === 'all' || article.author === selectedAuthor);
    });

    const articlesToDisplay = filteredArticles.slice(0, displayCount);

    const calculateReadingTime = (content) => {
        if (!content || typeof content !== 'string') return 1;
        const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
        return Math.max(1, Math.ceil(words / 200));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch { return 'Invalid date'; }
    };

    const formatCommentDate = (dateString) => {
        if (!dateString) return 'Just now';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Just now';
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch { return 'Just now'; }
    };

    const getAuthorInitial = (author) => {
        if (!author || typeof author !== 'string') return 'A';
        return author.charAt(0).toUpperCase();
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollToComments = () => commentRef.current?.scrollIntoView({ behavior: 'smooth' });

    const totalWords = articles.reduce((total, article) => {
        if (!article?.content) return total;
        return total + article.content.trim().split(/\s+/).filter(w => w.length > 0).length;
    }, 0);

    const averageReadTime = articles.length > 0
        ? Math.round(articles.reduce((total, article) => total + calculateReadingTime(article?.content || ''), 0) / articles.length)
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
                    />
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 text-gray-600 text-lg">Loading articles...</motion.p>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div initial="initial" animate="animate" className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Welcome Banner */}
            <motion.div variants={fadeUp} className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{ left: `${(i * 37 + 13) % 100}%`, top: `${(i * 53 + 7) % 100}%` }}
                            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </div>
                <motion.div variants={fadeUp} className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white">
                                {greeting}, {userName || 'Reader'}!
                                <motion.span
                                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-block ml-2"
                                >👋</motion.span>
                            </motion.h1>
                            <motion.p variants={fadeUp} className="text-blue-100 mt-2 text-lg">
                                Welcome to your dashboard. Discover stories from our community.
                            </motion.p>
                        </div>
                        <motion.div variants={fadeUp} className="mt-4 md:mt-0 flex gap-3">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={scrollToComments}
                                className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 text-sm"
                            >
                                <MessageCircle className="w-4 h-4" /> Comments ({comments.length})
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 text-sm"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Stats */}
                <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={BookOpen} label="Total Articles" value={articles.length} color="#2563eb" delay={0} />
                    <StatCard icon={User} label="Authors" value={authors.length - 1} color="#16a34a" delay={0.1} />
                    <StatCard icon={Activity} label="Total Words" value={totalWords} color="#7c3aed" delay={0.2} />
                    <StatCard icon={Clock} label="Avg. Read Time" value={averageReadTime} color="#ea580c" delay={0.3} />
                </motion.div>

                {/* Activity Summary */}
                <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-600" /> Activity Overview
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: TrendingUp, label: 'Articles Today', value: articles.filter(a => a.createdAt && new Date(a.createdAt).toDateString() === new Date().toDateString()).length, color: '#2563eb' },
                            { icon: MessageCircle, label: 'Total Comments', value: comments.length, color: '#16a34a' },
                            { icon: Clock, label: 'Total Reading Time', value: `${articles.reduce((sum, a) => sum + calculateReadingTime(a?.content || ''), 0)} min`, color: '#7c3aed' },
                            { icon: RefreshCw, label: 'Articles Loaded', value: articlesToDisplay.length, color: '#ea580c' },
                        ].map(({ icon: Icon, label, value, color }, i) => (
                            <motion.div key={label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                                    <Icon className="w-5 h-5" style={{ color }} />
                                </div>
                                <div>
                                    <div className="text-lg font-bold" style={{ color }}>{value}</div>
                                    <div className="text-xs text-gray-500">{label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <input type="text" placeholder="Search articles by title, content, or author..."
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                                <div className="absolute left-4 top-3.5">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                {authors.map(author => (
                                    <option key={author} value={author}>{author === 'all' ? 'All Authors' : author}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <AnimatePresence>
                        {searchTerm && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="mt-4 text-sm text-gray-600"
                            >
                                Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching &quot;{searchTerm}&quot;
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Articles Grid */}
                {filteredArticles.length === 0 ? (
                    <motion.div variants={scaleIn} className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity }}>
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm ? 'Try a different search term' : 'No articles have been published yet'}
                        </p>
                        {searchTerm && (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <>
                        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articlesToDisplay.map((article, index) => {
                                if (!article || typeof article !== 'object') return null;
                                const title = article.title || 'Untitled';
                                const author = article.author || 'Unknown Author';
                                const content = article.content || '';
                                const imageUrl = article.image || null;
                                const readingTime = calculateReadingTime(content);
                                const date = formatDate(article.createdAt || article.updatedAt);
                                const authorInitial = getAuthorInitial(author);

                                return (
                                    <motion.div
                                        key={article._id || `article-${index}`}
                                        variants={fadeUp}
                                        whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 group"
                                    >
                                        <div className="relative h-56 overflow-hidden">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.src = `https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`;
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                    <BookOpen className="w-16 h-16 text-white opacity-80" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 shadow-sm">
                                                    {readingTime} min read
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Article</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{title}</h2>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                        {authorInitial}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{author}</span>
                                                </div>
                                                <span className="text-gray-400">•</span>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />{date}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-6 line-clamp-3">
                                                {content.length > 150 ? `${content.substring(0, 150)}...` : content}
                                            </p>
                                            <div className="border-t border-gray-100 pt-4">
                                                <Link href={`/articles/${article._id}`}
                                                    className="group/link block w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
                                                >
                                                    Read More
                                                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Load More / Show Less */}
                        {filteredArticles.length > 9 && (
                            <motion.div variants={fadeUp} className="mt-12 text-center">
                                <div className="mb-4 text-gray-600 text-sm">
                                    Showing {Math.min(displayCount, filteredArticles.length)} of {filteredArticles.length} articles
                                </div>
                                {displayCount < filteredArticles.length ? (
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={handleLoadMore}
                                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                            <ChevronDown className="h-5 w-5" />
                                        </motion.span>
                                        Load More Articles
                                    </motion.button>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-gray-500 text-sm">All articles are displayed</p>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            onClick={handleShowLess}
                                            className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <ChevronUp className="h-5 w-5" /> Show Less
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </>
                )}

                {/* Filter controls bottom */}
                {filteredArticles.length > 0 && (searchTerm || selectedAuthor !== 'all') && (
                    <motion.div variants={fadeUp} className="mt-8 text-center">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => { setSearchTerm(''); setSelectedAuthor('all'); }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Show All Articles
                        </motion.button>
                    </motion.div>
                )}

                {/* Comment Section */}
                <motion.div ref={commentRef} variants={fadeUp} className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-blue-600" />
                            Comments ({comments.length})
                        </h2>
                    </motion.div>

                    {/* Comment Form */}
                    <motion.form variants={fadeUp} onSubmit={handleSubmitComment} className="mb-8">
                        <div className="flex gap-3">
                            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                placeholder={isLoggedIn ? 'Write your thoughts...' : 'Login to comment'}
                                disabled={!isLoggedIn}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {isLoggedIn ? (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                                    type="submit" disabled={submitting || !newComment.trim()}
                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                            <Send className="w-4 h-4" />
                                        </motion.span>
                                    ) : (
                                        <><Send className="w-4 h-4" /> Post</>
                                    )}
                                </motion.button>
                            ) : (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                                    type="button" onClick={handleLoginRedirect}
                                    className="px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-all flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Login
                                </motion.button>
                            )}
                        </div>
                    </motion.form>

                    {/* Comments List */}
                    {commentLoading ? (
                        <div className="text-center py-8">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : comments.length === 0 ? (
                        <motion.div variants={fadeUp} className="text-center py-12">
                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                        </motion.div>
                    ) : (
                        <motion.div variants={stagger} className="space-y-4">
                            {comments.map((comment, index) => {
                                if (!comment || typeof comment !== 'object') return null;
                                const commentUser = comment.user || comment.name || 'Anonymous';
                                const commentText = comment.comment || comment.text || '';
                                const commentDate = formatCommentDate(comment.createdAt || comment.date);

                                return (
                                    <motion.div
                                        key={comment._id || `comment-${index}`}
                                        variants={fadeUp}
                                        whileHover={{ x: 4 }}
                                        className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                                {commentUser.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900 text-sm">{commentUser}</span>
                                                    <span className="text-gray-400 text-xs">{commentDate}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">{commentText}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Scroll to top */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center"
                    >
                        <ChevronUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}