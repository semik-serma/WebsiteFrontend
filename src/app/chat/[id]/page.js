'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Send, Loader2, Image, ChevronDown, MessageCircle } from 'lucide-react';
import DashboardShell, { DashboardLoader } from '@/components/DashboardShell';

function isOnline(user) {
    if (!user?.lastSeen) return false;
    return Date.now() - new Date(user.lastSeen).getTime() < 120000;
}

export default function ChatDetailPage() {
    const { id: userId } = useParams();
    const router = useRouter();
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [token, setToken] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        if (!t) router.push('/login');
        setToken(t);
        if (u) { try { setCurrentUser(JSON.parse(u)); } catch {} }
    }, [router]);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchChat = useCallback(async () => {
        try {
            const res = await axios.get(api.chat.with(userId), { headers });
            setChat(res.data.chat);
            const other = res.data.chat.participants?.find(p => p._id === userId);
            setOtherUser(other || res.data.chat.participants?.[0]);
        } catch (err) { console.error('Error fetching chat:', err); }
        finally { setLoading(false); }
    }, [userId, token]);

    const fetchMessages = useCallback(async (p = 1, chatId) => {
        const id = chatId || chat?._id;
        if (!id) return;
        try {
            const res = await axios.get(`${api.chat.messages(id)}?page=${p}`, { headers });
            if (p === 1) setMessages(res.data.messages);
            else setMessages(prev => [...res.data.messages, ...prev]);
            setHasMore(res.data.hasMore);
            setPage(p);
        } catch (err) { console.error('Error fetching messages:', err); }
    }, [chat?._id, token]);

    useEffect(() => { if (token) fetchChat(); }, [token, fetchChat]);
    useEffect(() => { if (chat?._id) fetchMessages(1, chat._id); }, [chat?._id]);

    useEffect(() => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || !chat?._id) return;
        setSending(true);
        try {
            const res = await axios.post(api.chat.send, { chatId: chat._id, content: text.trim() }, { headers });
            setMessages(prev => [...prev, res.data.msg]);
            setText('');
            setChat(prev => ({ ...prev, lastMessage: text.trim(), lastMessageAt: new Date().toISOString() }));
        } catch (err) { console.error('Send error:', err); }
        finally { setSending(false); }
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const isMyMessage = (msg) => {
        if (!currentUser?.email) return false;
        return msg.sender?.email === currentUser.email || msg.sender?._id === currentUser._id;
    };

    if (loading) return <DashboardLoader label="Loading chat..." />;

    const displayName = otherUser?.firstname || otherUser?.email?.split('@')[0] || 'Unknown';

    return (
        <DashboardShell
            title={displayName}
            subtitle={isOnline(otherUser) ? '● Online' : otherUser?.email}
            backHref="/chat"
            showQuickNav={false}
            maxWidth="max-w-2xl"
        >
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-220px)] min-h-[480px] overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {hasMore && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => fetchMessages(page + 1)}
                                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto font-medium"
                            >
                                <ChevronDown className="w-3 h-3" /> Load older messages
                            </button>
                        </div>
                    )}
                    {messages.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <MessageCircle className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                            <p className="font-medium text-gray-700">No messages yet</p>
                            <p className="text-sm mt-1">Say hello!</p>
                        </div>
                    ) : messages.map((msg, i) => {
                        const mine = isMyMessage(msg);
                        return (
                            <motion.div
                                key={msg._id || i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                                    mine
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                                }`}>
                                    {msg.reel ? (
                                        <Link href="/reels" className="block mb-1">
                                            <div className={`flex items-center gap-2 rounded-lg p-2 ${mine ? 'bg-blue-700/50' : 'bg-blue-50'}`}>
                                                <Image className={`w-8 h-8 flex-shrink-0 ${mine ? 'text-blue-200' : 'text-blue-600'}`} />
                                                <div className="text-sm">
                                                    <p className={`font-medium ${mine ? 'text-blue-100' : 'text-blue-600'}`}>Shared Reel</p>
                                                    <p className={`text-xs ${mine ? 'text-blue-200' : 'text-gray-500'}`}>{msg.reel.caption?.substring(0, 30) || 'View reel'}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : null}
                                    {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}
                                    <p className={`text-[10px] mt-1 ${mine ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="dash-input flex-1"
                        />
                        <button
                            type="submit"
                            disabled={sending || !text.trim()}
                            className="dash-btn-primary px-4"
                        >
                            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardShell>
    );
}
