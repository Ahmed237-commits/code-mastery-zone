// components/Courses.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getCourses } from '@/app/lib/data';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CourseCard from '@/app/[locale]/courses/components/CourseCard';

export default function Courses() {
  const t = useTranslations('HomeCourses');
  const coursesT = useTranslations('Courses');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        // عرض أول 3 كورسات فقط
        setCourses(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold">{t('tag')}</span>
          <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              variant="grid"
              t={coursesT}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            <span>{t('viewCourse') || 'عرض الكل'}</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}