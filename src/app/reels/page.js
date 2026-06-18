'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, BookmarkCheck, Volume2, VolumeX, ChevronUp, ChevronDown, Send, X, Loader2, Image, Plus, Users } from 'lucide-react';

export default function ReelsPage() {
    const router = useRouter();
    const [reels, setReels] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [volume, setVolume] = useState(0.05);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [token, setToken] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const reelAreaRef = useRef(null);
    const videoRef = useRef(null);
    const touchStartY = useRef(0);
    const touchStartX = useRef(0);
    const [showVolume, setShowVolume] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentShareReel, setCurrentShareReel] = useState(null);
    const [friends, setFriends] = useState([]);
    const [sharing, setSharing] = useState(false);

    const volumeRef = useRef(volume);
    volumeRef.current = volume;

    useEffect(() => {
        if (videoRef.current) videoRef.current.volume = volume;
    }, [volume]);

    const setVideoRef = useCallback((el) => {
        videoRef.current = el;
        if (el) el.volume = volumeRef.current;
    }, []);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setPlaying(true);
        } else {
            videoRef.current.pause();
            setPlaying(false);
        }
    };

    useEffect(() => {
        const t = localStorage.getItem('token');
        setToken(t || '');
    }, []);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchReels = useCallback(async (p = 1) => {
        try {
            const res = await axios.get(`${api.reel.feed}?page=${p}&limit=10`, { headers });
            if (p === 1) setReels(res.data.reels);
            else setReels(prev => [...prev, ...res.data.reels]);
            setHasMore(res.data.hasMore);
        } catch (err) {
            console.error('Error fetching reels:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchReels(1); }, [fetchReels]);

    const fetchFriends = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(api.friend.list, { headers });
            setFriends(res.data.friends || []);
        } catch (err) { /* silent */ }
    }, [token]);

    useEffect(() => { if (token) fetchFriends(); }, [token, fetchFriends]);

    const fetchComments = async (reelId) => {
        setCommentLoading(true);
        try {
            const res = await axios.get(api.reel.comments(reelId));
            setComments(res.data.comments || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleLike = async (reelId, index) => {
        if (!token) return router.push('/login');
        try {
            const res = await axios.post(api.reel.like(reelId), {}, { headers });
            setReels(prev => prev.map((r, i) =>
                i === index ? { ...r, likedByMe: res.data.liked, likesCount: r.likesCount + (res.data.liked ? 1 : -1) } : r
            ));
        } catch (err) { console.error('Like error:', err); }
    };

    const handleSave = async (reelId, index) => {
        if (!token) return router.push('/login');
        try {
            const res = await axios.post(api.reel.save(reelId), {}, { headers });
            setReels(prev => prev.map((r, i) =>
                i === index ? { ...r, savedByMe: res.data.saved, savesCount: r.savesCount + (res.data.saved ? 1 : -1) } : r
            ));
        } catch (err) { console.error('Save error:', err); }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !token) return;
        setSubmittingComment(true);
        try {
            const currentReel = reels[currentIndex];
            const res = await axios.post(api.reel.comment(currentReel._id), { comment: commentText }, { headers });
            setComments(prev => [res.data.comment, ...prev]);
            setCommentText('');
            setReels(prev => prev.map((r, i) =>
                i === currentIndex ? { ...r, commentsCount: r.commentsCount + 1 } : r
            ));
        } catch (err) { console.error('Comment error:', err); }
        finally { setSubmittingComment(false); }
    };

    const openComments = (reelId) => {
        setShowComments(true);
        fetchComments(reelId);
    };

    const handleShare = async (reel) => {
        if (!token) return router.push('/login');
        await fetchFriends();
        setCurrentShareReel(reel);
        setShowShareModal(true);
    };

    const shareWithFriend = async (friendId) => {
        const reel = currentShareReel;
        if (!reel) return;
        setSharing(true);
        try {
            const res = await axios.post(api.chat.shareReel, { friendId, reelId: reel._id }, { headers });
            setShowShareModal(false);
            alert('Reel shared!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to share');
        } finally {
            setSharing(false);
        }
    };

    const goNext = useCallback(() => {
        setCurrentMediaIndex(0);
        if (currentIndex < reels.length - 1) setCurrentIndex(prev => prev + 1);
        else if (hasMore) { const nextPage = page + 1; setPage(nextPage); fetchReels(nextPage); setCurrentIndex(reels.length); }
    }, [currentIndex, reels.length, hasMore, page, fetchReels]);

    const goPrev = useCallback(() => {
        setCurrentMediaIndex(0);
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    }, [currentIndex]);

    // Capture wheel events ONLY on the reel area, block page scroll when switching reels
    useEffect(() => {
        const el = reelAreaRef.current;
        if (!el) return;
        const handler = (e) => {
            if (showComments) return;
            if (e.deltaY > 50) { e.preventDefault(); goNext(); }
            else if (e.deltaY < -50) { e.preventDefault(); goPrev(); }
        };
        el.addEventListener('wheel', handler, { passive: false });
        return () => el.removeEventListener('wheel', handler);
    }, [showComments, goNext, goPrev]);

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const dy = touchStartY.current - e.changedTouches[0].clientY;
        const dx = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 50) {
            if (dy > 0) goNext(); else goPrev();
        }
    };

    const getMediaItems = (reel) => {
        if (reel?.media?.length) return reel.media;
        if (reel?.videoUrl) return [{ url: reel.videoUrl, type: 'video' }];
        return [];
    };

    const currentReel = reels[currentIndex];
    const mediaItems = getMediaItems(currentReel);
    const currentMedia = mediaItems[currentMediaIndex] || {};

    const goNextMedia = () => {
        if (currentMediaIndex < mediaItems.length - 1) setCurrentMediaIndex(prev => prev + 1);
    };

    const goPrevMedia = () => {
        if (currentMediaIndex > 0) setCurrentMediaIndex(prev => prev - 1);
    };

    const handleMediaWheel = (e) => {
        e.stopPropagation();
        if (e.deltaX > 30) goNextMedia();
        else if (e.deltaX < -30) goPrevMedia();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-start justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-white border-t-transparent rounded-full mt-32"
                />
            </div>
        );
    }

    if (reels.length === 0) {
        return (
            <div className="min-h-screen bg-black flex items-start justify-center text-white">
                <div className="text-center p-8 mt-32">
                    <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }}>
                        <svg className="w-20 h-20 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </motion.div>
                    <h2 className="text-xl font-semibold mt-4">No Reels Yet</h2>
                    <p className="text-gray-400">Be the first to upload!</p>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/reels/upload')}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold"
                    >
                        Upload Reel
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black overflow-y-auto">
            {/* Navbar spacer — page scrolls past this normally */}
            <div className="h-28 md:h-32" />

            <div className="flex items-start justify-center pb-4">
                <div ref={reelAreaRef} className="relative w-full max-w-md" style={{ height: '75vh' }}>
                    <div className="h-full w-full rounded-2xl overflow-hidden relative"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <AnimatePresence mode="wait">
                            {reels.map((reel, index) => {
                                if (index !== currentIndex && Math.abs(index - currentIndex) > 1) return null;
                                const isVisible = index === currentIndex;
                                const items = getMediaItems(reel);
                                const mIndex = isVisible ? currentMediaIndex : 0;
                                const item = items[mIndex] || {};

                                return (
                                    <motion.div
                                        key={reel._id}
                                        initial={{ opacity: 0, y: index > currentIndex ? 100 : -100 }}
                                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: index > currentIndex ? 100 : -100 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 rounded-2xl overflow-hidden bg-gray-900"
                                        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                                    >
                                        {/* Media display */}
                                        <div className="relative w-full h-full" onWheel={isVisible ? handleMediaWheel : undefined}>
                                            {item.type === 'video' ? (
                                                <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
                                                    <video
                                                        ref={isVisible ? setVideoRef : undefined}
                                                        src={item.url}
                                                        className="w-full h-full object-contain"
                                                        loop
                                                        autoPlay={isVisible}
                                                        playsInline
                                                        onPlay={() => setPlaying(true)}
                                                        onPause={() => setPlaying(false)}
                                                    />
                                                    {!playing && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                                <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : item.type === 'image' ? (
                                                <div className="w-full h-full">
                                                    <img
                                                        src={item.url}
                                                        alt=""
                                                        className="w-full h-full object-contain"
                                                        draggable={false}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <Image className="w-16 h-16" />
                                                </div>
                                            )}

                                            {/* Multi-media dots */}
                                            {items.length > 1 && (
                                                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                                    {items.map((_, mi) => (
                                                        <button key={mi} onClick={() => setCurrentMediaIndex(mi)}
                                                            className={`w-2 h-2 rounded-full transition-all ${mi === mIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none rounded-2xl" />

                                        {/* Volume control */}
                                        {item.type === 'video' && isVisible && (
                                            <div className="absolute top-3 right-3 z-10 flex items-center gap-1"
                                                onMouseEnter={() => setShowVolume(true)}
                                                onMouseLeave={() => setShowVolume(false)}
                                            >
                                                <motion.button whileTap={{ scale: 0.9 }}
                                                    onClick={() => setVolume(volume === 0 ? 0.05 : 0)}
                                                    className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0"
                                                >
                                                    {volume === 0 ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                                                </motion.button>
                                                <AnimatePresence>
                                                    {showVolume && (
                                                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 80, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                                                            className="h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center px-2 overflow-hidden"
                                                        >
                                                            <input type="range" min="0" max="1" step="0.05" value={volume}
                                                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                                                className="w-full h-1 accent-purple-500 cursor-pointer"
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        {/* Right side actions */}
                                        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-10">
                                            <motion.button whileTap={{ scale: 1.3 }}
                                                onClick={() => handleLike(reel._id, index)}
                                                className="flex flex-col items-center gap-0.5"
                                            >
                                                <Heart className={`w-6 h-6 ${reel.likedByMe ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                                                <span className="text-white text-[10px]">{reel.likesCount || ''}</span>
                                            </motion.button>

                                            <motion.button whileTap={{ scale: 1.3 }}
                                                onClick={() => openComments(reel._id)}
                                                className="flex flex-col items-center gap-0.5"
                                            >
                                                <MessageCircle className="w-6 h-6 text-white" />
                                                <span className="text-white text-[10px]">{reel.commentsCount || ''}</span>
                                            </motion.button>

                                            <motion.button whileTap={{ scale: 1.3 }}
                                                onClick={() => handleSave(reel._id, index)}
                                                className="flex flex-col items-center gap-0.5"
                                            >
                                                {reel.savedByMe
                                                    ? <BookmarkCheck className="w-6 h-6 text-yellow-400" />
                                                    : <Bookmark className="w-6 h-6 text-white" />
                                                }
                                                <span className="text-white text-[10px]">{reel.savesCount || ''}</span>
                                            </motion.button>

                                            <motion.button whileTap={{ scale: 1.3 }}
                                                onClick={() => handleShare(reel)}
                                                className="flex flex-col items-center gap-0.5"
                                            >
                                                <Share2 className="w-6 h-6 text-white" />
                                            </motion.button>
                                        </div>

                                        {/* Bottom info */}
                                        <div className="absolute bottom-4 left-3 right-16 z-10">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                    {(reel.user?.firstname?.[0] || reel.user?.email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <span className="text-white font-semibold text-sm truncate">
                                                    {reel.user?.firstname || reel.user?.email?.split('@')[0] || 'Unknown'}
                                                </span>
                                            </div>
                                            {reel.caption && (
                                                <p className="text-white/90 text-sm line-clamp-2">{reel.caption}</p>
                                            )}
                                            {reel.hashtags?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {reel.hashtags.map(tag => (
                                                        <span key={tag} className="text-blue-400 text-xs">#{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Upload FAB */}
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => router.push('/reels/upload')}
                        className="absolute -right-14 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center"
                    >
                        <Plus className="w-6 h-6 text-white" />
                    </motion.button>
                </div>
            </div>

            {/* Bottom spacer so page can scroll past the reel area */}
            <div className="h-8" />

            {/* Comments Modal */}
            <AnimatePresence>
                {showComments && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
                        onClick={() => setShowComments(false)}
                    >
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="w-full max-w-lg bg-gray-900 rounded-t-3xl max-h-[70vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                                <h3 className="text-white font-semibold text-lg">Comments</h3>
                                <motion.button whileHover={{ rotate: 90 }} onClick={() => setShowComments(false)}
                                    className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </motion.button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {commentLoading ? (
                                    <div className="flex justify-center py-8">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"
                                        />
                                    </div>
                                ) : comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No comments yet</p>
                                ) : (
                                    comments.map((c) => (
                                        <div key={c._id} className="flex gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                {(c.user?.firstname?.[0] || c.user?.email?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-semibold">{c.user?.firstname || c.user?.email?.split('@')[0] || 'Unknown'}</p>
                                                <p className="text-gray-300 text-sm">{c.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-800 flex gap-3">
                                <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-4 py-2.5 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                                <motion.button whileTap={{ scale: 0.9 }}
                                    type="submit" disabled={submittingComment || !commentText.trim()}
                                    className="px-4 py-2.5 bg-purple-600 text-white rounded-xl disabled:opacity-50"
                                >
                                    {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share with Friends Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="w-full max-w-lg bg-gray-900 rounded-t-3xl max-h-[70vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                                <h3 className="text-white font-semibold text-lg">Share with Friends</h3>
                                <motion.button whileHover={{ rotate: 90 }} onClick={() => setShowShareModal(false)}
                                    className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </motion.button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {friends.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No friends yet</p>
                                        <p className="text-sm">Add friends to share reels!</p>
                                    </div>
                                ) : friends.map((f) => (
                                    <motion.button key={f._id} whileTap={{ scale: 0.98 }}
                                        onClick={() => shareWithFriend(f._id)}
                                        disabled={sharing}
                                        className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 text-left"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {(f.firstname?.[0] || f.email?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{f.firstname || f.email?.split('@')[0] || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{f.email}</p>
                                        </div>
                                        <Send className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}