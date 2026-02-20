// app/components/Courses.tsx
'use client';

import { useTranslations } from 'next-intl';

export default function Courses() {
  const t = useTranslations('HomeCourses');

  const courseKeys = ['python', 'web', 'game', 'app'] as const;
  const images = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580234547948-43840776b978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <section className="py-24 bg-gray-50" id="courses">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="block text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">{t('tag')}</span>
          <h2 className="text-4xl font-bold text-slate-900">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courseKeys.map((key, index) => (
            <div
              key={key}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col group"
            >
              <div className="relative h-52 overflow-hidden">
                <span className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 backdrop-blur-sm z-10">
                  {t(`courses.${key}.tag`)}
                </span>
                <img
                  src={images[index]}
                  alt={t(`courses.${key}.title`)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between mb-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <i className="far fa-clock"></i> {t(`courses.${key}.duration`)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="fas fa-signal"></i> {t(`courses.${key}.age`)}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{t(`courses.${key}.title`)}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 subpixel-antialiased leading-relaxed">{t(`courses.${key}.description`)}</p>
                <div className="border-t border-gray-100 pt-5 flex justify-between items-center">
                  <span className="text-xl font-bold text-indigo-600 font-sans">{t('free')}</span>
                  <a href="#" className="text-slate-700 font-semibold no-underline flex items-center gap-1.5 text-sm transition-all duration-300 hover:text-indigo-600 hover:gap-2.5">
                    {t('viewCourse')} <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}