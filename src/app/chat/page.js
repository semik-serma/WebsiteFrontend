'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronRight } from 'lucide-react';
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

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (loading) return <DashboardLoader label="Loading messages..." />;

    return (
        <DashboardShell
            title="Messages"
            subtitle="Your conversations with friends and community members."
            maxWidth="max-w-2xl"
        >
            {conversations.length === 0 ? (
                <DashCard className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-800">No conversations yet</p>
                    <p className="text-sm text-gray-500 mt-1">Add friends and start chatting!</p>
                    <Link href="/friends" className="dash-btn-primary mt-6">
                        Find Friends
                    </Link>
                </DashCard>
            ) : (
                <div className="space-y-2">
                    {conversations.map((chat, i) => {
                        const other = chat.participants?.find(p => p._id !== token) || chat.participants?.[0];
                        if (!other) return null;
                        const userId = other._id;
                        return (
                            <motion.div key={chat._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                                <Link href={`/chat/${userId}`}>
                                    <DashCard className="p-4 flex items-center gap-3 group">
                                        <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">
                                            {isOnline(other) && (
                                                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                                            )}
                                            {(other.firstname?.[0] || other.email?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                                                {other.firstname || other.email?.split('@')[0] || 'Unknown'}
                                                <span className={`text-[10px] font-normal ${isOnline(other) ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {isOnline(other) ? '● Online' : formatLastSeen(other.lastSeen)}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {chat.lastSender?._id === other._id ? '' : 'You: '}{chat.lastMessage || 'No messages yet'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                            <span className="text-xs text-gray-400">{formatTime(chat.lastMessageAt || chat.updatedAt)}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </DashCard>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </DashboardShell>
    );
}
