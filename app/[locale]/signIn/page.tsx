'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
    const router = useRouter();
    const t = useTranslations('SignIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                alert(t('invalidCredentials'));
                setIsLoading(false);
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#FAFAFA] overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 z-10">
                <div className="max-w-md mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transform -rotate-3 transition-transform group-hover:rotate-0">
                                <i className="fas fa-code text-lg"></i>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent font-['Fredoka']">
                                Code Mastrey
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2 font-['Outfit']">{t('welcomeBack')}</h1>
                        <p className="text-slate-500 text-sm">{t('subtitle')}</p>
                    </div>

                    {/* Social Sign In */}
                    <div className="space-y-3 mb-8">
                        <button
                            onClick={() => signIn('google', { callbackUrl: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 group"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                            <span>{t('continueGoogle')}</span>
                        </button>
                        <button
                            onClick={() => signIn('github', { callbackUrl: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-slate-900/10"
                        >
                            <i className="fab fa-github text-xl"></i>
                            <span>{t('continueGithub')}</span>
                        </button>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/50 backdrop-blur-sm text-slate-400">{t('orEmail')}</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{t('emailLabel')}</label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400 font-medium"
                                    placeholder={t('emailPlaceholder')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-medium text-slate-700">{t('passwordLabel')}</label>
                                <Link href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">{t('forgotPassword')}</Link>
                            </div>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400 font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <i className="fas fa-circle-notch fa-spin"></i> {t('signingIn')}
                                </span>
                            ) : t('signInButton')}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            {t('noAccount')}{' '}
                            <Link href="/signUp" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                                {t('createAccount')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
