// app/courses/components/CourseCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Clock, BookOpen, Award, Gift, ChevronLeft } from 'lucide-react';
import { Course } from '@/app/lib/data';

interface CourseCardProps {
  course: Course;
  variant?: 'grid' | 'list';
  t: any;
}

export default function CourseCard({ course, variant = 'grid', t }: CourseCardProps) {
  const getTagColor = (tag?: string) => {
    const colors: Record<string, string> = {
      Programming: 'bg-blue-500/20 text-blue-300',
      Scratch: 'bg-green-500/20 text-green-300',
      Python: 'bg-yellow-500/20 text-yellow-300',
      Web: 'bg-purple-500/20 text-purple-300',
      Robotics: 'bg-orange-500/20 text-orange-300',
      AI: 'bg-red-500/20 text-red-300',
    };
    return colors[tag || ''] || 'bg-gray-500/20 text-gray-300';
  };

  const studentsCount = course.studentsCount || 0;
  const rating = course.rating || 0;
  const instructor = course.instructor || 'مدرب أكاديمية';
  const instructorAvatar = course.instructorAvatar || 'https://i.pravatar.cc/150?img=1';
  const whatYouWillLearn = course.whatYouWillLearn || [];

  const formatPrice = () => {
    if (course.isFree) return t('details.free');
    if (typeof course.price === 'number') {
      return course.price === 0 ? t('details.free') : `${course.price} ${t('details.price')}`;
    }
    return course.price || t('details.free');
  };

  if (variant === 'list') {
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 flex flex-col md:flex-row group">
        <Link href={`/courses/${course._id}`} className="md:w-64 h-48 md:h-auto relative block overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {course.isNew && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold z-10">
              {t('badges.new')}
            </div>
          )}
          {course.isFree && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 z-10">
              <Gift className="w-4 h-4" />
              {t('details.free')}
            </div>
          )}
        </Link>
        
        <div className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTagColor(course.tag)}`}>
              {t(`categories.${course.tag}`) || course.tag}
            </span>
            <span className="text-yellow-400 flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              {rating.toFixed(1)}
            </span>
          </div>
          
          <Link href={`/courses/${course._id}`}>
            <h3 className="text-xl font-bold mb-2 hover:text-blue-400 transition-colors">
              {course.title}
            </h3>
          </Link>
          
          <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{studentsCount.toLocaleString()} {t('students')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration} {t('hours')}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{t(`levels.${course.level}`) || course.level}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white">
                {formatPrice()}
              </span>
              {course.originalPrice && !course.isFree && (
                <span className="text-gray-500 line-through mr-2">{course.originalPrice} {t('details.price')}</span>
              )}
              {course.discount && !course.isFree && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs mr-2">
                  {t('badges.popular')} {course.discount}%
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src={instructorAvatar}
                  alt={instructor}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="text-sm text-gray-300">{instructor}</span>
              </div>
            </div>
          </div>
          
          {whatYouWillLearn.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-2">
                {whatYouWillLearn.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">✓</span>
                    <span className="truncate">{item.replace('✅', '').replace('✓', '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Link 
              href={`/courses/${course._id}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm group"
            >
              <span>{t('details.moreInfo') || 'عرض التفاصيل'}</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group">
      <Link href={`/courses/${course._id}`} className="block relative h-48 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {course.isNew && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold z-10">
            {t('badges.new')}
          </div>
        )}
        {course.isFree && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 z-10">
            <Gift className="w-4 h-4" />
            {t('details.free')}
          </div>
        )}
        <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-medium ${getTagColor(course.tag)}`}>
          {t(`categories.${course.tag}`) || course.tag}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/courses/${course._id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-blue-400 transition-colors line-clamp-2">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{studentsCount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div>
            <span className="font-bold text-white">
              {formatPrice()}
            </span>
            {course.originalPrice && !course.isFree && (
              <span className="text-gray-500 line-through text-sm mr-2">{course.originalPrice} {t('details.price')}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Image
              src={instructorAvatar}
              alt={instructor}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-xs text-gray-400">{instructor}</span>
          </div>
        </div>
        
        {course.isFree && (
          <div className="mt-2 text-center">
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
              ✨ {t('details.free')} - {t('details.enroll')}
            </span>
          </div>
        )}

        <div className="mt-3">
          <Link 
            href={`/courses/${course._id}`}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-medium hover:shadow-lg hover:shadow-blue-600/25"
          >
            {t('details.moreInfo') || 'عرض التفاصيل'}
          </Link>
        </div>
      </div>
    </div>
  );
}