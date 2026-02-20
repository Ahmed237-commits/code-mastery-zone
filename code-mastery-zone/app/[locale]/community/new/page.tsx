'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NewDiscussionPage() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('general');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const categories = [
        { id: 'general', label: 'General Discussion', icon: '💬', description: 'Talk about anything tech-related' },
        { id: 'help', label: 'Seeking Help', icon: '🆘', description: 'Stuck on a problem? Ask the community' },
        { id: 'showcase', label: 'Project Showcase', icon: '✨', description: 'Show off what you’ve built' },
        { id: 'announcement', label: 'Announcement', icon: '📢', description: 'Share news or updates' },
        { id: 'career', label: 'Career Advice', icon: '💼', description: 'Discuss jobs, interviews, and growth' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('http://localhost:8000/api/discussions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    category,
                    content,
                    tags: tags.split(',').map(t => t.trim()),
                    // user: 'demo-user-id' needs to be handled via auth or backend dummy user
                })
            });

            if (!res.ok) throw new Error('Failed to publish');

            setIsSuccess(true);

            // Redirect
            setTimeout(() => {
                window.location.href = '/community';
            }, 2500);

        } catch (error) {
            console.error('Error publishing discussion:', error);
            alert('Failed to publish discussion. Please check the backend connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

                <div className="relative max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-100 border border-green-50 p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200 animate-bounce">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-ping"></div>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Success!</h2>
                        <p className="text-lg text-slate-600 font-medium">Your discussion is now live.</p>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-600 h-full w-full origin-left animate-[progress_2s_ease-in-out]"></div>
                    </div>

                    <p className="text-sm text-slate-400 animate-pulse">Redirecting you to the community...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 relative selection:bg-indigo-100 selection:text-indigo-900">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto mb-12 text-center">
                    <Link
                        href="/community"
                        className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all group mb-8 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Discussions</span>
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                        Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Conversation</span>
                    </h1>
                    <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                        Share your knowledge, ask questions, or showcase your latest work to the community.
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50 p-6 md:p-12 overflow-hidden relative group">

                    {/* Top Gradient Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">

                        {/* Title Section */}
                        <div className="space-y-4">
                            <label htmlFor="title" className="block text-sm font-bold text-slate-900 uppercase tracking-wider pl-1">
                                Discussion Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group/input">
                                <input
                                    id="title"
                                    type="text"
                                    required
                                    maxLength={100}
                                    placeholder="e.g., How to handle state management effectively in Next.js 14?"
                                    className="w-full px-8 py-6 text-xl md:text-2xl font-semibold placeholder:text-slate-300 placeholder:font-normal rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none transition-colors duration-300">
                                    <span className={title.length > 80 ? 'text-orange-500' : 'text-slate-400'}>
                                        {title.length}
                                    </span>
                                    <span className="text-slate-300">/100</span>
                                </div>
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider pl-1">
                                Select a Category <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 group ${category === cat.id
                                            ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 shadow-lg shadow-indigo-100 transform scale-[1.02]'
                                            : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <span className={`text-2xl p-2 rounded-lg transition-colors ${category === cat.id ? 'bg-indigo-100' : 'bg-slate-50 group-hover:bg-indigo-50'
                                                }`}>
                                                {cat.icon}
                                            </span>
                                            <div>
                                                <h3 className={`font-bold transition-colors ${category === cat.id ? 'text-indigo-900' : 'text-slate-700 group-hover:text-indigo-700'
                                                    }`}>
                                                    {cat.label}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                                                    {cat.description}
                                                </p>
                                            </div>
                                        </div>
                                        {category === cat.id && (
                                            <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-4">
                            <label htmlFor="tags" className="block text-sm font-bold text-slate-900 uppercase tracking-wider pl-1">
                                Tags
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </span>
                                <input
                                    id="tags"
                                    type="text"
                                    placeholder="Add relevant tags separated by commas (e.g., react, typescript, guide)"
                                    className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pl-1">
                                <label htmlFor="content" className="block text-sm font-bold text-slate-900 uppercase tracking-wider">
                                    Discussion Content <span className="text-red-500">*</span>
                                </label>
                                <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full flex items-center">
                                    <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.8 7.375a.999.999 0 0 0-.965-.775h-3.92a1.001 1.001 0 0 0-.256 1.968l1.492.384-2.15 6.002-2.148-5.996 1.34-.392a1.002 1.002 0 0 0-.246-1.936H9.98a.999.999 0 0 0-.954.752l-.01.042-3.006 9.006H3.35a.999.999 0 0 0 0 1.998h5.666a1.001 1.001 0 0 0 .942-.656l1.39-4.17 1.39 4.172a.999.999 0 0 0 .944.654h5.666a1 1 0 0 0 .991-1.002c0-.49-.49-1.002-1.001-1.002h-2.528l-2.072-5.786 1.492-.384a.998.998 0 0 0 .762-.892l.066-1.998z" />
                                    </svg>
                                    Markdown Supported
                                </div>
                            </div>
                            <div className="relative">
                                <textarea
                                    id="content"
                                    required
                                    rows={12}
                                    placeholder="Write your thoughts here..."
                                    className="w-full px-8 py-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-y min-h-[300px] text-lg leading-relaxed text-slate-700"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                                {/* Bottom right resize handle decoration */}
                                <div className="absolute bottom-4 right-4 pointer-events-none text-slate-300">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 22h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 4h-2v-2h2v2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 flex justify-end items-center gap-6">
                            <Link href="/community" className="text-slate-500 font-bold hover:text-slate-700 transition px-4 py-2">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`relative group px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 overflow-hidden w-full sm:w-auto ${isSubmitting ? 'cursor-not-allowed opacity-90' : ''}`}
                            >
                                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out -skew-x-12 -translate-x-full"></div>
                                <span className="relative flex items-center justify-center gap-3">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            Publish Discussion
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-slate-400 mt-12 text-sm font-medium">
                    By posting, you agree to our <a href="#" className="text-indigo-500 hover:underline">Community Guidelines</a> and <a href="#" className="text-indigo-500 hover:underline">Content Policy</a>.
                </p>
            </div>
        </main>
    );
}
