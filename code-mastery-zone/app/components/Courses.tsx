// components/Courses.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, BookOpen, Clock, Users, Code, Globe, Gamepad2, Smartphone, ChevronLeft, Loader2 } from 'lucide-react';
import { Course, getCourses } from '@/app/lib/data';
import { useLanguage } from '@/app/components/LanguageContext'; // ✅ استخدم الـ Context

export default function Courses() {
  const t = useTranslations('HomeCourses');
  const { locale } = useLanguage(); // ✅ جلب اللغة من الـ Context
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // ✅ تمرير اللغة إلى الدالة
        const data = await getCourses(undefined, undefined, locale);
        setCourses(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [locale]); // ✅ إعادة الجلب عند تغيير اللغة

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </section>
    );
  }

  const getBadgeColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower === 'beginner' || levelLower === 'مبتدئ') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
    }
    if (levelLower === 'intermediate' || levelLower === 'متوسط') {
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
    }
    return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400';
  };

  const getLevelText = (level: string) => {
    if (level === 'beginner') return locale === 'ar' ? 'مبتدئ' : 'Beginner';
    if (level === 'intermediate') return locale === 'ar' ? 'متوسط' : 'Intermediate';
    return locale === 'ar' ? 'متقدم' : 'Advanced';
  };

  const getIcon = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower === 'python') return <Code className="w-7 h-7 text-white" />;
    if (tagLower === 'web') return <Globe className="w-7 h-7 text-white" />;
    if (tagLower === 'game') return <Gamepad2 className="w-7 h-7 text-white" />;
    return <Smartphone className="w-7 h-7 text-white" />;
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
              {t('tag')}
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {courses.map((course, index) => (
            <div 
              key={course._id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`, opacity: 0 }}
            >
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(course.level || 'beginner')}`}>
                  {getLevelText(course.level || 'beginner')}
                </span>
              </div>

              <div className="p-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getIcon(course.tag)}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                  {course.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                    <Users className="w-3 h-3" />
                    <span>{course.ageGroup}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {course.isFree ? t('free') : `${course.price}`}
                  </div>
                  <Link
                    href={`/courses/${course._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all duration-300 text-sm font-semibold"
                  >
                    <span>{t('viewCourse')}</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <span>{t('viewAllCourses')}</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}