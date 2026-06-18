'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Film, FileText, MessageCircle, Trash2, Shield, LogOut, Search, X, Loader2, ChevronDown } from 'lucide-react';

export default function AdminPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [reels, setReels] = useState([]);
    const [articles, setArticles] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) {
            setToken(t);
            try {
                const payload = JSON.parse(atob(t.split('.')[1]));
                if (payload.role === 'ADMIN') {
                    setUser(payload);
                    setAuthenticated(true);
                }
            } catch {}
        }
        setLoading(false);
    }, []);

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const res = await axios.post(api.auth.login, { email, password });
            const { token: newToken, data } = res.data.data;
            if (data.role !== 'ADMIN') {
                setLoginError('Access denied. Admin only.');
                setLoginLoading(false);
                return;
            }
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(data));
            setToken(newToken);
            setUser(data);
            setAuthenticated(true);
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Login failed');
        }
        setLoginLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('');
        setUser(null);
        setAuthenticated(false);
        setStats(null);
        setUsers([]);
        setReels([]);
        setArticles([]);
    };

    useEffect(() => {
        if (!authenticated || !token) return;
        const fetchData = async () => {
            try {
                const [statsRes, usersRes, reelsRes, articlesRes] = await Promise.all([
                    axios.get(api.admin.stats, { headers }),
                    axios.get(api.admin.users, { headers }),
                    axios.get(api.admin.reels, { headers }),
                    axios.get(api.admin.articles, { headers }),
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data.users || []);
                setReels(reelsRes.data.reels || []);
                setArticles(articlesRes.data.articles || []);
            } catch (err) {
                if (err.response?.status === 403 || err.response?.status === 401) {
                    handleLogout();
                }
            }
        };
        fetchData();
    }, [authenticated, token]);

    const handleDeleteUser = async (id) => {
        if (!confirm('Delete this user and ALL their data (reels, chats, articles)?')) return;
        try {
            await axios.delete(api.admin.deleteUser(id), { headers });
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const handleDeleteReel = async (id) => {
        if (!confirm('Delete this reel?')) return;
        try {
            await axios.delete(api.admin.deleteReel(id), { headers });
            setReels(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const handleDeleteArticle = async (id) => {
        if (!confirm('Delete this article?')) return;
        try {
            await axios.delete(api.admin.deleteArticle(id), { headers });
            setArticles(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="admin@semikdev.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="••••••••" required />
                        </div>
                        {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                        <button type="submit" disabled={loginLoading} className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                            {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            {loginLoading ? 'Logging in...' : 'Login as Admin'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Shield },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'reels', label: 'Reels', icon: Film },
        { id: 'articles', label: 'Articles', icon: FileText },
    ];

    const filteredUsers = users.filter(u => `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredReels = reels.filter(r => (r.caption || '').toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredArticles = articles.filter(a => (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-blue-600" />
                            <span className="text-lg font-bold text-gray-900">Admin Panel</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/')} className="text-sm text-gray-600 hover:text-blue-600 transition">Back to Site</button>
                            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab !== 'dashboard' && (
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && stats && (
                        <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
                                { label: 'Total Reels', value: stats.totalReels, icon: Film, color: 'from-purple-500 to-purple-600' },
                                { label: 'Total Articles', value: stats.totalArticles, icon: FileText, color: 'from-green-500 to-green-600' },
                                { label: 'Total Chats', value: stats.totalChats, icon: MessageCircle, color: 'from-orange-500 to-orange-600' },
                            ].map((item) => (
                                <div key={item.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                                        <item.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                            {filteredUsers.map((u) => (
                                <div key={u._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                            {u.firstname?.[0]}{u.lastname?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{u.firstname} {u.lastname}</p>
                                            <p className="text-xs text-gray-500">{u.email} {u.role === 'ADMIN' && <span className="text-blue-600 font-medium ml-1">(Admin)</span>}</p>
                                        </div>
                                    </div>
                                    {u.role !== 'ADMIN' && (
                                        <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete user">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {filteredUsers.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No users found</p>}
                        </motion.div>
                    )}

                    {activeTab === 'reels' && (
                        <motion.div key="reels" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                            {filteredReels.map((r) => (
                                <div key={r._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{r.caption || 'No caption'}</p>
                                        <p className="text-xs text-gray-500">
                                            by {r.user?.firstname} {r.user?.lastname} • {r.media?.length || 0} media • {r.likesCount || 0} likes
                                        </p>
                                    </div>
                                    <button onClick={() => handleDeleteReel(r._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0" title="Delete reel">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {filteredReels.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No reels found</p>}
                        </motion.div>
                    )}

                    {activeTab === 'articles' && (
                        <motion.div key="articles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-3">
                            {filteredArticles.map((a) => (
                                <div key={a._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                                        <p className="text-xs text-gray-500">by {a.author}</p>
                                    </div>
                                    <button onClick={() => handleDeleteArticle(a._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0" title="Delete article">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {filteredArticles.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No articles found</p>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
