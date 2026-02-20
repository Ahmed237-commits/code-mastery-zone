// app/components/Features.tsx
'use client';

import { useTranslations } from 'next-intl';

export default function Features() {
  const t = useTranslations('Features');

  const features = [
    {
      icon: 'gamepad',
      title: t('gamified.title'),
      description: t('gamified.desc'),
    },
    {
      icon: 'laptop-code',
      title: t('projects.title'),
      description: t('projects.desc'),
    },
    {
      icon: 'users',
      title: t('community.title'),
      description: t('community.desc'),
    },
    {
      icon: 'chalkboard-teacher',
      title: t('mentors.title'),
      description: t('mentors.desc'),
    },
  ];

  return (
    <section className="py-24 relative" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="block text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">{t('tag')}</span>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('title')}</h2>
          <p className="text-slate-500 text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 text-center border border-gray-100 transition-all duration-300 hover:-translate-y-2.5 hover:shadow-xl relative overflow-hidden group"
            >
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>

              <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center text-indigo-600 text-3xl transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:[transform:rotateY(360deg)]">
                <i className={`fas fa-${feature.icon}`}></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}