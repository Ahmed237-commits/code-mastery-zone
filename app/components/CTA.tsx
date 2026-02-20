// app/components/CTA.tsx
'use client';

import { useTranslations } from 'next-intl';

export default function CTA() {
  const t = useTranslations('CTA');

  return (
    <section className="py-20 mb-[-50px] relative z-20">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-indigo-500/30 flex flex-col items-center relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
          {/* Background decorations */}
          <div className="absolute w-48 h-48 bg-white/10 rounded-full -top-12 -left-12 blur-2xl"></div>
          <div className="absolute w-36 h-36 bg-white/10 rounded-full -bottom-8 -right-8 blur-xl"></div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">{t('title')}</h2>
          <p className="text-lg text-white/90 max-w-2xl mb-10 relative z-10">
            {t('subtitle')}
          </p>
          <a href="/signup" className="inline-block bg-white text-indigo-600 font-bold px-10 py-4 rounded-full relative z-10 hover:bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            {t('button')}
          </a>
        </div>
      </div>
    </section>
  );
}