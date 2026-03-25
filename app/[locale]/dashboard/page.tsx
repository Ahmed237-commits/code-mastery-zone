'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { 
  BookOpen, CheckCircle, Award, Star, Play,
  Trophy, Clock, TrendingUp, Users, Loader2,
  ChevronRight, Calendar, BarChart
} from 'lucide-react';
import { getEnrolledCourses, getCourseProgress } from '@/app/lib/userProgress';
import { getCourseById } from '@/app/lib/data';

interface EnrolledCourse {
  courseId: string;
  enrolledAt: string;
  completed: boolean;
}

interface CourseWithProgress {
  course: any;
  progress: {
    completedCount: number;
    totalVideos: number;
    percentage: number;
  };
  enrolledAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const t = useTranslations('Dashboard');
  
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesInProgress: 0,
    completedCourses: 0,
    certificatesEarned: 0,
    totalLessonsCompleted: 0
  });

  /* =======================
     جلب بيانات المستخدم
  ======================== */
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        // جلب الكورسات المسجل فيها
        const enrolled = await getEnrolledCourses();
        
        let totalCompleted = 0;
        let completedCoursesCount = 0;
        let inProgressCount = 0;

        const coursesWithProgress = await Promise.all(
          enrolled.map(async (item: EnrolledCourse) => {
            const course = await getCourseById(item.courseId);
            const progress = await getCourseProgress(item.courseId);
            
            if (progress) {
              totalCompleted += progress.completedCount || 0;
              if (progress.percentage === 100) {
                completedCoursesCount++;
              } else {
                inProgressCount++;
              }
            }
            
            return {
              course,
              progress,
              enrolledAt: item.enrolledAt
            };
          })
        );

        setEnrolledCourses(coursesWithProgress);
        setStats({
          coursesInProgress: inProgressCount,
          completedCourses: completedCoursesCount,
          certificatesEarned: completedCoursesCount,
          totalLessonsCompleted: totalCompleted
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  /* =======================
     Loading State
  ======================== */
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg">{t('loading') || 'جاري التحميل...'}</p>
        </div>
      </div>
    );
  }

  /* =======================
     Not Signed In
  ======================== */
  if (!session) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center pt-20">
          <div className="bg-gray-800 p-10 rounded-2xl border border-gray-700 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">{t('notSignedIn') || 'غير مسجل الدخول'}</h1>
            <p className="text-gray-400 mb-6">{t('notSignedInDesc') || 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم'}</p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {t('signIn') || 'تسجيل الدخول'}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* =======================
     إحصائيات سريعة
  ======================== */
  const statsCards = [
    { 
      label: t('stats.coursesInProgress') || 'كورسات قيد التقدم', 
      value: stats.coursesInProgress.toString(), 
      icon: BookOpen, 
      color: 'from-orange-400 to-pink-500',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400'
    },
    { 
      label: t('stats.completedCourses') || 'كورسات مكتملة', 
      value: stats.completedCourses.toString(), 
      icon: CheckCircle, 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    { 
      label: t('stats.certificatesEarned') || 'شهادات محصل عليها', 
      value: stats.certificatesEarned.toString(), 
      icon: Award, 
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    { 
      label: t('stats.pointsEarned') || 'دروس مكتملة', 
      value: stats.totalLessonsCompleted.toString(), 
      icon: Star, 
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400'
    },
  ];

  /* =======================
     آخر نشاط
  ======================== */
  const recentActivity = enrolledCourses
    .filter(item => item.progress && item.progress.completedCount > 0)
    .slice(0, 3)
    .map(item => ({
      title: item.course?.title || 'كورس',
      lesson: `${item.progress?.completedCount || 0} / ${item.progress?.totalVideos || 10} دروس`,
      percentage: item.progress?.percentage || 0,
      icon: 'fa-play',
      courseId: item.course?._id
    }));

  if (recentActivity.length === 0) {
    recentActivity.push({
      title: 'لم تبدأ بعد',
      lesson: 'ابدأ رحلتك التعليمية',
      percentage: 0,
      icon: 'fa-play',
      courseId: null
    });
  }

  /* =======================
     Signed In – Dashboard
  ======================== */
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-24 pb-12">
        <div className="container mx-auto px-6">

          {/* Welcome */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">
              {t('welcomeBack') || 'مرحباً بعودتك'}{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {session.user?.name || 'طالب'}
              </span>
            </h1>
            <p className="text-gray-400">
              {t('welcomeSubtitle') || 'إليك ما يحدث في رحلة تعلمك اليوم'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center text-xl mb-4`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content - الكورسات */}
            <div className="lg:col-span-2 space-y-8">

              {/* Continue Learning */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-blue-400" />
                  {t('continueLearning') || 'أكمل التعلم'}
                </h2>

                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">لم تسجل في أي كورس بعد</p>
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      استعرض الكورسات
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 2).map((item, index) => (
                      item.course && (
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                          <div className="relative w-full md:w-40 h-24 rounded-lg overflow-hidden">
                            <Image
                              src={item.course.image}
                              alt={item.course.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <Link href={`/courses/${item.course._id}`}>
                              <h3 className="font-bold text-lg mb-2 hover:text-blue-400 transition-colors">
                                {item.course.title}
                              </h3>
                            </Link>

                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                              <span>{item.progress?.percentage || 0}% مكتمل</span>
                              <span>{item.progress?.completedCount || 0} / {item.progress?.totalVideos || 10} دروس</span>
                            </div>

                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${item.progress?.percentage || 0}%` }}
                              />
                            </div>

                            <Link
                              href={`/courses/${item.course._id}/video/lesson-${(item.progress?.completedCount || 0) + 1}`}
                              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              {t('resumeCourse') || 'استمر في التعلم'}
                            </Link>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {enrolledCourses.length > 2 && (
                  <div className="mt-4 text-center">
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>عرض كل الكورسات</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* جميع الكورسات */}
              {enrolledCourses.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    جميع كورساتي
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    {enrolledCourses.map((item, index) => (
                      item.course && (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={item.course.image}
                                alt={item.course.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <Link href={`/courses/${item.course._id}`}>
                                <h4 className="font-semibold hover:text-blue-400 transition-colors">
                                  {item.course.title}
                                </h4>
                              </Link>
                              <p className="text-xs text-gray-400">
                                {item.progress?.percentage || 0}% مكتمل
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              {item.progress?.completedCount || 0}/{item.progress?.totalVideos || 10}
                            </span>
                            <Link
                              href={`/courses/${item.course._id}/video/lesson-${(item.progress?.completedCount || 0) + 1}`}
                              className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              <Play className="w-4 h-4 text-blue-400" />
                            </Link>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">

              {/* Profile Card */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name || 'User'}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                        {session.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-lg mb-1">{session.user?.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{session.user?.email}</p>

                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">{enrolledCourses.length}</div>
                    <div className="text-xs text-gray-400">كورسات</div>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">{stats.totalLessonsCompleted}</div>
                    <div className="text-xs text-gray-400">دروس</div>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400">{stats.completedCourses}</div>
                    <div className="text-xs text-gray-400">شهادات</div>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="block w-full py-2 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition"
                >
                  {t('editProfile') || 'تعديل الملف الشخصي'}
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  {t('recentActivity') || 'آخر الأنشطة'}
                </h3>

                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${item.icon} text-blue-400`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">{item.lesson}</p>
                        {item.courseId && (
                          <Link
                            href={`/courses/${item.courseId}`}
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
                          >
                            عرض الكورس
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Overview */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-purple-400" />
                  نظرة عامة
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">إجمالي التقدم</span>
                      <span className="text-white font-bold">
                        {enrolledCourses.length > 0
                          ? Math.round(
                              enrolledCourses.reduce((acc, curr) => acc + (curr.progress?.percentage || 0), 0) /
                                enrolledCourses.length
                            )
                          : 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{
                          width: `${
                            enrolledCourses.length > 0
                              ? Math.round(
                                  enrolledCourses.reduce((acc, curr) => acc + (curr.progress?.percentage || 0), 0) /
                                    enrolledCourses.length
                                )
                              : 0
                          }%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">الكورسات المكتملة</span>
                      <span className="text-white font-bold">{stats.completedCourses}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">الكورسات قيد التقدم</span>
                      <span className="text-white font-bold">{stats.coursesInProgress}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">إجمالي الدروس</span>
                      <span className="text-white font-bold">{stats.totalLessonsCompleted}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}