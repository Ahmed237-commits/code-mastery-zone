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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log({ title, category, content, tags });
        setIsSubmitting(false);
        setIsSuccess(true);

        // In a real app, we would redirect here
        setTimeout(() => {
            window.location.href = '/community';
        }, 2000);
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Discussion Published!</h2>
                    <p className="text-slate-600">Your thoughts have been shared with the community. Redirecting you back...</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full animate-progress"></div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <Link
                        href="/community"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6 transition group"
                    >
                        <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Community
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        Start a <span className="text-indigo-600">New Discussion</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Share your thoughts, ask questions, or showcase your latest project.
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 overflow-hidden relative">
                    {/* Decorative Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60"></div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                                Discussion Title
                                <span className={`text-xs font-medium ${title.length > 80 ? 'text-red-500' : 'text-slate-400'}`}>
                                    {title.length}/100
                                </span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                required
                                maxLength={100}
                                placeholder="What's on your mind? Be descriptive."
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Category and Tags Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor="category" className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="general">General Discussion</option>
                                        <option value="help">Seeking Help</option>
                                        <option value="showcase">Project Showcase</option>
                                        <option value="announcement">Announcement</option>
                                        <option value="career">Career Advice</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="tags" className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                                    Tags (comma separated)
                                </label>
                                <input
                                    id="tags"
                                    type="text"
                                    placeholder="e.g. react, node, career"
                                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Content Input */}
                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-bold text-slate-700 uppercase tracking-wider flex justify-between">
                                Discussion Content
                                <span className="text-xs font-medium text-slate-400">
                                    Markdown supported
                                </span>
                            </label>
                            <textarea
                                id="content"
                                required
                                rows={10}
                                placeholder="Write your discussion content here. You can use Markdown-like structure to format your post..."
                                className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none min-h-[300px]"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Footer / Submit */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 gap-6">
                            <div className="flex items-center text-sm text-gray-500 italic">
                                <i className="fas fa-info-circle mr-2 text-indigo-500"></i>
                                Be respectful and helpful to others.
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-[0.98] flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : (
                                    'Publish Discussion'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Guidelines Section */}
                <div className="mt-12 bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
                    <h3 className="text-indigo-900 font-bold mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Community Guidelines
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800/80">
                        <li className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-3 shrink-0"></span>
                            Search for existing discussions before posting.
                        </li>
                        <li className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-3 shrink-0"></span>
                            Use clear and descriptive titles.
                        </li>
                        <li className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-3 shrink-0"></span>
                            Choose the most relevant category for your topic.
                        </li>
                        <li className="flex items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 mr-3 shrink-0"></span>
                            Be kind, supportive, and respectful.
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
