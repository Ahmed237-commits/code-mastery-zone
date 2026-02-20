// app/components/Testimonials.tsx
'use client';

import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('Testimonials');

  const testimonialKeys = ['sarah', 'james', 'michael'] as const;
  const images = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  ];

  return (
    <section className="py-24 bg-slate-50" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="block text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">{t('tag')}</span>
          <h2 className="text-4xl font-bold text-slate-900">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialKeys.map((key, index) => (
            <div key={key} className="bg-white p-8 rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow duration-300">
              <i className="fas fa-quote-right absolute top-8 right-8 text-6xl text-indigo-500/10 transition-colors group-hover:text-indigo-500/20"></i>
              <p className="text-slate-700 mb-6 italic relative z-10 leading-relaxed min-h-[80px]">{t(`testimonials.${key}.quote`)}</p>
              <div className="flex items-center gap-4">
                <img
                  src={images[index]}
                  alt={t(`testimonials.${key}.name`)}
                  className="w-14 h-14 rounded-full object-cover border-4 border-slate-50"
                />
                <div>
                  <h4 className="text-slate-800 font-semibold">{t(`testimonials.${key}.name`)}</h4>
                  <p className="text-slate-500 text-xs">{t(`testimonials.${key}.role`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}