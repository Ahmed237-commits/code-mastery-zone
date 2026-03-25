// app/courses/[id]/CourseDetailsContent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { getCourseById } from '@/app/lib/data';
import { getCourseProgress } from '@/app/lib/userProgress';
import { getCourseFeedbacks, type CourseRating } from '@/app/lib/feedback';
import { 
  Star, Users, Clock, BookOpen, Award, Gift, 
  CheckCircle, ChevronLeft, Download,
  PlayCircle, FileText, MessageCircle, Share2,
  Heart, Bookmark, ChevronDown, ChevronUp, Loader2,
  Globe, Code, Zap, Target, Info, AlertCircle, Video,
  Home, Sparkles, GraduationCap, TrendingUp, Calendar,
  ShieldCheck, Clock3, LoaderCircle, ThumbsUp, ThumbsDown
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ChatBot from '@/app/components/chatbot';

export default function CourseDetailsContent() {
  const t = useTranslations('Courses');
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { data: session } = useSession();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'instructor'>('overview');
  const [enrolling, setEnrolling] = useState(false);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [courseRating, setCourseRating] = useState<CourseRating>({ averageRating: 0, totalRatings: 0, ratings: [] });
  const [userHasRated, setUserHasRated] = useState(false);
  const [userRating, setUserRating] = useState(0);

  // جلب بيانات الكورس
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
        
        // التحقق مما إذا كان المستخدم مسجل في الكورس (من localStorage)
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        const isUserEnrolled = enrolledCourses.includes(courseId);
        setIsEnrolled(isUserEnrolled);
        
        // إذا كان المستخدم مسجل، جلب تقدمه
        if (session?.user && isUserEnrolled) {
          try {
            const progress = await getCourseProgress(courseId);
            setCourseProgress(progress);
          } catch (err) {
            console.error('Error fetching progress:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, session]);

  // جلب التقييمات
    useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const ratingData = await getCourseFeedbacks(courseId);
        setCourseRating(ratingData);
        
        // التحقق مما إذا كان المستخدم قد قيم بالفعل
        if (session?.user) {
          const userRatingExists = ratingData.ratings.some(
            (r) => r.userId === session.user?.id
          );
          setUserHasRated(userRatingExists);
          
          const userRatingData = ratingData.ratings.find(
            (r) => r.userId === session.user?.id
          );
          if (userRatingData) {
            setUserRating(userRatingData.rating);
          }
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, [courseId, session]);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev =>
      prev.includes(week)
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const handleEnroll = async () => {
    if (!session?.user) {
      toast.error('يجب تسجيل الدخول أولاً');
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    setEnrolling(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى');
        router.push('/auth/signin');
        return;
      }

      const res = await fetch('http://localhost:8000/api/enroll/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });

      const data = await res.json();

      if (res.ok) {
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        if (!enrolledCourses.includes(courseId)) {
          enrolledCourses.push(courseId);
          localStorage.setItem('enrolled_courses', JSON.stringify(enrolledCourses));
        }
        setIsEnrolled(true);
        
        toast.success('تم التسجيل في الكورس بنجاح!');
        
        try {
          const progress = await getCourseProgress(courseId);
          setCourseProgress(progress);
        } catch (err) {
          console.error('Error fetching progress after enrollment:', err);
        }
        
        router.push(`/courses/${courseId}/video/lesson-1`);
      } else {
        toast.error(data.error || 'حدث خطأ في التسجيل في الكورس');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('حدث خطأ في الاتصال بالخادم');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (!session?.user) {
      toast.error('يجب تسجيل الدخول أولاً');
      router.push('/signIn');
      return;
    }
    
    const nextLesson = courseProgress?.completedCount 
      ? Math.min(courseProgress.completedCount + 1, (course?.lessons?.length || 10))
      : 1;
    
    router.push(`/courses/${courseId}/video/lesson-${nextLesson}`);
  };

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

  const formatNumber = (num: number) => {
    return num.toLocaleString('ar-EG');
  };

  function formatDuration(duration: string | number): React.ReactNode {
    if (!duration) return null;
    const totalMinutes = typeof duration === 'string' ? parseInt(duration, 10) : duration;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return (
      <>
        {hours > 0 && <span>{hours} {t("hours")}</span>}
        {minutes > 0 && <span>{minutes} {t("minutes")}</span>}
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-xl">{t('loading')}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">{t('courseNotFound')}</h1>
            <p className="text-gray-400 mb-6">{t('courseNotFoundDesc')}</p>
            <Link href="/courses" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
              {t('backToCourses')}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const totalLessons = course.lessons?.length || 10;
  const progressPercentage = courseProgress?.percentage || 0;
  const completedLessons = courseProgress?.completedCount || 0;

  return (
    <>
      <Header />
      <ChatBot />
      <main className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Link href="/" className="flex items-center gap-1 text-gray-400 hover:text-blue-400 group">
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t('home')}</span>
              </Link>
              <ChevronLeft className="w-4 h-4 text-gray-600" />
              <Link href="/courses" className="flex items-center gap-1 text-gray-400 hover:text-blue-400 group">
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t('title')}</span>
              </Link>
              <ChevronLeft className="w-4 h-4 text-gray-600" />
              <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full max-w-md truncate">
                {course.title}
              </span>
              {course.isFree && (
                <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                  <Gift className="w-3 h-3" />
                  {t('details.free')}
                </span>
              )}
              {course.isNew && (
                <span className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  {t('badges.new')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0">
            <Image src={course.image} alt={course.title} fill className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900" />
          </div>

          <div className="relative container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getTagColor(course.tag)}`}>
                    {t(`categories.${course.tag}`) || course.tag}
                  </span>
                  {course.isNew && (
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm font-medium">
                      {t('badges.new')}
                    </span>
                  )}
                  {course.popular && (
                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg text-sm font-medium">
                      {t('badges.popular')}
                    </span>
                  )}
                  {course.isFree && (
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      {t('details.free')}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-gray-300 mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold">{courseRating.averageRating || course.rating || 4.9}</span>
                    </div>
                    <span className="text-gray-400">({courseRating.totalRatings || course.studentsCount || 0} {t('reviews')})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>{formatNumber(course.studentsCount || 0)} {t('students')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{formatDuration(course.duration || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span>{totalLessons} {t('lessons')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src={course.instructorAvatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={course.instructor || 'د. أحمد محمد'}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-400">{t('instructor')}</p>
                    <p className="font-semibold">{course.instructor || 'د. أحمد محمد'}</p>
                  </div>
                </div>
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-1">
      <Star className="w-5 h-5 text-yellow-400 fill-current" />
      <span className="font-bold">{courseRating.averageRating || course.rating || 4.9}</span>
    </div>
    <span className="text-gray-400">({courseRating.totalRatings || course.studentsCount || 0} {t('reviews')})</span>
  </div>
                {/* زر التسجيل */}
                <div className="flex flex-wrap items-center gap-4">
                  {isEnrolled ? (
                    <button onClick={handleStartLearning} className="group relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg shadow-green-600/30 transform hover:scale-105">
                      <PlayCircle className="w-5 h-5 group-hover:animate-pulse" />
                      {progressPercentage === 100 ? '🎓 مراجعة الكورس' : `📚 أكمل التعلم (${completedLessons}/${totalLessons})`}
                    </button>
                  ) : (
                    <button onClick={handleEnroll} disabled={enrolling} className="group relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-600/30 transform hover:scale-105 disabled:opacity-70">
                      {enrolling ? (
                        <>
                          <LoaderCircle className="w-5 h-5 animate-spin" />
                          جاري التسجيل...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-5 h-5 group-hover:animate-pulse" />
                          {t('enrollNow') || 'سجل الآن'}
                        </>
                      )}
                    </button>
                  )}
                  
                  <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-lg transition-all duration-300 ${isLiked ? 'bg-red-600 shadow-lg shadow-red-600/30' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => setIsSaved(!isSaved)} className={`p-3 rounded-lg transition-all duration-300 ${isSaved ? 'bg-yellow-600 shadow-lg shadow-yellow-600/30' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:shadow-lg">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <Link href={`/courses/${courseId}/feedback`} className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:shadow-lg" title="إرسال تقييم">
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>

                {isEnrolled && courseProgress && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">تقدمك في الكورس</span>
                      </div>
                      <span className="text-sm font-bold text-blue-400">{progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span>✅ {completedLessons} درس مكتمل</span>
                      <span>📚 {totalLessons - completedLessons} درس متبقي</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6 sticky top-24 border border-gray-700 shadow-xl">
                  <div className="text-center mb-6">
                    {course.isFree ? (
                      <>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
                          <Gift className="w-8 h-8 text-green-400" />
                        </div>
                        <span className="text-4xl font-bold text-green-400">{t('details.free')}</span>
                        <p className="text-gray-400 mt-2">{t('freeForever')}</p>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">{course.price}</div>
                        <span className="text-gray-400">{t('currency')}</span>
                        {course.originalPrice && (
                          <div className="mt-1">
                            <span className="text-gray-500 line-through">{course.originalPrice} {t('currency')}</span>
                            {course.discount && (
                              <span className="bg-red-500 text-white px-2 py-0.5 rounded-lg text-xs ml-2">-{course.discount}%</span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-gray-700/30">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <span>{t('language')}: {t("Arabic")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-gray-700/30">
                      <Target className="w-5 h-5 text-purple-400" />
                      <span>{t('level')}: {t(`levels.${course.level}`) || course.level || 'مبتدئ'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-gray-700/30">
                      <Clock3 className="w-5 h-5 text-yellow-400" />
                      <span>{totalLessons} {t("lessons")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-gray-700/30">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      <span>{t('honouring')}</span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <button onClick={handleStartLearning} className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                      <PlayCircle className="w-5 h-5" />
                      {progressPercentage === 100 ? '🎓 مراجعة الكورس' : `📚 أكمل التعلم (${completedLessons}/${totalLessons})`}
                    </button>
                  ) : (
                    <button onClick={handleEnroll} disabled={enrolling} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70">
                      {enrolling ? (
                        <>
                          <LoaderCircle className="w-5 h-5 animate-spin" />
                          جاري التسجيل...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-5 h-5" />
                          {t('enrollNow') || 'سجل الآن'}
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    30 يوم ضمان استرداد الأموال
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              <button onClick={() => setActiveTab('overview')} className={`py-4 border-b-2 font-medium ${activeTab === 'overview' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                {t('overview')}
              </button>
              <button onClick={() => setActiveTab('syllabus')} className={`py-4 border-b-2 font-medium ${activeTab === 'syllabus' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                {t('syllabus')}
              </button>
              <button onClick={() => setActiveTab('instructor')} className={`py-4 border-b-2 font-medium ${activeTab === 'instructor' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                {t('instructor')}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* What You'll Learn */}
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-yellow-400" />
                    {t('What you\'ll learn')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.lessons?.map((lesson: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Info className="w-6 h-6 text-blue-400" />
                    {t('requirements')}
                  </h2>
                  <div className="space-y-3">
                    {[
                      t('requirements1'),
                      t('requirements2'),
                      t('requirements3')
                    ].map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ تقييمات الطلاب - تم إضافتها هنا */} {courseRating.ratings.length > 0 && (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-blue-400" />
        آراء الطلاب ({courseRating.totalRatings})
      </h2>
      <div className="space-y-4">
        {courseRating.ratings.slice(0, 5).map((feedback) => (
          <div key={feedback._id} className="border-b border-gray-700 pb-4 last:border-0">
            <div className="flex items-center gap-3 mb-2">
              {!feedback.isAnonymous && feedback.userAvatar ? (
                <Image
                  src={feedback.userAvatar}
                  alt={feedback.userName || 'مستخدم'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-semibold">
                  {feedback.isAnonymous ? 'مستخدم مجهول' : feedback.userName || 'مستخدم'}
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= feedback.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 mr-2">
                    {new Date(feedback.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-300">{feedback.comment}</p>
            {feedback.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {feedback.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {courseRating.ratings.length > 5 && (
        <div className="text-center mt-4">
          <Link
            href={`/courses/${courseId}/reviews`}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            عرض جميع التقييمات ({courseRating.totalRatings})
          </Link>
        </div>
      )}
    </div>
  )}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">{t('thisCourseIncludes')}</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Video className="w-5 h-5 text-gray-400" />
                      <span>{totalLessons} {t('videoLessons')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span>{t('articles')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Download className="w-5 h-5 text-gray-400" />
                      <span>{t('downloadableResources')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                      <span>{t('communityAccess')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="w-5 h-5 text-gray-400" />
                      <span>{t('certificate')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">المنهج الدراسي للدورة</h2>
              <div className="space-y-4">
                {course.lessons?.map((lesson: any, index: number) => (
                  <div key={index} className="bg-gray-800 rounded-xl overflow-hidden">
                    <button onClick={() => toggleWeek(index + 1)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">{index + 1}</span>
                        <span className="font-semibold">{lesson.title}</span>
                      </div>
                      {expandedWeeks.includes(index + 1) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {expandedWeeks.includes(index + 1) && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-700 pt-4">
                          <p className="text-gray-300">{lesson.content || 'محتوى الدرس سيتم إضافته قريباً'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <Image
                    src={course.instructorAvatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={course.instructor || 'د. أحمد محمد'}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{course.instructor || 'د. أحمد محمد'}</h2>
                    <p className="text-gray-400 mb-4">{t('leadInstructor')}</p>
                    <p className="text-gray-300 leading-relaxed">
                      خبير في تعليم البرمجة للمبتدئين بخبرة تزيد عن 10 سنوات. حاصل على دكتوراه في علوم الحاسب ومؤلف لعدة كتب في مجال البرمجة. 
                      يقدم محتوى تعليمي مبسط ومناسب للمبتدئين مع تطبيقات عملية.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Courses */}
        <div className="bg-gray-900/50 py-12 mt-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">{t('relatedCourses')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400">{t('comingSoon')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}