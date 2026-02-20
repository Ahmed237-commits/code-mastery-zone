// app/components/Footer.tsx
'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  const learnItems = ['python', 'webDev', 'gameDesign', 'mobileApps'] as const;
  const companyItems = ['about', 'careers', 'blog', 'contact'] as const;

  return (
    <footer className="bg-slate-900 text-slate-400 pt-36 pb-12" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-6 no-underline group">
              <div className="w-11 h-11 bg-white text-slate-900 rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:rotate-12 transition-transform">
                <i className="fas fa-code"></i>
              </div>
              <span className="text-2xl font-bold text-white">
                CodeMastery
              </span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs text-slate-400">
              {t('description')}
            </p>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-6">{t('learn')}</h4>
            <ul className="space-y-3">
              {learnItems.map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                    {t(`learnItems.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-6">{t('company')}</h4>
            <ul className="space-y-3">
              {companyItems.map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase()}`} className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                    {t(`companyItems.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-semibold mb-6">{t('followUs')}</h4>
            <div className="flex gap-4">
              {['facebook-f', 'twitter', 'instagram', 'youtube'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300"
                >
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-sm">
          <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">{t('privacyPolicy')}</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">{t('termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}