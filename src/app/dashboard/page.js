'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { Calendar, User, BookOpen, MessageCircle, Send, Heart, Clock, TrendingUp, ChevronDown, ChevronUp, LogOut, RefreshCw, ArrowRight, Sparkles, Zap, Activity, ThumbsUp, Share2, Shield, Globe, MoreHorizontal, X, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardShell, { DashCard, DashboardLoader } from '@/components/DashboardShell';

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
    const [articleLikes, setArticleLikes] = useState({});
    const [userLikedArticles, setUserLikedArticles] = useState({});
    const [articleShares, setArticleShares] = useState({});
    const [expandedArticles, setExpandedArticles] = useState({});
    const [dismissedArticles, setDismissedArticles] = useState({});
    const [openMenuArticleId, setOpenMenuArticleId] = useState(null);
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentLoading, setCommentLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [userRole, setUserRole] = useState('');
    const [greeting, setGreeting] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [replyOpen, setReplyOpen] = useState({});
    const [replyTexts, setReplyTexts] = useState({});
    const [submittingReply, setSubmittingReply] = useState({});
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
                    setUserAvatar(userData.avatar || '');
                    if (userData.role) setUserRole(userData.role);
                } catch {
                    setUserName('User');
                }
            }
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.role) setUserRole(payload.role);
                } catch {}
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
            const list = response.data?.articles || [];
            setArticles(list);
            let currentEmail = '';
            if (typeof window !== 'undefined') {
                const u = localStorage.getItem('user');
                if (u) {
                    try { currentEmail = JSON.parse(u).email || ''; } catch {}
                }
            }
            const initialLikes = {};
            const initialUserLiked = {};
            const initialShares = {};
            list.forEach(a => {
                if (a?._id) {
                    const likesArr = Array.isArray(a.likes) ? a.likes : [];
                    initialLikes[a._id] = likesArr.length;
                    initialUserLiked[a._id] = currentEmail ? likesArr.includes(currentEmail) : false;
                    initialShares[a._id] = a.sharesCount || 0;
                }
            });
            setArticleLikes(initialLikes);
            setUserLikedArticles(initialUserLiked);
            setArticleShares(initialShares);
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
        if (!isLoggedIn) { toast.error('Please login to post a comment'); router.push('/login'); return; }
        if (!newComment.trim()) { toast.error('Please enter a comment'); return; }
        try {
            setSubmitting(true);
            await axios.post(api.comment.afterlogincomment, { 
                comment: newComment.trim(), 
                user: userName,
                userEmail,
                userAvatar
            });
            toast.success('Comment posted!');
            setNewComment('');
            afterlogindisplaycomment();
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!isLoggedIn) {
            toast.error('Please login to like');
            router.push('/login');
            return;
        }
        try {
            await axios.post(api.comment.afterloginLike(commentId), { userEmail });
            await afterlogindisplaycomment();
        } catch (error) {
            console.error('Error liking comment:', error);
            toast.error('Failed to like comment');
        }
    };

    const toggleReply = (commentId) => {
        setReplyOpen(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const handleReplyTextChange = (commentId, text) => {
        setReplyTexts(prev => ({ ...prev, [commentId]: text }));
    };

    const handleReplySubmit = async (commentId) => {
        if (!isLoggedIn) {
            toast.error('Please login to reply');
            router.push('/login');
            return;
        }
        const text = replyTexts[commentId]?.trim();
        if (!text) {
            toast.error('Please enter a reply');
            return;
        }
        try {
            setSubmittingReply(prev => ({ ...prev, [commentId]: true }));
            await axios.post(api.comment.afterloginReply(commentId), {
                comment: text,
                userEmail,
                userName,
                userAvatar
            });
            toast.success('Reply posted!');
            setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
            await afterlogindisplaycomment();
        } catch (error) {
            console.error('Error posting reply:', error);
            toast.error('Failed to post reply');
        } finally {
            setSubmittingReply(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleShareComment = async (comment) => {
        const url = `${window.location.origin}/comment/${comment._id}?type=after`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Comment by ${comment.user || 'User'}`,
                    text: comment.comment,
                    url: url
                });
            } catch (err) {
                if (err.name !== 'AbortError') console.error(err);
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Comment link copied to clipboard!');
        }
        try {
            await axios.post(api.comment.afterloginShare(comment._id));
            await afterlogindisplaycomment();
        } catch (e) {
            // silent
        }
    };

    const handleLikeArticle = async (articleId) => {
        if (!isLoggedIn) {
            toast.error('Please login to like articles');
            router.push('/login');
            return;
        }
        const isCurrentlyLiked = !!userLikedArticles[articleId];
        const currentCount = articleLikes[articleId] ?? 0;
        setUserLikedArticles(prev => ({ ...prev, [articleId]: !isCurrentlyLiked }));
        setArticleLikes(prev => ({ ...prev, [articleId]: isCurrentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1 }));

        try {
            const res = await axios.post(api.article.like(articleId), { userEmail });
            if (res.data?.success) {
                setUserLikedArticles(prev => ({ ...prev, [articleId]: res.data.hasLiked }));
                setArticleLikes(prev => ({ ...prev, [articleId]: res.data.likesCount }));
            }
        } catch (err) {
            setUserLikedArticles(prev => ({ ...prev, [articleId]: isCurrentlyLiked }));
            setArticleLikes(prev => ({ ...prev, [articleId]: currentCount }));
            toast.error('Failed to update like');
        }
    };

    const handleShareArticle = async (article) => {
        const url = `${window.location.origin}/articles/${article._id}`;
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: article.title || 'Article',
                    text: article.content ? article.content.substring(0, 100) : '',
                    url: url
                });
            } catch (err) {
                if (err.name !== 'AbortError') console.error(err);
            }
        } else if (typeof navigator !== 'undefined') {
            await navigator.clipboard.writeText(url);
            toast.success('Article link copied to clipboard!');
        }
        try {
            const res = await axios.post(api.article.share(article._id));
            if (res.data?.success) {
                setArticleShares(prev => ({ ...prev, [article._id]: res.data.sharesCount }));
            }
        } catch (e) {}
    };

    const toggleSeeMore = (id) => {
        setExpandedArticles(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDismissArticle = (id) => {
        setDismissedArticles(prev => ({ ...prev, [id]: true }));
        toast.info('Post hidden from feed');
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
        if (dismissedArticles[article._id]) return false;
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
        return <DashboardLoader label="Loading articles..." />;
    }

    return (
        <DashboardShell
            title={`${greeting}, ${userName || 'Reader'}!`}
            subtitle="Welcome to your dashboard. Discover stories from our community."
            actions={
                <>
                    {userRole === 'ADMIN' && (
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm transition-all"
                        >
                            <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={scrollToComments}
                        className="dash-btn-secondary"
                    >
                        <MessageCircle className="w-4 h-4" /> Comments ({comments.length})
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </>
            }
        >
            <div>
                {/* Stats */}
                <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={BookOpen} label="Total Articles" value={articles.length} color="#2563eb" delay={0} />
                    <StatCard icon={User} label="Authors" value={authors.length - 1} color="#16a34a" delay={0.1} />
                    <StatCard icon={Activity} label="Total Words" value={totalWords} color="#7c3aed" delay={0.2} />
                    <StatCard icon={Clock} label="Avg. Read Time" value={averageReadTime} color="#ea580c" delay={0.3} />
                </motion.div>

                {/* Activity Summary */}
                <motion.div variants={fadeUp} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
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
                <motion.div variants={fadeUp} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
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
                        <div className="max-w-2xl mx-auto space-y-6">
                            {articlesToDisplay.map((article, index) => {
                                if (!article || typeof article !== 'object') return null;
                                const title = article.title || 'Untitled';
                                const author = article.author || 'Unknown Author';
                                const content = article.content || '';
                                const imageUrl = article.image || null;
                                const readingTime = calculateReadingTime(content);
                                const timeAgo = formatCommentDate(article.createdAt || article.updatedAt);
                                const authorInitial = getAuthorInitial(author);
                                const isExpanded = !!expandedArticles[article._id];
                                const isLiked = !!userLikedArticles[article._id];
                                const likesCount = articleLikes[article._id] ?? (Array.isArray(article.likes) ? article.likes.length : 0);
                                const sharesCount = articleShares[article._id] ?? (article.sharesCount || 0);

                                return (
                                    <motion.article
                                        key={article._id || `article-${index}`}
                                        variants={fadeUp}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {/* Header (Matching Reference Image) */}
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {article.authorAvatar ? (
                                                    <img
                                                        src={article.authorAvatar}
                                                        alt={author}
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                        {authorInitial}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-gray-900 text-sm sm:text-base hover:underline cursor-pointer">
                                                            {author}
                                                        </span>
                                                        <span className="text-gray-400 text-xs">🪓</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                                        <span className="font-medium text-gray-600">{author.split('@')[0]}</span>
                                                        <span>·</span>
                                                        <span>{timeAgo}</span>
                                                        <span>·</span>
                                                        <Globe className="w-3.5 h-3.5 text-gray-500 inline" title="Public" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenMenuArticleId(openMenuArticleId === article._id ? null : article._id)}
                                                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                                                    title="Options"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDismissArticle(article._id)}
                                                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                                                    title="Hide post"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>

                                                {/* Options Dropdown */}
                                                {openMenuArticleId === article._id && (
                                                    <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(`${window.location.origin}/articles/${article._id}`);
                                                                toast.success('Article link copied!');
                                                                setOpenMenuArticleId(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Share2 className="w-4 h-4" /> Copy Link
                                                        </button>
                                                        <Link
                                                            href={`/articles/${article._id}`}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            onClick={() => setOpenMenuArticleId(null)}
                                                        >
                                                            <BookOpen className="w-4 h-4" /> View Full Article
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Post Title & Text Excerpt */}
                                        <div className="px-4 pb-3">
                                            <Link href={`/articles/${article._id}`} className="group block">
                                                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                    {title}
                                                </h2>
                                            </Link>
                                            {content && (
                                                <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                                    {isExpanded || content.length <= 160
                                                        ? content
                                                        : `${content.substring(0, 160)}...`}
                                                    {content.length > 160 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleSeeMore(article._id)}
                                                            className="ml-1.5 font-semibold text-gray-500 hover:text-blue-600 transition inline-block"
                                                        >
                                                            {isExpanded ? 'See less' : 'See more'}
                                                        </button>
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        {/* Media Container (Framed slate backdrop matching Reference Image) */}
                                        {imageUrl ? (
                                            <div className="relative bg-[#8b95a5] dark:bg-slate-900 overflow-hidden flex items-center justify-center max-h-[520px] min-h-[300px]">
                                                <img
                                                    src={imageUrl}
                                                    alt={title}
                                                    className="w-full h-full max-h-[520px] object-contain mx-auto"
                                                    onError={(e) => {
                                                        e.target.src = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent(title.substring(0, 20))}`;
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                                {/* Title pill overlay at bottom like reference image */}
                                                <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
                                                    <div className="bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg text-center max-w-[85%] shadow-lg border border-white/10 truncate">
                                                        {title}
                                                    </div>
                                                </div>
                                                {/* Sound icon indicator */}
                                                <div className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/60 text-white/90 shadow-sm pointer-events-none">
                                                    <Volume2 className="w-4 h-4" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 py-16 px-6 text-center text-white flex flex-col items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-blue-300 mb-3 opacity-80" />
                                                <h3 className="text-lg font-bold max-w-md">{title}</h3>
                                                <p className="text-xs text-blue-200 mt-2">{readingTime} min read</p>
                                            </div>
                                        )}

                                        {/* Footer Interaction Bar (Matching Reference Image) */}
                                        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-6 text-gray-600">
                                                {/* Like button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleLikeArticle(article._id)}
                                                    className={`flex items-center gap-1.5 text-sm font-semibold transition ${
                                                        isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                                                    }`}
                                                >
                                                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-blue-600 stroke-blue-600' : ''}`} />
                                                    <span>{likesCount > 0 ? formatNumber(likesCount) : 'Like'}</span>
                                                </button>

                                                {/* Comment button */}
                                                <button
                                                    type="button"
                                                    onClick={scrollToComments}
                                                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                    <span>{comments.length > 0 ? formatNumber(comments.length) : 'Comment'}</span>
                                                </button>

                                                {/* Share button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleShareArticle(article)}
                                                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
                                                    title="Share article"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                    <span>{sharesCount > 0 ? formatNumber(sharesCount) : 'Share'}</span>
                                                </button>
                                            </div>

                                            {/* Blue Reaction Icon Badge */}
                                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm" title="Top Reaction">
                                                <ThumbsUp className="w-3.5 h-3.5 fill-white" />
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>

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
                                        whileHover={{ x: 2 }}
                                        className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 overflow-hidden">
                                                {comment.userAvatar ? (
                                                    <img src={comment.userAvatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    commentUser.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900 text-sm">{commentUser}</span>
                                                    <span className="text-gray-400 text-xs">{commentDate}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm whitespace-pre-wrap">{commentText}</p>

                                                {/* Action buttons: Like, Reply, Share */}
                                                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200/60">
                                                    <button
                                                        onClick={() => handleLikeComment(comment._id)}
                                                        className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-md ${
                                                            userEmail && Array.isArray(comment.likes) && comment.likes.includes(userEmail)
                                                                ? "text-blue-600 bg-blue-50 font-medium"
                                                                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                                        }`}
                                                        title="Like comment"
                                                    >
                                                        <ThumbsUp size={12} fill={userEmail && Array.isArray(comment.likes) && comment.likes.includes(userEmail) ? "currentColor" : "none"} />
                                                        <span>{comment.likes?.length || 0}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => toggleReply(comment._id)}
                                                        className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-md ${
                                                            replyOpen[comment._id]
                                                                ? "text-blue-600 bg-blue-50 font-medium"
                                                                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                                                        }`}
                                                        title="Reply to comment"
                                                    >
                                                        <MessageCircle size={12} />
                                                        <span>Reply {comment.replies?.length > 0 ? `(${comment.replies.length})` : ''}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => handleShareComment(comment)}
                                                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                                                        title="Share comment"
                                                    >
                                                        <Share2 size={12} />
                                                        <span>Share {comment.shares > 0 ? `(${comment.shares})` : ''}</span>
                                                    </button>
                                                </div>

                                                {/* Replies Thread */}
                                                {replyOpen[comment._id] && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200/60 space-y-3">
                                                        {comment.replies && comment.replies.length > 0 && (
                                                            <div className="space-y-2">
                                                                {comment.replies.map((reply, rIdx) => (
                                                                    <div
                                                                        key={reply._id || `reply-${rIdx}`}
                                                                        className="flex gap-2.5 pl-3 border-l-2 border-blue-500/40 bg-white rounded-r-lg p-2.5 border border-gray-100"
                                                                    >
                                                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-semibold overflow-hidden">
                                                                            {reply.userAvatar ? (
                                                                                <img src={reply.userAvatar} alt="" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                reply.userName ? reply.userName.charAt(0).toUpperCase() : <User size={12} />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <span className="text-xs font-medium text-gray-800 truncate">
                                                                                    {reply.userName || reply.userEmail?.split('@')[0] || "Anonymous"}
                                                                                </span>
                                                                                <span className="text-[10px] text-gray-400">
                                                                                    {formatCommentDate(reply.createdAt)}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                                                                                {reply.comment}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Inline Reply Input */}
                                                        <div className="flex gap-2 items-center pt-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Write a reply..."
                                                                value={replyTexts[comment._id] || ''}
                                                                onChange={(e) => handleReplyTextChange(comment._id, e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleReplySubmit(comment._id);
                                                                    }
                                                                }}
                                                                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                            />
                                                            <button
                                                                onClick={() => handleReplySubmit(comment._id)}
                                                                disabled={submittingReply[comment._id]}
                                                                className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-1"
                                                            >
                                                                {submittingReply[comment._id] ? 'Posting...' : <><Send size={11} /> Reply</>}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
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
                        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
                    >
                        <ChevronUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </DashboardShell>
    );
}