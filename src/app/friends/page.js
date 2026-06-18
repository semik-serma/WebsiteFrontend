'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, UserCheck, UserX, Users, Clock, MessageCircle, ArrowLeft, Loader2, X, Check, Trash2, Circle } from 'lucide-react';

function isOnline(user) {
    if (!user?.lastSeen) return false;
    return Date.now() - new Date(user.lastSeen).getTime() < 120000;
}

function formatLastSeen(date) {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 60000) return 'Online';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
}

export default function FriendsPage() {
    const router = useRouter();
    const [tab, setTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [sent, setSent] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (!t) router.push('/login');
        setToken(t);
    }, [router]);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchAll = useCallback(async () => {
        try {
            const [fRes, pRes, sRes] = await Promise.all([
                axios.get(api.friend.list, { headers }),
                axios.get(api.friend.pending, { headers }),
                axios.get(api.friend.sent, { headers })
            ]);
            setFriends(fRes.data.friends || []);
            setPending(pRes.data.requests || []);
            setSent(sRes.data.requests || []);
        } catch (err) {
            console.error('Error fetching friends:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { if (token) fetchAll(); }, [token, fetchAll]);

    const handleSearch = async (q) => {
        setSearchQuery(q);
        if (!q.trim()) { setSearchResults([]); return; }
        setSearching(true);
        try {
            const res = await axios.get(api.friend.search(q), { headers });
            setSearchResults(res.data.users || []);
        } catch (err) { console.error('Search error:', err); }
        finally { setSearching(false); }
    };

    const sendRequest = async (receiverId) => {
        try {
            await axios.post(api.friend.sendRequest, { receiverId }, { headers });
            fetchAll();
            setSearchResults(prev => prev.map(u => u._id === receiverId ? { ...u, requestSent: true } : u));
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const acceptRequest = async (id) => {
        try {
            await axios.post(api.friend.accept(id), {}, { headers });
            fetchAll();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const rejectRequest = async (id) => {
        try {
            await axios.post(api.friend.reject(id), {}, { headers });
            fetchAll();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const unfriend = async (id) => {
        if (!confirm('Unfriend this person?')) return;
        try {
            await axios.delete(api.friend.unfriend(id), { headers });
            fetchAll();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const startChat = (userId) => {
        router.push(`/chat/${userId}`);
    };

    const tabs = [
        { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
        { id: 'pending', label: 'Requests', icon: Clock, count: pending.length },
        { id: 'search', label: 'Search', icon: Search },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </motion.button>
                    <h1 className="text-2xl font-bold">Friends</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1">
                    {tabs.map(t => (
                        <motion.button key={t.id} whileTap={{ scale: 0.95 }}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                tab === t.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <t.icon className="w-4 h-4" />
                            {t.label}
                            {t.count !== undefined && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20' : 'bg-white/10'}`}>
                                    {t.count}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'friends' && (
                        <motion.div key="friends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                            {friends.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No friends yet</p>
                                    <p className="text-sm mt-1">Search for people and send them a friend request</p>
                                </div>
                            ) : friends.map(f => (
                                <motion.div key={f._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
                                >
                                    <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {isOnline(f) && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />}
                                        {(f.firstname?.[0] || f.email?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate flex items-center gap-1.5">
                                            {f.firstname || f.email?.split('@')[0] || 'Unknown'}
                                            <span className={`text-[10px] ${isOnline(f) ? 'text-green-400' : 'text-gray-500'}`}>
                                                {isOnline(f) ? '● Online' : formatLastSeen(f.lastSeen)}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{f.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button whileTap={{ scale: 0.9 }}
                                            onClick={() => startChat(f._id)}
                                            className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
                                            title="Chat"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.9 }}
                                            onClick={() => unfriend(f.friendshipId)}
                                            className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                                            title="Unfriend"
                                        >
                                            <UserX className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {tab === 'pending' && (
                        <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            {/* Received requests */}
                            {pending.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-3">Received Requests</h3>
                                    <div className="space-y-3">
                                        {pending.map(r => (
                                            <motion.div key={r._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                    {(r.sender?.firstname?.[0] || r.sender?.email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">{r.sender?.firstname || r.sender?.email?.split('@')[0] || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{r.sender?.email}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <motion.button whileTap={{ scale: 0.9 }}
                                                        onClick={() => acceptRequest(r._id)}
                                                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
                                                        title="Accept"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button whileTap={{ scale: 0.9 }}
                                                        onClick={() => rejectRequest(r._id)}
                                                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sent requests */}
                            {sent.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-3 mt-6">Sent Requests</h3>
                                    <div className="space-y-3">
                                        {sent.map(r => (
                                            <motion.div key={r._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 opacity-70"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                    {(r.receiver?.firstname?.[0] || r.receiver?.email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">{r.receiver?.firstname || r.receiver?.email?.split('@')[0] || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">Pending</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pending.length === 0 && sent.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No pending requests</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {tab === 'search' && (
                        <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search users by name or email..."
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            {searching ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                </div>
                            ) : searchResults.length === 0 && searchQuery.trim() ? (
                                <p className="text-center text-gray-500 py-8">No users found</p>
                            ) : (
                                <div className="space-y-3">
                                    {searchResults.map(u => (
                                        <motion.div key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                {(u.firstname?.[0] || u.email?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{u.firstname || u.email?.split('@')[0] || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                            </div>
                                            <motion.button whileTap={{ scale: 0.9 }}
                                                onClick={() => sendRequest(u._id)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
                                            >
                                                <UserPlus className="w-4 h-4" /> Add
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
