'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Loader2, Image, ChevronDown, MessageCircle } from 'lucide-react';

function isOnline(user) {
    if (!user?.lastSeen) return false;
    return Date.now() - new Date(user.lastSeen).getTime() < 120000;
}
import Link from 'next/link';

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
    const scrollRef = useRef(null);

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

    const loadMore = () => {
        fetchMessages(page + 1);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-4 border-b border-white/10 bg-gray-900/80 backdrop-blur-sm">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => router.push('/chat')} className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div className="relative w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {isOnline(otherUser) && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />}
                    {(otherUser?.firstname?.[0] || otherUser?.email?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold">{otherUser?.firstname || otherUser?.email?.split('@')[0] || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{otherUser?.email}</p>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {hasMore && (
                    <div className="text-center">
                        <motion.button whileTap={{ scale: 0.9 }}
                            onClick={loadMore} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mx-auto"
                        >
                            <ChevronDown className="w-3 h-3" /> Load older messages
                        </motion.button>
                    </div>
                )}
                {messages.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Say hello!</p>
                    </div>
                ) : messages.map((msg, i) => {
                    const mine = isMyMessage(msg);
                    return (
                        <motion.div key={msg._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                mine ? 'bg-purple-600 rounded-br-md' : 'bg-white/10 rounded-bl-md'
                            }`}>
                                {msg.reel ? (
                                    <Link href={`/reels`} className="block mb-1">
                                        <div className="flex items-center gap-2 bg-black/20 rounded-lg p-2 hover:bg-black/30 transition-colors">
                                            <Image className="w-8 h-8 text-purple-400 flex-shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-medium text-purple-400">Shared Reel</p>
                                                <p className="text-xs text-gray-400">{msg.reel.caption?.substring(0, 30) || 'View reel'}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : null}
                                {msg.content && <p className="text-sm">{msg.content}</p>}
                                <p className={`text-[10px] mt-1 ${mine ? 'text-purple-200' : 'text-gray-500'}`}>
                                    {formatTime(msg.createdAt)}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-gray-900/80 backdrop-blur-sm">
                <div className="flex gap-3">
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <motion.button whileTap={{ scale: 0.9 }}
                        type="submit" disabled={sending || !text.trim()}
                        className="px-4 py-3 bg-purple-600 text-white rounded-xl disabled:opacity-50 transition-colors"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
