'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CommunityHero() {
    const t = useTranslations('Community.hero');

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 text-center">
                <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                    {t('tag')}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                    <span dangerouslySetInnerHTML={{ __html: t.raw('title') }} />
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                    {t('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/community/new"
                        className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-center"
                    >
                        {t('startDiscussion')}
                    </Link>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="px-6 py-4 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all"
                        />
                        <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition"></i>
                    </div>
                </div>
            </div>
        </section>
    );
}
