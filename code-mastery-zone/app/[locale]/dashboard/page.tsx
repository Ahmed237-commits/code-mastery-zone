// app/dashboard/page.tsx

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
  ChevronRight, Calendar, BarChart, GraduationCap,
  Medal, Target, Zap, Sparkles, Code, Brain,
  Activity, Flame, GitBranch, Globe, ThumbsUp,
  MessageCircle, Share2, Heart
} from 'lucide-react';
import { getEnrolledCourses, getCourseProgress, getUserProgress } from '@/app/lib/userProgress';
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

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  totalLessons: number;
  averageProgress: number;
  totalStudyTime: number;
  longestStreak: number;
  currentStreak: number;
  certificatesEarned: number;
  totalPoints: number;
  badgesEarned: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const t = useTranslations('Dashboard');
  
  const [enrolledCourses, setEnrolledCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLessonsCompleted: 0,
    totalLessons: 0,
    averageProgress: 0,
    totalStudyTime: 0,
    longestStreak: 0,
    currentStreak: 0,
    certificatesEarned: 0,
    totalPoints: 0,
    badgesEarned: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);

  /* =======================
     جلب بيانات المستخدم
  ======================== */
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;

      try {
        // جلب الكورسات المسجل فيها
        const enrolled = await getEnrolledCourses();
        
        let totalCompletedLessons = 0;
        let totalLessonsAll = 0;
        let completedCoursesCount = 0;
        let inProgressCount = 0;
        let totalPercentage = 0;
        let totalStudyMinutes = 0;
        
        // حساب إحصائيات المستخدم
        const coursesWithProgress = await Promise.all(
          enrolled.map(async (item: EnrolledCourse, index: number) => {
            const course = await getCourseById(item.courseId);
            const progress = await getCourseProgress(item.courseId);
            
            if (progress) {
              totalCompletedLessons += progress.completedCount || 0;
              totalLessonsAll += progress.totalVideos || 0;
              totalPercentage += progress.percentage || 0;
              
              if (progress.percentage === 100) {
                completedCoursesCount++;
              } else {
                inProgressCount++;
              }
              
              // محاكاة وقت الدراسة (5 دقائق لكل درس مكتمل)
              totalStudyMinutes += (progress.completedCount || 0) * 5;
            }
            
            return {
              course,
              progress,
              enrolledAt: item.enrolledAt,
              enrolledIndex: index
            };
          })
        );

        // إنشاء قائمة الأنشطة الأخيرة
        const activities = coursesWithProgress
          .filter(item => item.progress && item.progress.completedCount > 0)
          .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
          .slice(0, 5)
          .map(item => ({
            title: item.course?.title || 'كورس',
            lesson: `${item.progress?.completedCount || 0} / ${item.progress?.totalVideos || 10} دروس`,
            percentage: item.progress?.percentage || 0,
            type: 'course_progress',
            date: item.enrolledAt,
            courseId: item.course?._id
          }));

        // إضافة نشاط افتراضي إذا كان فارغاً
        if (activities.length === 0) {
          activities.push({
            title: 'ابدأ رحلتك التعليمية',
            lesson: 'سجل في كورس وابدأ التعلم',
            percentage: 0,
            type: 'welcome',
            date: new Date().toISOString(),
            courseId: null
          });
        }

        setEnrolledCourses(coursesWithProgress);
        setRecentActivity(activities);
        
        // حساب متوسط التقدم
        const avgProgress = coursesWithProgress.length > 0 
          ? Math.round(totalPercentage / coursesWithProgress.length) 
          : 0;
        
        // حساب النقاط (10 نقاط لكل درس مكتمل، 50 نقطة لكل كورس مكتمل)
        const pointsFromLessons = totalCompletedLessons * 10;
        const pointsFromCourses = completedCoursesCount * 50;
        
        // حساب الشارات (حسب الإنجازات)
        let badgesCount = 0;
        if (completedCoursesCount >= 1) badgesCount++;
        if (completedCoursesCount >= 3) badgesCount++;
        if (totalCompletedLessons >= 10) badgesCount++;
        if (totalCompletedLessons >= 50) badgesCount++;
        if (coursesWithProgress.length >= 5) badgesCount++;
        
        setUserStats({
          totalCourses: coursesWithProgress.length,
          completedCourses: completedCoursesCount,
          inProgressCourses: inProgressCount,
          totalLessonsCompleted: totalCompletedLessons,
          totalLessons: totalLessonsAll,
          averageProgress: avgProgress,
          totalStudyTime: totalStudyMinutes,
          longestStreak: Math.min(coursesWithProgress.length + 2, 15), // محاكاة
          currentStreak: Math.min(coursesWithProgress.length + 1, 7), // محاكاة
          certificatesEarned: completedCoursesCount,
          totalPoints: pointsFromLessons + pointsFromCourses,
          badgesEarned: badgesCount
        });

        // جلب التقدم العام للمستخدم
        const progress = await getUserProgress();
        setUserProgress(progress);

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
          <p className="text-lg">جاري تحميل لوحة التحكم...</p>
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
            <h1 className="text-2xl font-bold mb-4">غير مسجل الدخول</h1>
            <p className="text-gray-400 mb-6">يرجى تسجيل الدخول للوصول إلى لوحة التحكم</p>
            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              تسجيل الدخول
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  /* =======================
     إحصائيات سريعة محسنة
  ======================== */
  const statsCards = [
    { 
      label: 'الكورسات المسجل فيها', 
      value: userStats.totalCourses.toString(), 
      icon: BookOpen, 
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      description: 'إجمالي الكورسات'
    },
    { 
      label: 'الكورسات المكتملة', 
      value: userStats.completedCourses.toString(), 
      icon: Trophy, 
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400',
      description: 'حصلت على شهادة'
    },
    { 
      label: 'الدروس المكتملة', 
      value: userStats.totalLessonsCompleted.toString(), 
      icon: CheckCircle, 
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      description: `${userStats.totalLessons} درس متاح`
    },
    { 
      label: 'متوسط التقدم', 
      value: `${userStats.averageProgress}%`, 
      icon: TrendingUp, 
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      description: 'من جميع الكورسات'
    },
  ];

  /* =======================
     بطاقات الإنجازات
  ======================== */
  const achievements = [
    {
      title: 'بداية الرحلة',
      description: 'أكمل أول درس',
      achieved: userStats.totalLessonsCompleted >= 1,
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      title: 'متعلم نشط',
      description: 'أكمل 10 دروس',
      achieved: userStats.totalLessonsCompleted >= 10,
      icon: Zap,
      color: 'text-blue-400'
    },
    {
      title: 'متحدي البرمجة',
      description: 'أكمل 50 درس',
      achieved: userStats.totalLessonsCompleted >= 50,
      icon: Code,
      color: 'text-green-400'
    },
    {
      title: 'خبير',
      description: 'أكمل 3 كورسات',
      achieved: userStats.completedCourses >= 3,
      icon: Brain,
      color: 'text-purple-400'
    },
    {
      title: 'متسلسل',
      description: 'سجل دخول 7 أيام متتالية',
      achieved: userStats.currentStreak >= 7,
      icon: Flame,
      color: 'text-orange-400'
    },
    {
      title: 'جامع شارات',
      description: 'احصل على 5 شارات',
      achieved: userStats.badgesEarned >= 5,
      icon: Medal,
      color: 'text-amber-400'
    }
  ];

  /* =======================
     Signed In – Dashboard كامل
  ======================== */
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-24 pb-12">
        <div className="container mx-auto px-6">

          {/* Welcome Section محسنة */}
          <div className="mb-10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
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
              
              {/* إحصائيات سريعة إضافية */}
              <div className="flex gap-4">
                <div className="text-center bg-gray-800/50 rounded-xl px-4 py-2">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.currentStreak}</div>
                  <div className="text-xs text-gray-400">أيام متتالية</div>
                </div>
                <div className="text-center bg-gray-800/50 rounded-xl px-4 py-2">
                  <div className="text-2xl font-bold text-green-400">{userStats.totalPoints}</div>
                  <div className="text-xs text-gray-400">نقطة</div>
                </div>
                <div className="text-center bg-gray-800/50 rounded-xl px-4 py-2">
                  <div className="text-2xl font-bold text-purple-400">{userStats.badgesEarned}</div>
                  <div className="text-xs text-gray-400">شارة</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards محسنة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
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
                  أكمل التعلم
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
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
                          <div className="relative w-full md:w-40 h-24 rounded-lg overflow-hidden">
                            <Image
                              src={item.course.image}
                              alt={item.course.title}
                              fill
                              className="object-cover"
                            />
                            {item.progress?.percentage === 100 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                              </div>
                            )}
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
                              {item.progress?.percentage === 100 ? 'مراجعة الكورس' : 'استمر في التعلم'}
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
                      <span>عرض كل الكورسات ({enrolledCourses.length})</span>
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
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-700 hover:border-blue-500 transition-all hover:bg-gray-700/50">
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
                              <div className="flex items-center gap-2 text-xs">
                                <span className={`${item.progress?.percentage === 100 ? 'text-green-400' : 'text-gray-400'}`}>
                                  {item.progress?.percentage || 0}% مكتمل
                                </span>
                                {item.progress?.percentage === 100 && (
                                  <Award className="w-3 h-3 text-yellow-400" />
                                )}
                              </div>
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

            {/* Sidebar محسن */}
            <div className="space-y-8">

              {/* Profile Card محسن */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 text-center">
                <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1 mb-4 group-hover:scale-105 transition-transform">
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
                    <div className="text-xl font-bold text-green-400">{userStats.totalLessonsCompleted}</div>
                    <div className="text-xs text-gray-400">دروس</div>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400">{userStats.certificatesEarned}</div>
                    <div className="text-xs text-gray-400">شهادات</div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-4 pt-2 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{Math.floor(userStats.totalStudyTime / 60)}</div>
                    <div className="text-xs text-gray-400">ساعات دراسة</div>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">{userStats.currentStreak}</div>
                    <div className="text-xs text-gray-400">أيام متتالية</div>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="block w-full py-2 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition"
                >
                  تعديل الملف الشخصي
                </Link>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  آخر الأنشطة
                </h3>

                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.type === 'welcome' ? (
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Play className="w-4 h-4 text-blue-400" />
                        )}
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
                            عرض الكورس →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* الإنجازات والشارات */}
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-yellow-400" />
                  الإنجازات
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, i) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl text-center transition-all ${
                          achievement.achieved
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                            : 'bg-gray-700/30 border border-gray-700 opacity-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-1 ${achievement.achieved ? achievement.color : 'text-gray-500'}`} />
                        <p className={`text-xs font-medium ${achievement.achieved ? 'text-white' : 'text-gray-500'}`}>
                          {achievement.title}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">{achievement.description}</p>
                      </div>
                    );
                  })}
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
                      <span className="text-white font-bold">{userStats.averageProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${userStats.averageProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">وقت الدراسة الإجمالي</span>
                      <span className="text-white font-bold">{Math.floor(userStats.totalStudyTime / 60)} ساعة</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">أطول سلسلة تعلم</span>
                      <span className="text-white font-bold">{userStats.longestStreak} يوم</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">النقاط</span>
                      <span className="text-white font-bold">{userStats.totalPoints}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-400">الشارات المحصلة</span>
                      <span className="text-white font-bold">{userStats.badgesEarned} / {achievements.length}</span>
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