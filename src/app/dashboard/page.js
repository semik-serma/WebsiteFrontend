'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '@/lib/api';
import { Calendar, User, BookOpen, MessageCircle, Send, Heart, LogIn, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ArticleDisplay() {
    const router = useRouter();
    
    // Article display states
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(9); // NEW: Track how many articles to display
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('all');
    
    // Comment section states
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentLoading, setCommentLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        checkAuthStatus();
        fetchArticles();
        afterlogindisplaycomment();
    }, []);

    // NEW: Reset display count when search or filter changes
    useEffect(() => {
        setDisplayCount(9);
    }, [searchTerm, selectedAuthor]);

    const checkAuthStatus = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            setIsLoggedIn(!!token);
            
            if (!token && window.location.pathname !== '/login') {
                router.push('/login');
            }
            
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    setUserName(userData.name || userData.email || 'User');
                } catch {
                    setUserName('User');
                }
            }
        }
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

    // NEW: Load more articles function
    const handleLoadMore = () => {
        setDisplayCount(prevCount => prevCount + 9);
    };

    // NEW: Show less articles function
    const handleShowLess = () => {
        setDisplayCount(9);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            alert('Please login to post a comment');
            router.push('/login');
            return;
        }
        
        if (!newComment.trim()) {
            alert('Please enter a comment');
            return;
        }

        try {
            setSubmitting(true);
            const data = {
                comment: newComment.trim(),
                user: userName
            };
            await axios.post(api.comment.afterlogincomment, data);
            setNewComment('');
            afterlogindisplaycomment();
            alert('Thank you for your comment!');
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    const getUniqueAuthors = () => {
        const authorsSet = new Set();
        articles.forEach(article => {
            if (article?.author) {
                authorsSet.add(article.author);
            }
        });
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
        
        const matchesAuthor = selectedAuthor === 'all' || article.author === selectedAuthor;
        
        return matchesSearch && matchesAuthor;
    });

    // NEW: Get articles to display based on displayCount
    const articlesToDisplay = filteredArticles.slice(0, displayCount);

    const calculateReadingTime = (content) => {
        if (!content || typeof content !== 'string') return 1;
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        const wordsPerMinute = 200;
        const readingTime = Math.ceil(words.length / wordsPerMinute);
        return readingTime < 1 ? 1 : readingTime;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
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
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Just now';
        }
    };

    const getAuthorInitial = (author) => {
        if (!author || typeof author !== 'string') return 'A';
        return author.charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading articles...</p>
                </div>
            </div>
        );
    }

    const totalWords = articles.reduce((total, article) => {
        if (!article?.content) return total;
        const words = article.content.trim().split(/\s+/).filter(word => word.length > 0);
        return total + words.length;
    }, 0);

    const averageReadTime = articles.length > 0 
        ? Math.round(articles.reduce((total, article) => total + calculateReadingTime(article?.content || ''), 0) / articles.length)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Latest <span className="text-blue-600">Articles</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Discover insightful stories, tutorials, and ideas from our community of writers.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-blue-600">{articles.length}</div>
                        <div className="text-gray-600 mt-2">Total Articles</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-green-600">{authors.length - 1}</div>
                        <div className="text-gray-600 mt-2">Authors</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {totalWords.toLocaleString()}
                        </div>
                        <div className="text-gray-600 mt-2">Total Words</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-orange-600">
                            {averageReadTime} min
                        </div>
                        <div className="text-gray-600 mt-2">Avg. Read Time</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full md:w-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search articles by title, content, or author..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute left-4 top-3.5">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <select
                                value={selectedAuthor}
                                onChange={(e) => setSelectedAuthor(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {authors.map(author => (
                                    <option key={author} value={author}>
                                        {author === 'all' ? 'All Authors' : author}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {searchTerm && (
                        <div className="mt-4 text-sm text-gray-600">
                            Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchTerm}"
                        </div>
                    )}
                </div>

                {/* Articles Grid */}
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm ? 'Try a different search term' : 'No articles have been published yet'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    <div 
                                        key={article._id || `article-${index}`} 
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                    >
                                        {/* Article Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            {imageUrl ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt={title}
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
                                                <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-gray-800">
                                                    {readingTime} min read
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Article Content */}
                                        <div className="p-6">
                                            {/* Category/Tags */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                    Article
                                                </span>
                                            </div>
                                            
                                            {/* Title */}
                                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                {title}
                                            </h2>
                                            
                                            {/* Author & Date */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                        {authorInitial}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{author}</span>
                                                </div>
                                                <span className="text-gray-400">•</span>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {date}
                                                </div>
                                            </div>
                                            
                                            {/* Content Preview */}
                                            <p className="text-gray-600 mb-6 line-clamp-3">
                                                {content.length > 150 
                                                    ? `${content.substring(0, 150)}...` 
                                                    : content}
                                            </p>
                                            
                                            {/* Read More Button */}
                                            <div className="border-t border-gray-100 pt-4">
                                                <Link 
                                                    href={`/articles/${article._id}`}
                                                    className="block w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                                                >
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* NEW: Load More Button Section */}
                        {filteredArticles.length > 9 && (
                            <div className="mt-12 text-center">
                                <div className="mb-4 text-gray-600">
                                    Showing {Math.min(displayCount, filteredArticles.length)} of {filteredArticles.length} articles
                                </div>
                                
                                {displayCount < filteredArticles.length ? (
                                    <button
                                        onClick={handleLoadMore}
                                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <ChevronDown className="h-5 w-5" />
                                        Load More Articles
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-gray-600">All articles are displayed</p>
                                        <button
                                            onClick={handleShowLess}
                                            className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <ChevronUp className="h-5 w-5" />
                                            Show Less
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Footer Info */}
                {filteredArticles.length > 0 && (
                    <div className="mt-8 text-center">
                        {(searchTerm || selectedAuthor !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedAuthor('all');
                                }}
                                className="mt-4 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Show All Articles
                            </button>
                        )}
                    </div>
                )}

                {/* Rest of the comment section remains the same */}
                {/* ... (keep the existing comment section code) ... */}
            </div>
        </div>
    );
}