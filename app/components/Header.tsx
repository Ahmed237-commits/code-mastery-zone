'use client';

import React, { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations('Header');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('courses'), href: '/courses' },
    { name: t('community'), href: '/community' },
    { name: t('faq'), href: '/faq' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 border-b ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 border-slate-200/50'
        : 'bg-white/80 backdrop-blur-md border-transparent py-4'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20 transform -rotate-3 transition-transform group-hover:rotate-0">
            <i className="fas fa-code"></i>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent font-['Fredoka']">
            Code Mastrey
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 bg-white/50 px-8 py-2.5 rounded-full border border-white/60 shadow-sm backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors relative group ${isActive ? 'text-purple-600' : 'text-slate-600 hover:text-purple-600'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-500">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-indigo-600 font-bold text-lg">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-sm font-semibold text-slate-800 truncate">{session.user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <i className="fas fa-chart-line mr-2"></i> {t('dashboard')}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <i className="fas fa-user mr-2"></i> {t('profile')}
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signIn" className="text-slate-700 font-semibold hover:text-indigo-600 transition-colors">
                {t('signIn')}
              </Link>
              <Link href="/signUp" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all">
                {t('signUp')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-2xl text-slate-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="flex flex-col p-6 space-y-4">
          <div className="flex justify-start">
            <LanguageSwitcher />
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium ${isActive ? 'text-purple-600' : 'text-slate-600'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          {session ? (
            <>
              <div className="flex items-center gap-3 py-2 px-2 bg-slate-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border border-indigo-200">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-indigo-600 font-bold text-lg">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{session.user?.name}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[150px]">{session.user?.email}</p>
                </div>
              </div>
              <Link href="/dashboard" className="text-slate-700 font-medium py-2 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-chart-line mr-2"></i> {t('dashboard')}
              </Link>
              <Link href="/profile" className="text-slate-700 font-medium py-2 hover:text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-user mr-2"></i> {t('profile')}
              </Link>
              <button onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="text-red-600 font-medium py-2 text-left">
                <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/signIn" className="text-slate-700 font-medium pb-2" onClick={() => setIsMobileMenuOpen(false)}>{t('signIn')}</Link>
              <Link href="/signUp" className="text-indigo-600 font-bold" onClick={() => setIsMobileMenuOpen(false)}>{t('signUp')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
