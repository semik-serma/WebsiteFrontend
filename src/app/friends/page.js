'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, UserX, Users, Clock, MessageCircle, Loader2, X, Check } from 'lucide-react';
import DashboardShell, { DashCard, DashboardLoader } from '@/components/DashboardShell';

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

function UserAvatar({ user, online }) {
    const initial = (user?.firstname?.[0] || user?.email?.[0] || 'U').toUpperCase();
    return (
        <div className="relative w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold text-sm text-white flex-shrink-0">
            {online && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
            {initial}
        </div>
    );
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

    const tabs = [
        { id: 'friends', label: 'Friends', icon: Users, count: friends.length },
        { id: 'pending', label: 'Requests', icon: Clock, count: pending.length },
        { id: 'search', label: 'Search', icon: Search },
    ];

    if (loading) return <DashboardLoader label="Loading friends..." />;

    return (
        <DashboardShell
            title="Friends"
            subtitle="Connect with others, manage requests, and start conversations."
            maxWidth="max-w-2xl"
        >
            <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-blue-600'
                        }`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                        {t.count !== undefined && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tab === 'friends' && (
                    <motion.div key="friends" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                        {friends.length === 0 ? (
                            <DashCard className="p-12 text-center">
                                <Users className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-700 font-medium">No friends yet</p>
                                <p className="text-sm text-gray-500 mt-1">Search for people and send them a friend request</p>
                            </DashCard>
                        ) : friends.map((f, i) => (
                            <motion.div
                                key={f._id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <DashCard className="p-4 flex items-center gap-3">
                                    <UserAvatar user={f} online={isOnline(f)} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                                            {f.firstname || f.email?.split('@')[0] || 'Unknown'}
                                            <span className={`text-[10px] font-normal ${isOnline(f) ? 'text-green-600' : 'text-gray-400'}`}>
                                                {isOnline(f) ? '● Online' : formatLastSeen(f.lastSeen)}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{f.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => router.push(`/chat/${f._id}`)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Chat">
                                            <MessageCircle className="w-4 h-4" />
                                        </button>
                                        <button type="button" onClick={() => unfriend(f.friendshipId)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Unfriend">
                                            <UserX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </DashCard>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {tab === 'pending' && (
                    <motion.div key="pending" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                        {pending.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Received Requests</h3>
                                <div className="space-y-3">
                                    {pending.map(r => (
                                        <DashCard key={r._id} className="p-4 flex items-center gap-3">
                                            <UserAvatar user={r.sender} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{r.sender?.firstname || r.sender?.email?.split('@')[0] || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">{r.sender?.email}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => acceptRequest(r._id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><Check className="w-4 h-4" /></button>
                                                <button type="button" onClick={() => rejectRequest(r._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><X className="w-4 h-4" /></button>
                                            </div>
                                        </DashCard>
                                    ))}
                                </div>
                            </div>
                        )}
                        {sent.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 mt-2">Sent Requests</h3>
                                <div className="space-y-3">
                                    {sent.map(r => (
                                        <DashCard key={r._id} className="p-4 flex items-center gap-3 opacity-80">
                                            <UserAvatar user={r.receiver} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{r.receiver?.firstname || r.receiver?.email?.split('@')[0] || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">Pending</p>
                                            </div>
                                        </DashCard>
                                    ))}
                                </div>
                            </div>
                        )}
                        {pending.length === 0 && sent.length === 0 && (
                            <DashCard className="p-12 text-center">
                                <Clock className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-600">No pending requests</p>
                            </DashCard>
                        )}
                    </motion.div>
                )}

                {tab === 'search' && (
                    <motion.div key="search" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search users by name or email..."
                                className="dash-input pl-10"
                            />
                        </div>
                        {searching ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            </div>
                        ) : searchResults.length === 0 && searchQuery.trim() ? (
                            <p className="text-center text-gray-500 py-10">No users found</p>
                        ) : (
                            <div className="space-y-3">
                                {searchResults.map(u => (
                                    <DashCard key={u._id} className="p-4 flex items-center gap-3">
                                        <UserAvatar user={u} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{u.firstname || u.email?.split('@')[0] || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => sendRequest(u._id)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                        >
                                            <UserPlus className="w-4 h-4" /> Add
                                        </button>
                                    </DashCard>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardShell>
    );
}
