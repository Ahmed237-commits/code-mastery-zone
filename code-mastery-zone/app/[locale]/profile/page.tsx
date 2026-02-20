'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSession } from 'next-auth/react';
import { getDiscussions, Discussion } from '../lib/data';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userDiscussions, setUserDiscussions] = useState<Discussion[]>([]);

    // Mock state for form (in a real app, this would come from an API/Session)
    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        bio: 'Passionate learner and future coding master.',
        location: 'Planet Earth',
        website: 'https://github.com/codemastery'
    });

    // Update form data when session loads
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user?.name || '',
                email: session.user?.email || ''
            }));
        }
    }, [session]);

    // Fetch user discussions
    useEffect(() => {
        const fetchUserDiscussions = async () => {
            try {
                const allDiscussions = await getDiscussions();
                // Filter discussions by user name (mock logic, ideally by ID)
                const filtered = allDiscussions.filter(
                    d => d.user.name === (session?.user?.name || 'Guest User')
                );
                setUserDiscussions(filtered);
            } catch (error) {
                console.error("Error fetching discussions", error);
            }
        };

        if (session?.user) {
            fetchUserDiscussions();
        } else {
            // Fetch anyway for guest user demo
            fetchUserDiscussions();
        }
    }, [session]);


    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsEditing(false);
            alert('Profile updated successfully!'); // Replace with a nicer toast if available
        }, 1000);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-50 pt-20 pb-12">
                {/* Profile Header/Banner */}
                <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                <div className="container mx-auto px-6 -mt-20 relative z-10">
                    <div className="max-w-4xl mx-auto">

                        {/* Profile Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row gap-8 items-start">

                                    {/* Avatar */}
                                    <div className="relative -mt-24 md:-mt-20">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl bg-white flex items-center justify-center overflow-hidden">
                                            {session?.user?.image ? (
                                                <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-4xl font-bold text-indigo-600">{session?.user?.name?.charAt(0) || 'U'}</span>
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <button className="absolute bottom-2 right-2 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg cursor-pointer max-w-10 max-h-10 border-2 border-white">
                                                <i className="fas fa-camera text-sm"></i>
                                            </button>
                                        )}
                                    </div>

                                    {/* Header Info */}
                                    <div className="flex-1 pt-2 md:pt-4">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                            <div>
                                                <h1 className="text-3xl font-bold text-slate-800 mb-1">{session?.user?.name || 'Guest User'}</h1>
                                                <p className="text-slate-500 font-medium">Full Stack Developer Student</p>
                                            </div>
                                            <button
                                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                                className={`px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2 ${isEditing
                                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                {isLoading ? (
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                ) : (
                                                    <i className={`fas ${isEditing ? 'fa-save' : 'fa-pen'}`}></i>
                                                )}
                                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                                            </button>
                                        </div>

                                        <div className="flex gap-6 text-sm text-slate-600 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-map-marker-alt text-slate-400"></i>
                                                {formData.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-envelope text-slate-400"></i>
                                                {session?.user?.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-link text-slate-400"></i>
                                                <a href="#" className="hover:text-indigo-600 transition-colors">codemastery.com</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-8"></div>

                                {/* Profile Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${isEditing
                                                    ? 'bg-white border-slate-200 focus:border-indigo-500'
                                                    : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled={true} // Email usually not editable directly
                                                className="w-full px-4 py-3 rounded-xl border border-transparent bg-slate-50 text-slate-500 cursor-not-allowed"
                                            />
                                            {isEditing && <p className="text-xs text-orange-500 mt-1 pl-1">Email cannot be changed via profile settings.</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${isEditing
                                                    ? 'bg-white border-slate-200 focus:border-indigo-500'
                                                    : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                                            <textarea
                                                rows={4}
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-none ${isEditing
                                                    ? 'bg-white border-slate-200 focus:border-indigo-500'
                                                    : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'
                                                    }`}
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Social Links</label>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                                        <i className="fab fa-github"></i>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Github Profile URL"
                                                        disabled={!isEditing}
                                                        className={`flex-1 px-4 py-2.5 rounded-xl border transition-colors focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${isEditing
                                                            ? 'bg-white border-slate-200 focus:border-indigo-500'
                                                            : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'
                                                            }`}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <i className="fab fa-twitter"></i>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Twitter Profile URL"
                                                        disabled={!isEditing}
                                                        className={`flex-1 px-4 py-2.5 rounded-xl border transition-colors focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${isEditing
                                                            ? 'bg-white border-slate-200 focus:border-indigo-500'
                                                            : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* User's Discussions Section */}
                    <div className="mt-12 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <i className="fas fa-comments text-sm"></i>
                                </span>
                                My Discussions
                            </h2>
                            <a href="/community/new" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                + Start New
                            </a>
                        </div>

                        {/* Discussions Grid/List */}
                        <div className="grid grid-cols-1 gap-6">
                            {userDiscussions.length > 0 ? (
                                userDiscussions.map((discussion) => (
                                    <div key={discussion._id || Math.random().toString()} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                                    {discussion.category}
                                                </span>
                                                <span className="text-xs text-slate-400">{discussion.createdAt ? new Date(discussion.createdAt).toLocaleDateString() : discussion.time || 'Recently'}</span>
                                            </div>
                                            <div className="flex gap-4 text-slate-400 text-xs font-semibold">
                                                <span className="flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                                                    <i className="far fa-heart"></i> {discussion.likes}
                                                </span>
                                                <span className="flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                                                    <i className="far fa-comment"></i> {discussion.comments?.length || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                                            {discussion.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                            {discussion.excerpt}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <i className="fas fa-comments text-2xl"></i>
                                    </div>
                                    <h3 className="text-slate-800 font-bold mb-1">No discussions yet</h3>
                                    <p className="text-slate-500 text-sm mb-6">Share your first thoughts with our amazing community!</p>
                                    <a href="/community/new" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                        Start a Discussion
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
