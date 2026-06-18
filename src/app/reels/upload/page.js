'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Hash, Globe, Lock, Loader2, ChevronLeft, Image, Video, Plus, Trash2, CheckCircle2 } from 'lucide-react';

function compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve) => {
        if (!file.type?.startsWith('image/')) return resolve(file);
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            if (w > maxWidth) { h *= maxWidth / w; w = maxWidth; }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob((blob) => {
                if (!blob) return resolve(file);
                const compressed = new File([blob], file.name, { type: file.type, lastModified: Date.now() });
                resolve(compressed.size < file.size ? compressed : file);
            }, file.type, quality);
        };
        img.src = URL.createObjectURL(file);
    });
}

export default function UploadReelPage() {
    const router = useRouter();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [caption, setCaption] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingFiles, setProcessingFiles] = useState(false);
    const [token, setToken] = useState('');
    const fileRef = useRef(null);

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (!t) router.push('/login');
        setToken(t);
    }, [router]);

    useEffect(() => {
        return () => previews.forEach(p => { if (p.startsWith('blob:')) URL.revokeObjectURL(p); });
    }, [previews]);

    const handleFileSelect = (e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;
        const valid = selected.filter(f => {
            if (f.size > 100 * 1024 * 1024) { alert(`${f.name} is over 100MB`); return false; }
            return true;
        });
        setFiles(prev => [...prev, ...valid]);
        const newPreviews = valid.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newPreviews]);
        if (fileRef.current) fileRef.current.value = '';
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            if (prev[index]?.startsWith('blob:')) URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!files.length) { alert('Please select at least one file'); return; }
        setUploading(true);
        setUploadProgress(0);
        try {
            setProcessingFiles(true);
            const compressed = await Promise.all(files.map(f => compressImage(f)));
            setProcessingFiles(false);

            const formData = new FormData();
            compressed.forEach(f => formData.append('media', f));
            formData.append('caption', caption);
            formData.append('hashtags', hashtags);
            formData.append('privacy', privacy);

            await axios.post(api.reel.upload, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
                onUploadProgress: (e) => {
                    if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
                }
            });
            setUploadProgress(100);
            setTimeout(() => { alert('Reel uploaded successfully!'); router.push('/reels'); }, 300);
        } catch (err) {
            console.error('Upload error:', err);
            alert(err.response?.data?.message || 'Failed to upload reel');
            setUploadProgress(0);
        } finally {
            setUploading(false);
            setProcessingFiles(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="max-w-lg mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-8">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <h1 className="text-2xl font-bold">Upload Reel</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File picker */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Photos & Videos *</label>
                        <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} className="hidden" />

                        <div className="grid grid-cols-3 gap-3">
                            {previews.map((p, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black border border-white/10 group"
                                >
                                    {files[i]?.type?.startsWith('video/') ? (
                                        <video src={p} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={p} alt="" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                        <motion.button type="button" whileTap={{ scale: 0.9 }}
                                            onClick={() => removeFile(i)}
                                            className="opacity-0 group-hover:opacity-100 bg-red-500 p-2 rounded-full transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                    {files[i]?.type?.startsWith('video/') && (
                                        <Video className="absolute top-2 left-2 w-4 h-4 text-white/80" />
                                    )}
                                </motion.div>
                            ))}

                            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => fileRef.current?.click()}
                                className="aspect-[9/16] rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-purple-500/50 hover:text-purple-400 transition-all bg-white/5"
                            >
                                <Plus className="w-8 h-8" />
                                <span className="text-xs">Add</span>
                            </motion.button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Supports images & videos • up to 100MB each • max 10 files</p>
                    </div>

                    {/* Caption */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Caption</label>
                        <textarea value={caption} onChange={(e) => setCaption(e.target.value)}
                            rows={3} placeholder="Write a caption..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                    </div>

                    {/* Hashtags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Hashtags</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                            <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)}
                                placeholder="react, javascript, coding (comma separated)"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Privacy</label>
                        <div className="flex gap-3">
                            {[
                                { value: 'public', icon: Globe, label: 'Public' },
                                { value: 'private', icon: Lock, label: 'Private' }
                            ].map(({ value, icon: Icon, label }) => (
                                <motion.button type="button" key={value} whileTap={{ scale: 0.95 }}
                                    onClick={() => setPrivacy(value)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${privacy === value
                                        ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" /> {label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <AnimatePresence>
                        {(uploading || processingFiles) && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-3">
                                {processingFiles ? (
                                    <div className="text-center text-sm text-purple-400 bg-purple-500/10 rounded-xl py-3 px-4 border border-purple-500/20">
                                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                                        Compressing images...
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>
                                                {uploadProgress < 100 ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Uploading to Cloudinary...</>
                                                ) : (
                                                    <><CheckCircle2 className="w-4 h-4 inline mr-2 text-green-400" />Processing...</>
                                                )}
                                            </span>
                                            <span className="font-mono">{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                            />
                                        </div>
                                        {files.length > 1 && (
                                            <p className="text-xs text-gray-500 text-center">
                                                Uploading {files.length} file{files.length !== 1 ? 's' : ''} — this may take a while for large videos
                                            </p>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        type="submit" disabled={uploading || processingFiles || !files.length}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {uploading || processingFiles ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> {processingFiles ? 'Compressing...' : `Uploading ${uploadProgress}%`}</>
                        ) : (
                            <><Upload className="w-5 h-5" /> Upload Reel ({files.length} file{files.length !== 1 ? 's' : ''})</>
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
