import React from 'react';
import Footer from '@/app/components/Footer';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function AboutPage({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('About');

    const stats = [
        { label: t('stats.students'), value: '10k+', icon: 'fa-users' },
        { label: t('stats.courses'), value: '50+', icon: 'fa-book-open' },
        { label: t('stats.instructors'), value: '20+', icon: 'fa-chalkboard-teacher' },
        { label: t('stats.satisfaction'), value: '4.9/5', icon: 'fa-star' },
    ];

    const team = [
        {
            name: 'Ahmed Eissa',
            role: t('team.roles.founder'),
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=202020&auto=format&fit=crop&q=80&w=400',
            bio: t('team.bios.founder'),
        },
        {
            name: 'Sarah Johnson',
            role: t('team.roles.headCurriculum'),
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?bg=202020&auto=format&fit=crop&q=80&w=400',
            bio: t('team.bios.headCurriculum'),
        },
        {
            name: 'Michael Chen',
            role: t('team.roles.seniorDev'),
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?bg=202020&auto=format&fit=crop&q=80&w=400',
            bio: t('team.bios.seniorDev'),
        },
        {
            name: 'Emily Davis',
            role: t('team.roles.communityManager'),
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?bg=202020&auto=format&fit=crop&q=80&w=400',
            bio: t('team.bios.communityManager'),
        }
    ];

    return (
        <>
            <main className="bg-slate-50 overflow-hidden">

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-slate-900 text-white overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-indigo-600/20 blur-[100px]"></div>
                        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px]"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold mb-6 animate-fade-in-up">
                            {t('hero.tag')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up [animation-delay:100ms]">
                            <span dangerouslySetInnerHTML={{ __html: t.raw('hero.title') }} />
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 animate-fade-in-up [animation-delay:200ms]">
                            {t('hero.subtitle')}
                        </p>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative -mt-16 z-20">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center p-4">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mb-3">
                                        <i className={`fas ${stat.icon}`}></i>
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                                    <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-1/2">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                                        alt="Team working together"
                                        className="relative rounded-3xl shadow-2xl z-10 w-full"
                                    />
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center z-20">
                                        <i className="fas fa-rocket text-4xl text-indigo-600"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                                    <span dangerouslySetInnerHTML={{ __html: t.raw('story.title') }} />
                                </h2>
                                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                                    <p>{t('story.p1')}</p>
                                    <p>{t('story.p2')}</p>
                                    <p>{t('story.p3')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{t('values.title')}</h2>
                            <p className="text-slate-600 text-lg">{t('values.subtitle')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: t('values.fun.title'), desc: t('values.fun.desc'), icon: 'fa-gamepad', color: 'bg-pink-50 text-pink-500' },
                                { title: t('values.quality.title'), desc: t('values.quality.desc'), icon: 'fa-award', color: 'bg-purple-50 text-purple-500' },
                                { title: t('values.community.title'), desc: t('values.community.desc'), icon: 'fa-users', color: 'bg-indigo-50 text-indigo-500' }
                            ].map((value, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center text-2xl mb-6`}>
                                        <i className={`fas ${value.icon}`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{t('team.title')}</h2>
                            <p className="text-slate-600 text-lg">{t('team.subtitle')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, i) => (
                                <div key={i} className="group relative">
                                    <div className="relative overflow-hidden rounded-3xl aspect-[3/4] mb-4">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <div className="flex gap-4 text-white">
                                                <a href="#" className="hover:text-indigo-400 transition-colors"><i className="fab fa-twitter"></i></a>
                                                <a href="#" className="hover:text-indigo-400 transition-colors"><i className="fab fa-linkedin"></i></a>
                                                <a href="#" className="hover:text-indigo-400 transition-colors"><i className="fab fa-github"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                                    <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                                    <p className="text-sm text-slate-500">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
