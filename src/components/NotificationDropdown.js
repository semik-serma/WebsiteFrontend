'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, UserPlus, UserCheck, MessageCircle, Video, Check, Loader2 } from 'lucide-react';

export default function NotificationDropdown() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const ref = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const t = localStorage.getItem('token');
        setToken(t || '');
    }, []);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(api.notification.list, { headers });
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) { /* silent */ }
    }, [token]);

    const fetchUnreadCount = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(api.notification.unreadCount, { headers });
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) { /* silent */ }
    }, [token]);

    useEffect(() => {
        if (!token || !open) return;
        fetchNotifications();
    }, [token, open, fetchNotifications]);

    useEffect(() => {
        if (!token) return;
        fetchUnreadCount();
        intervalRef.current = setInterval(fetchUnreadCount, 15000);
        return () => clearInterval(intervalRef.current);
    }, [token, fetchUnreadCount]);

    useEffect(() => {
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const markAllRead = async () => {
        try {
            await axios.post(api.notification.markRead('all'), {}, { headers });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) { /* silent */ }
    };

    const handleNotifClick = async (notif) => {
        if (!notif.read) {
            try {
                await axios.post(api.notification.markRead(notif._id), {}, { headers });
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
            } catch (err) { /* silent */ }
        }
        setOpen(false);
        if (notif.type === 'friend_request' || notif.type === 'friend_accepted') {
            router.push('/friends');
        } else if (notif.type === 'new_message' || notif.type === 'reel_shared') {
            const data = notif.data || {};
            if (data.chatId) {
                const fromId = notif.fromUser?._id;
                if (fromId) router.push(`/chat/${fromId}`);
                else router.push('/chat');
            } else {
                router.push('/chat');
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'friend_request': return <UserPlus className="w-4 h-4 text-blue-400" />;
            case 'friend_accepted': return <UserCheck className="w-4 h-4 text-green-400" />;
            case 'new_message': return <MessageCircle className="w-4 h-4 text-purple-400" />;
            case 'reel_shared': return <Video className="w-4 h-4 text-pink-400" />;
            default: return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (!token) return null;

    return (
        <div ref={ref} className="relative">
            <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(!open)}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h3 className="font-semibold text-white text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((n, i) => (
                                    <motion.button key={n._id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                                        onClick={() => handleNotifClick(n)}
                                        className={`w-full text-left flex items-start gap-3 p-3 transition-colors hover:bg-white/5 ${
                                            !n.read ? 'bg-purple-500/5 border-l-2 border-purple-500' : 'border-l-2 border-transparent'
                                        }`}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-200 line-clamp-2">{n.message}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{formatTime(n.createdAt)}</p>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
