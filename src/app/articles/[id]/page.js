'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, MessageCircle, BookOpen, Send, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { FaPen } from "react-icons/fa";

export default function ArticleDetailPage() {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [postingComment, setPostingComment] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});
    const [visibleComments, setVisibleComments] = useState(5);
    const [commentHeights, setCommentHeights] = useState({});
    
    const { id } = useParams();
    const router = useRouter();
    const commentsEndRef = useRef(null);
    const commentRefs = useRef({});

    useEffect(() => {
        if (id) {
            checkAuthStatus();
            fetchArticle();
            fetchComments();
        }
    }, [id]);

    useEffect(() => {
        if (commentsEndRef.current && !commentLoading && comments.length > 0) {
            setTimeout(() => {
                commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [comments.length, commentLoading]);

    useEffect(() => {
       
        if (comments.length > 0 && !commentLoading) {
            setTimeout(() => {
                const newHeights = {};
                comments.forEach((comment, index) => {
                    const commentId = comment._id || `comment-${index}`;
                    const element = commentRefs.current[commentId];
                    if (element) {
                    
                        const lineHeight = 24; // px
                        const elementHeight = element.scrollHeight;
                        const lineCount = elementHeight / lineHeight;
                        newHeights[commentId] = lineCount > 3;
                    }
                });
                setCommentHeights(newHeights);
            }, 100);
        }
    }, [comments, commentLoading]);

    const checkAuthStatus = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            setIsLoggedIn(!!token);
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

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await axios.get(api.article.displaysingle(id));
            
            if (response.data?.data) {
                setArticle(response.data.data);
                setLikes(Math.floor(Math.random() * 100) + 10);
            } else {
                setError('Article not found');
            }
        } catch (error) {
            setError('Failed to load article');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            setCommentLoading(true);
            const response = await axios.get(api.comment.get);
            setComments(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentLoading(false);
        }
    };

    const calculateReadingTime = (content) => {
        if (!content) return 1;
        const words = content.split(/\s+/).filter(word => word.length > 0).length;
        return Math.ceil(words / 200);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return '';
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
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Just now';
        }
    };

    const handleShare = () => {
        if (!article) return;
        
        if (navigator.share) {
            navigator.share({
                title: article?.title,
                text: (article?.content || '').substring(0, 100) + '...',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleAddComment = async (e) => {
        e?.preventDefault();
        
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
            setPostingComment(true);
            
            await axios.post(api.comment.create, {
                comment: newComment,
                user: userName || 'User'
            });

            setNewComment('');
            fetchComments(); // Refresh comments
            
            // Reset expanded comments and show all comments
            setExpandedComments({});
            setVisibleComments(prev => Math.max(prev, comments.length + 1));
            
            alert('Comment posted successfully!');
            
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment. Please try again.');
        } finally {
            setPostingComment(false);
        }
    };

    const getAuthorInitial = (author) => {
        if (!author || typeof author !== 'string') return 'U';
        return author.charAt(0).toUpperCase();
    };

    const toggleCommentExpansion = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const loadMoreComments = () => {
        setVisibleComments(prev => prev + 5);
    };

    const setCommentRef = (commentId, element) => {
        commentRefs.current[commentId] = element;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The article does not exist.'}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const readingTime = calculateReadingTime(article.content);
    const displayedComments = comments.slice(0, visibleComments);
    const hasMoreComments = comments.length > visibleComments;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Articles
                        </button>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleShare}
                                className="flex items-center text-gray-600 hover:text-blue-600"
                            >
                                <Share2 className="h-5 w-5 mr-2" />
                                Share
                            </button>
                            <div className="text-gray-600 hover:text-blue-600">
                                <Link href={`/update-article/${id}`} className="flex items-center">
                                    <FaPen className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Article Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {article.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {getAuthorInitial(article.author)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{article.author}</p>
                                <p className="text-sm text-gray-500">Author</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{formatDate(article.createdAt)}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{readingTime} min read</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                {article.image && (
                    <div className="mb-8 rounded-lg overflow-hidden">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-auto max-h-[500px] object-cover"
                            onError={(e) => {
                                e.target.src = `https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=${encodeURIComponent(
                                    (article.title || '').substring(0, 30)
                                )}`;
                            }}
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-8">
                    <div className="prose max-w-none">
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {article.content}
                        </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t">
                        <button className="flex items-center text-gray-600 hover:text-red-600">
                            <Heart className="h-5 w-5 mr-2" />
                            <span>{likes} Likes</span>
                        </button>
                        <div className="flex items-center text-gray-600">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            <span>{comments.length} Comments</span>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Comments ({comments.length})</h2>
                        {!isLoggedIn && (
                            <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                                Login required to comment
                            </span>
                        )}
                    </div>
                    
                    {/* Add Comment */}
                    <div className="mb-8">
                        {isLoggedIn ? (
                            <form onSubmit={handleAddComment}>
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {getAuthorInitial(userName)}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder={`Share your thoughts about this article as ${userName}...`}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="3"
                                            disabled={postingComment}
                                        />
                                        <div className="text-sm text-gray-500 mt-1">
                                            Your comment will be visible to everyone
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={postingComment || !newComment.trim()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {postingComment ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Post Comment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                <p className="text-gray-700 mb-3">You need to be logged in to post a comment</p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Login
                                    </button>
                                    <button
                                        onClick={() => router.push('/register')}
                                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        Register
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Comments List */}
                    <div>
                        {commentLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-3 text-gray-600">Loading comments...</p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    {displayedComments.map((comment, index) => {
                                        const commentId = comment._id || `comment-${index}`;
                                        const commentKey = comment._id || index;
                                        const commentText = comment.comment || '';
                                        const isExpanded = expandedComments[commentId];
                                        const needsReadMore = commentHeights[commentId];
                                        
                                        return (
                                            <div key={commentKey} className="border-b pb-6 last:border-0 group hover:bg-gray-50 p-3 -mx-3 rounded-lg transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                                                        {getAuthorInitial(comment.user)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-gray-900 truncate">
                                                                    {comment.user}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {formatCommentDate(comment.createdAt)}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button 
                                                                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                                    title="Like comment"
                                                                >
                                                                    <Heart className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <div
                                                                ref={(el) => setCommentRef(commentId, el)}
                                                                className={`text-gray-700 whitespace-pre-line break-words ${isExpanded ? '' : 'line-clamp-3'}`}
                                                            >
                                                                {commentText}
                                                            </div>
                                                            {needsReadMore && (
                                                                <button
                                                                    onClick={() => toggleCommentExpansion(commentId)}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 flex items-center gap-1 group-hover:underline"
                                                                >
                                                                    {isExpanded ? (
                                                                        <>
                                                                            Show Less
                                                                            <ChevronUp className="h-4 w-4" />
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            Read More
                                                                            <ChevronDown className="h-4 w-4" />
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Load More Comments Button */}
                                {hasMoreComments && (
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={loadMoreComments}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            Load More Comments ({comments.length - visibleComments} more)
                                        </button>
                                    </div>
                                )}
                                
                                {/* Show All Comments Loaded Message */}
                                {!hasMoreComments && comments.length > 0 && (
                                    <div className="mt-8 pt-6 border-t text-center">
                                        <p className="text-gray-500 text-sm">
                                            <MessageCircle className="h-4 w-4 inline mr-2" />
                                            You've seen all {comments.length} comments
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div ref={commentsEndRef} />
                </div>

                {/* Back to Articles */}
                <div className="text-center">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <BookOpen className="h-5 w-5 mr-2" />
                        Browse More Articles
                    </Link>
                </div>
            </div>
        </div>
    );
}