import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Code Mastery',
    description: 'Get in touch with Code Mastery. We are here to help you with any questions or support you need.',
};

export default function ContactPage() {
    return (
       <>
       <main className="min-h-screen pt-24 pb-12 bg-slate-50 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>
            </div>

            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-full text-sm font-semibold mb-6 gap-2">
                        <i className="fas fa-envelope text-xs"></i> Get in Touch
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        We'd Love to <br />
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Hear From You
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        Have a question about our courses, pricing, or just want to say hello? Fill out the form below or reach out to us directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                    {/* Contact Info & Info Cards */}
                    <div className="space-y-8 animate-fade-in-up [animation-delay:200ms]">

                        {/* Info Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
                                <p className="text-slate-500 text-sm mb-3">Our friendly team is here to help.</p>
                                <a href="mailto:support@codemastery.com" className="text-indigo-600 font-semibold text-sm hover:underline">aethefifthofjuly@gmail.com</a>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Visit Us</h3>
                                <p className="text-slate-500 text-sm mb-3">Come say hello at our office HQ.</p>
                                <p className="text-slate-800 font-semibold text-sm">Egypt</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Call Us</h3>
                                <p className="text-slate-500 text-sm mb-3">Mon-Fri from 8am to 5pm.</p>
                                <a href="tel:+15550000000" className="text-indigo-600 font-semibold text-sm hover:underline">+20 (12) 73024596</a>
                            </div>
<a href="#">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-comments"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Live Chat</h3>
                                <p className="text-slate-500 text-sm mb-3">Chat with our support team.</p>
                                <span className="text-indigo-600 font-semibold text-sm cursor-pointer hover:underline">Start a chat</span>
                            </div>
</a>
                        </div>

                        {/* FAQ Teaser */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
                                <p className="text-slate-300 mb-6">Find answers to common questions about our courses, platform, and pricing in our comprehensive FAQ section.</p>
                                <a href="/faq" className="inline-flex items-center text-sm font-semibold text-white hover:text-indigo-200 transition-colors">
                                    Visit FAQ Page <i className="fas fa-arrow-right ml-2"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 animate-fade-in-up [animation-delay:400ms]">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700" >First Name</label>
                                    <input type="text" id="firstName" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</label>
                                    <input type="text" id="lastName" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <input type="email" id="email" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <i className="fas fa-tag"></i>
                                    </div>
                                    <select id="subject" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-slate-600 appearance-none">
                                        <option value="" disabled selected>Select a topic</option>
                                        <option value="support">General Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <i className="fas fa-chevron-down text-xs"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400 resize-none" placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="submit" className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                                <span>Send Message</span>
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
</>
    );
}
