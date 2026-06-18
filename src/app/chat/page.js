'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';

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

export default function ChatListPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (!t) router.push('/login');
        setToken(t);
    }, [router]);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchConversations = useCallback(async () => {
        try {
            const res = await axios.get(api.chat.conversations, { headers });
            setConversations(res.data.chats || []);
        } catch (err) { console.error('Error fetching conversations:', err); }
        finally { setLoading(false); }
    }, [token]);

    useEffect(() => { if (token) fetchConversations(); }, [token, fetchConversations]);

    const getOtherUser = (chat) => {
        return chat.participants?.find(p => p._id !== token);
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

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
                    <h1 className="text-2xl font-bold">Messages</h1>
                </div>

                {conversations.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <MessageCircle className="w-20 h-20 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No conversations yet</p>
                        <p className="text-sm mt-1">Add friends and start chatting!</p>
                        <Link href="/friends" className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium">
                            Find Friends
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((chat, i) => {
                            const other = getOtherUser(chat) || chat.participants?.[0];
                            if (!other) return null;
                            const userId = other._id;
                            return (
                                <motion.div key={chat._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                                    <Link href={`/chat/${userId}`} className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors group">
                                        <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                            {isOnline(other) && <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full" />}
                                            {(other.firstname?.[0] || other.email?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate flex items-center gap-1.5">
                                                {other.firstname || other.email?.split('@')[0] || 'Unknown'}
                                                <span className={`text-[10px] ${isOnline(other) ? 'text-green-400' : 'text-gray-500'}`}>
                                                    {isOnline(other) ? '● Online' : formatLastSeen(other.lastSeen)}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {chat.lastSender?._id === other._id ? '' : 'You: '}{chat.lastMessage || 'No messages yet'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                            <span className="text-xs text-gray-500">{formatTime(chat.lastMessageAt || chat.updatedAt)}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
