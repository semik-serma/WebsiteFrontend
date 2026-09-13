'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { ArrowLeft, MessageCircle, Calendar, User, ThumbsUp, ThumbsDown, Share2, Send } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function CommentContent() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            setIsLoggedIn(true);
            try {
                setCurrentUser(JSON.parse(user));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const fetchComment = async () => {
        try {
            const endpoint = type === 'before' 
                ? api.comment.beforelogincomment(id)
                : api.comment.afterlogincommentsgetid(id);
            
            const response = await axios.get(endpoint);
            setComment(response.data);
        } catch (err) {
            console.error('Error fetching comment:', err);
            setError('Failed to load comment details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchComment();
        }
    }, [id, type]);

    const formatCommentDate = (dateString) => {
        if (!dateString) return 'Just now';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Just now';
        }
    };

    const handleLike = async () => {
        if (!isLoggedIn || !currentUser) {
            toast.error('Please login to like this comment');
            router.push('/login');
            return;
        }
        try {
            if (type === 'before') {
                await axios.post(api.comment.like(id), { userEmail: currentUser.email });
            } else {
                await axios.post(api.comment.afterloginLike(id), { userEmail: currentUser.email });
            }
            await fetchComment();
        } catch (err) {
            console.error('Error liking comment:', err);
            toast.error('Failed to like comment');
        }
    };

    const handleDislike = async () => {
        if (!isLoggedIn || !currentUser) {
            toast.error('Please login to dislike this comment');
            router.push('/login');
            return;
        }
        try {
            if (type === 'before') {
                await axios.post(api.comment.dislike(id), { userEmail: currentUser.email });
                await fetchComment();
            }
        } catch (err) {
            console.error('Error disliking comment:', err);
            toast.error('Failed to dislike comment');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Comment by ${comment?.userName || comment?.user || 'Visitor'}`,
                    text: comment?.comment || '',
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
            if (type === 'before') {
                await axios.post(api.comment.share(id));
            } else {
                await axios.post(api.comment.afterloginShare(id));
            }
            await fetchComment();
        } catch (e) {
            // silent
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn || !currentUser) {
            toast.error('Please login to post a reply');
            router.push('/login');
            return;
        }
        if (!replyText.trim()) {
            toast.error('Please enter your reply');
            return;
        }

        try {
            setSubmittingReply(true);
            const payload = {
                comment: replyText.trim(),
                userEmail: currentUser.email,
                userName: currentUser.name || currentUser.firstname || currentUser.email.split('@')[0],
                userAvatar: currentUser.avatar || ''
            };

            const endpoint = type === 'before'
                ? api.comment.reply(id)
                : api.comment.afterloginReply(id);

            const res = await axios.post(endpoint, payload);
            if (res.data && res.data.success !== false) {
                toast.success('Reply added!');
                setReplyText('');
                await fetchComment();
            } else {
                toast.error(res.data?.message || 'Failed to submit reply');
            }
        } catch (err) {
            console.error('Error posting reply:', err);
            toast.error(err.response?.data?.message || 'Failed to post reply');
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleLikeReply = async (replyId) => {
        if (!isLoggedIn || !currentUser) {
            toast.error('Please login to like this reply');
            router.push('/login');
            return;
        }
        try {
            if (type === 'before') {
                await axios.post(api.comment.likeReply(id, replyId), {
                    userEmail: currentUser.email
                });
            }
            await fetchComment();
        } catch (err) {
            console.error('Error liking reply:', err);
            toast.error('Failed to like reply');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !comment) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="text-red-500 mb-4 text-xl font-semibold">{error || 'Comment not found'}</div>
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                >
                    <ArrowLeft className="h-4 w-4" /> Go Back
                </button>
            </div>
        );
    }

    const commentAuthor = comment.userName || comment.user || comment.userEmail?.split('@')[0] || 'Visitor';
    const isLiked = currentUser && Array.isArray(comment.likes) && comment.likes.includes(currentUser.email);
    const isDisliked = currentUser && Array.isArray(comment.dislikes) && comment.dislikes.includes(currentUser.email);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-8 font-medium"
                >
                    <ArrowLeft className="h-5 w-5" /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden flex-shrink-0 border-2 border-white/40">
                                {comment.userAvatar ? (
                                    <img src={comment.userAvatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    commentAuthor.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{commentAuthor}</h1>
                                <div className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm mt-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatCommentDate(comment.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6 sm:p-8">
                        <p className="text-gray-800 text-lg sm:text-xl leading-relaxed whitespace-pre-wrap mb-8">
                            {comment.comment}
                        </p>

                        {/* Actions Row */}
                        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    isLiked
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
                                <span>Like</span>
                                <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-gray-200">
                                    {comment.likes?.length || 0}
                                </span>
                            </button>

                            {type === 'before' && (
                                <button
                                    onClick={handleDislike}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        isDisliked
                                            ? 'bg-red-50 text-red-600 border border-red-200'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    <ThumbsDown size={16} fill={isDisliked ? "currentColor" : "none"} />
                                    <span>Dislike</span>
                                    <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-gray-200">
                                        {comment.dislikes?.length || 0}
                                    </span>
                                </button>
                            )}

                            <button
                                onClick={handleShare}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all"
                            >
                                <Share2 size={16} />
                                <span>Share</span>
                                {comment.shares > 0 && (
                                    <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-gray-200">
                                        {comment.shares}
                                    </span>
                                )}
                            </button>

                            <span className="ml-auto text-xs text-gray-400">
                                {comment.replies?.length || 0} replies
                            </span>
                        </div>
                    </div>
                </div>

                {/* Replies Thread Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        Replies ({comment.replies?.length || 0})
                    </h2>

                    {/* Replies List */}
                    {comment.replies && comment.replies.length > 0 ? (
                        <div className="space-y-4 mb-8">
                            {comment.replies.map((reply) => (
                                <div
                                    key={reply._id}
                                    className="flex gap-3 pl-4 border-l-2 border-blue-500/40 bg-gray-50/70 rounded-r-xl p-4 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold overflow-hidden border border-blue-200">
                                        {reply.userAvatar ? (
                                            <img src={reply.userAvatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            reply.userName ? reply.userName.charAt(0).toUpperCase() : <User size={14} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-semibold text-gray-900 truncate">
                                                {reply.userName || reply.userEmail?.split('@')[0] || "Anonymous"}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatCommentDate(reply.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                                            {reply.comment}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                onClick={() => handleLikeReply(reply._id)}
                                                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors border ${
                                                    currentUser && reply.likes?.includes(currentUser.email)
                                                        ? "text-blue-600 bg-blue-50 border-blue-200 font-medium"
                                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 border-gray-200"
                                                }`}
                                            >
                                                <ThumbsUp size={12} fill={currentUser && reply.likes?.includes(currentUser.email) ? "currentColor" : "none"} />
                                                <span>{reply.likes?.length || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm mb-6 border border-dashed border-gray-200 rounded-2xl">
                            No replies yet. Be the first to start the discussion!
                        </div>
                    )}

                    {/* Reply Input Form */}
                    {isLoggedIn ? (
                        <form onSubmit={handleReplySubmit} className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-800">
                                Leave a Reply
                            </label>
                            <div className="flex gap-2">
                                <textarea
                                    rows={3}
                                    placeholder="Write your response here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submittingReply || !replyText.trim()}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                >
                                    {submittingReply ? 'Posting...' : <><Send size={14} /> Post Reply</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                            <p className="text-sm text-gray-600 mb-3">You must be logged in to leave a reply.</p>
                            <Link
                                href="/login"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Login to Reply
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CommentDetail() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <CommentContent />
        </Suspense>
    );
}
