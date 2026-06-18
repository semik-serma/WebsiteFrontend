'use client';

import { Camera, Save, X, User, FileText, Image as ImageIcon, Eye, Hash, Type, AlignLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRef } from "react";
import { useRouter } from "next/navigation" 
import axios from 'axios';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } }
};

export default function CreateArticlePage() {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        image: null,
        content: ''
    });
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [activeSection, setActiveSection] = useState('title');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [progress, setProgress] = useState(0);

    const router = useRouter();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const words = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;
        setWordCount(words);
        setCharCount(formData.content.length);
        let filled = 0;
        if (formData.title.trim()) filled++;
        if (formData.author.trim()) filled++;
        if (formData.content.trim()) filled++;
        if (tags.length > 0) filled++;
        setProgress(Math.round((filled / 4) * 100));
    }, [formData, tags]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(prev => ({ ...prev, image: file }));
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
        if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags(prev => [...prev, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.author.trim()) newErrors.author = 'Author is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                setActiveSection(firstErrorField);
                setTimeout(() => document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
            return;
        }
        try {
            setLoading(true);
            const submitFormData = new FormData();
            submitFormData.append('title', formData.title);
            submitFormData.append('author', formData.author);
            submitFormData.append('content', formData.content);
            if (formData.image) submitFormData.append('image', formData.image);
            tags.forEach(tag => submitFormData.append('tags', tag));

            await axios.post(api.comment.afterlogincomment, submitFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Article created successfully!');
            setFormData({ title: '', author: '', image: null, content: '' });
            setImagePreview(null);
            setTags([]);
            setActiveSection('title');
        } catch (error) {
            console.error('Error creating article:', error);
            alert('Failed to create article. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/login");
        return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
    }, [router, imagePreview]);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                let inputElement;
                switch (section) {
                    case 'title': inputElement = element.querySelector('input'); break;
                    case 'author': inputElement = element.querySelector('input'); break;
                    case 'image': inputElement = element.querySelector('input[type="file"]'); break;
                    case 'content': inputElement = element.querySelector('textarea'); break;
                }
                if (inputElement) setTimeout(() => inputElement.focus(), 100);
            }
        }, 100);
    };

    const navItems = [
        { id: 'title', icon: Type, label: 'Title' },
        { id: 'author', icon: User, label: 'Author' },
        { id: 'image', icon: ImageIcon, label: 'Featured Image' },
        { id: 'content', icon: AlignLeft, label: 'Content' }
    ];

    return (
        <motion.div initial="initial" animate="animate" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div variants={fadeUp} className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <motion.div variants={fadeUp} className="bg-gradient-to-b from-white to-gray-50 shadow-xl rounded-2xl p-6 border border-gray-200 sticky top-8">
                            <div className="mb-6 pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">Article Sections</span>
                                </h2>
                            </div>
                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Completion</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                            <nav className="space-y-1">
                                {navItems.map(({ id, icon: Icon, label }) => (
                                    <motion.button
                                        key={id}
                                        type="button"
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSectionChange(id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 flex items-center gap-3 text-sm font-medium ${activeSection === id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm' : 'text-gray-700'} group`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors ${activeSection === id ? 'bg-blue-200' : 'bg-blue-100'} group-hover:bg-blue-200`}>
                                            <Icon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className={`transition-colors ${activeSection === id ? 'text-blue-700' : 'group-hover:text-blue-700'}`}>{label}</span>
                                    </motion.button>
                                ))}
                            </nav>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setShowPreview(true)}
                                className="mt-6 w-full px-4 py-2.5 border border-blue-200 text-blue-700 font-medium rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <Eye className="w-4 h-4" />
                                Preview Article
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Main Form Content */}
                    <motion.div variants={fadeUp} className="lg:w-3/4">
                        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
                            <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
                                <div>
                                    <motion.h1 variants={fadeUp} className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.6, delay: 0.3 }}>
                                            <FileText className="w-8 h-8 text-blue-600" />
                                        </motion.span>
                                        Create New Article
                                    </motion.h1>
                                    <motion.p variants={fadeUp} className="text-gray-600 mt-2">Share your knowledge and experience with the world</motion.p>
                                </div>
                                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
                                    <FileText className="w-10 h-10 text-blue-200" />
                                </motion.div>
                            </motion.div>

                            <motion.form variants={stagger} className="space-y-8" onSubmit={handleSubmit}>
                                {/* Title Field */}
                                <motion.div variants={fadeUp} id="title" className="space-y-2">
                                    <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                        Title *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Type className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required
                                            className={`w-full pl-10 pr-3 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                            placeholder="Enter article title..."
                                        />
                                        {errors.title && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-sm text-red-600">{errors.title}</motion.p>}
                                    </div>
                                </motion.div>

                                {/* Author Field */}
                                <motion.div variants={fadeUp} id="author" className="space-y-2">
                                    <label htmlFor="author" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                        Author *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text" id="author" name="author" value={formData.author} onChange={handleInputChange} required
                                            className={`w-full pl-10 pr-3 py-3 border ${errors.author ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                            placeholder="Enter author name..."
                                        />
                                        {errors.author && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-sm text-red-600">{errors.author}</motion.p>}
                                    </div>
                                </motion.div>

                                {/* Tags Field */}
                                <motion.div variants={fadeUp} id="tags" className="space-y-2">
                                    <label htmlFor="tags" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                                        Tags
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Hash className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text" id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            placeholder="Type a tag and press Enter..."
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {tags.length > 0 && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mt-2">
                                                {tags.map((tag) => (
                                                    <motion.span
                                                        key={tag}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                                                    >
                                                        #{tag}
                                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600 transition-colors">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </motion.span>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Image Upload Field */}
                                <motion.div variants={fadeUp} id="image" className="space-y-2">
                                    <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                        Featured Image
                                    </label>
                                    <div className="mt-1 space-y-4">
                                        <input type="file" id="image" name="image" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className="flex flex-col items-center justify-center w-full min-h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-8 pb-6 px-4 text-center">
                                                <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity }}>
                                                    <Camera className="w-12 h-12 mb-4 text-gray-400" />
                                                </motion.div>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 mb-4">PNG, JPG, GIF (MAX. 5MB)</p>
                                                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                                                    Select Image
                                                </div>
                                            </div>
                                        </motion.div>
                                        <AnimatePresence>
                                            {imagePreview && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-600 font-medium">Image Preview:</p>
                                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                            type="button" onClick={removeImage}
                                                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                                        >
                                                            <X className="w-4 h-4" /> Remove
                                                        </motion.button>
                                                    </div>
                                                    <motion.div
                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="relative inline-block"
                                                    >
                                                        <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg object-cover border border-gray-200 shadow-md" />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                                </motion.div>

                                {/* Content Field */}
                                <motion.div variants={fadeUp} id="content" className="space-y-2">
                                    <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                        Content *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                            <AlignLeft className="h-5 w-5 text-gray-400 mt-1" />
                                        </div>
                                        <textarea
                                            id="content" name="content" value={formData.content} onChange={handleInputChange} required
                                            rows={14}
                                            className={`w-full pl-10 pr-3 py-3 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none`}
                                            placeholder="Write your article content here..."
                                        />
                                        {errors.content && <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-1 text-sm text-red-600">{errors.content}</motion.p>}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{wordCount} words</span>
                                        <span>{charCount} characters</span>
                                    </div>
                                </motion.div>

                                {/* Submit */}
                                <motion.div variants={fadeUp} className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        type="button" onClick={() => { setFormData({ title: '', author: '', image: null, content: '' }); setImagePreview(null); setTags([]); }}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                                    >
                                        Reset
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        type="submit" disabled={loading}
                                        className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
                                    >
                                        {loading ? (
                                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                                <Save className="w-4 h-4" />
                                            </motion.span>
                                        ) : (
                                            <><Save className="w-4 h-4" /> Create Article</>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </motion.form>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Preview Modal */}
                <AnimatePresence>
                    {showPreview && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowPreview(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Article Preview</h2>
                                    <motion.button whileHover={{ rotate: 90 }} onClick={() => setShowPreview(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover rounded-xl mb-6 shadow-md" />
                                )}
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">{formData.title || 'Untitled'}</h1>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><User className="w-4 h-4" />{formData.author || 'Unknown'}</span>
                                    {tags.length > 0 && tags.map(t => (
                                        <span key={t} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">#{t}</span>
                                    ))}
                                </div>
                                <div className="prose prose-gray max-w-none">
                                    {formData.content ? (
                                        formData.content.split('\n').map((p, i) => p ? <p key={i} className="mb-3 text-gray-700 leading-relaxed">{p}</p> : <br key={i} />)
                                    ) : (
                                        <p className="text-gray-400 italic">No content yet...</p>
                                    )}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                                    <span>{wordCount} words</span>
                                    <span>{charCount} characters</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}