import React from 'react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Contact Us | Code Mastery',
    description: 'Get in touch with Code Mastery. We are here to help you with any questions or support you need.',
};

export default async function ContactPage({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Contact');

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
                        <i className="fas fa-envelope text-xs"></i> {t('header.tag')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        <span dangerouslySetInnerHTML={{ __html: t.raw('header.title') }} />
                    </h1>
                    <p className="text-lg text-slate-600">
                        {t('header.subtitle')}
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
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('cards.email.title')}</h3>
                                <p className="text-slate-500 text-sm mb-3">{t('cards.email.desc')}</p>
                                <a href="mailto:support@codemastery.com" className="text-indigo-600 font-semibold text-sm hover:underline">aethefifthofjuly@gmail.com</a>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('cards.visit.title')}</h3>
                                <p className="text-slate-500 text-sm mb-3">{t('cards.visit.desc')}</p>
                                <p className="text-slate-800 font-semibold text-sm">{t('cards.visit.location')}</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('cards.call.title')}</h3>
                                <p className="text-slate-500 text-sm mb-3">{t('cards.call.desc')}</p>
                                <a href="tel:+15550000000" className="text-indigo-600 font-semibold text-sm hover:underline">+20 (12) 73024596</a>
                            </div>
<a href="#">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-comments"></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('cards.chat.title')}</h3>
                                <p className="text-slate-500 text-sm mb-3">{t('cards.chat.desc')}</p>
                                <span className="text-indigo-600 font-semibold text-sm cursor-pointer hover:underline">{t('cards.chat.action')}</span>
                            </div>
</a>
                        </div>

                        {/* FAQ Teaser */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">{t('faq.title')}</h3>
                                <p className="text-slate-300 mb-6">{t('faq.desc')}</p>
                                <a href="/faq" className="inline-flex items-center text-sm font-semibold text-white hover:text-indigo-200 transition-colors">
                                    {t('faq.action')} <i className="fas fa-arrow-right ml-2"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-white/60 animate-fade-in-up [animation-delay:400ms]">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('form.title')}</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700" >{t('form.firstName')}</label>
                                    <input type="text" id="firstName" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400" placeholder={t('form.placeholders.firstName')} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700">{t('form.lastName')}</label>
                                    <input type="text" id="lastName" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400" placeholder={t('form.placeholders.lastName')} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">{t('form.email')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <input type="email" id="email" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400" placeholder={t('form.placeholders.email')} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-slate-700">{t('form.subject')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <i className="fas fa-tag"></i>
                                    </div>
                                    <select id="subject" className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 text-slate-600 appearance-none">
                                        <option value="" disabled selected>{t('form.placeholders.selectTopic')}</option>
                                        <option value="support">{t('form.topics.support')}</option>
                                        <option value="billing">{t('form.topics.billing')}</option>
                                        <option value="partnership">{t('form.topics.partnership')}</option>
                                        <option value="other">{t('form.topics.other')}</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <i className="fas fa-chevron-down text-xs"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">{t('form.message')}</label>
                                <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 placeholder:text-slate-400 resize-none" placeholder={t('form.placeholders.message')}></textarea>
                            </div>

                            <button type="submit" className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                                <span>{t('form.send')}</span>
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
