'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { getCourseById } from '@/app/lib/data';
import { 
  Star, Users, Clock, BookOpen, Award, Gift, 
  CheckCircle, ChevronLeft, Download, PlayCircle, 
  FileText, MessageCircle, Share2, Heart, Bookmark, 
  ChevronDown, ChevronUp, Loader2, Globe, Code, 
  Zap, Target, Info, AlertCircle, Video, Home, 
  Sparkles, GraduationCap
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ChatBot from '@/app/components/chatbot';
import sweetAlert from 'sweetalert2';
import { Locale } from "@/app/lib/data";

export default function CourseDetailsContent() {
  const t = useTranslations('Courses');
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { data: session } = useSession();
  const locale = useLocale() as Locale;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<number[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'instructor'>('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
        
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        setIsEnrolled(enrolledCourses.includes(courseId));
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const toggleLesson = (index: number) => {
    setExpandedLessons(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
const token = session?.accessToken;
console.log("TOKEN =", token);
console.log("SESSION =", session);
  const handleEnroll = async () => {
    if (!session?.user) {
      toast.error(locale === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first');
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    try {
      const token = session?.accessToken;
      console.log(session);
      if (!token) {
        toast.error(locale === 'ar' ? 'جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى' : 'Invalid session, please sign in again');
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
  setCourse((prev: any) => ({
    ...prev,
    studentsCount: data.studentsCount,
  }));

  const enrolledCourses = JSON.parse(
    localStorage.getItem("enrolled_courses") || "[]"
  );

  if (!enrolledCourses.includes(courseId)) {
    enrolledCourses.push(courseId);
    localStorage.setItem(
      "enrolled_courses",
      JSON.stringify(enrolledCourses)
    );
  }

  setIsEnrolled(true);

  toast.success(
    locale === "ar"
      ? "تم التسجيل في الكورس بنجاح!"
      : "Enrolled in course successfully!"
  );

  router.push(`/courses/${courseId}/video/lesson-1`);
      } else {
        toast.error(data.error || (locale === 'ar' ? 'حدث خطأ في التسجيل' : 'Enrollment error'));
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(locale === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    }
  };

  const handleStartLearning = () => {
    if (!session?.user) {
      sweetAlert.fire({
        title: locale === 'ar' ? 'تسجيل الدخول مطلوب' : 'Sign In Required',
        text: locale === 'ar' ? 'يجب تسجيل الدخول لبدء التعلم. هل ترغب في تسجيل الدخول الآن؟' : 'You must sign in to start learning. Would you like to sign in now?',
        showCancelButton: true,
        confirmButtonText: locale === 'ar' ? 'نعم' : 'Yes',
        cancelButtonText: locale === 'ar' ? 'لا' : 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/auth/signin');
        }
      });
      return;
    }
    router.push(`/courses/${courseId}/video/lesson-1`);
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
    return num.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
  };

  const getLocalizedValue = (field: any) => {
    if (!field) return '';
    return typeof field === 'object' ? (field[locale] || field['ar'] || field['en'] || '') : field;
  };

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
            <Link 
              href="/courses" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('backToCourses')}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ChatBot />
      <main className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Link href="/" className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors group">
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t('home')}</span>
              </Link>
              
              <ChevronLeft className={`w-4 h-4 text-gray-600 ${locale === 'en' ? 'rotate-180' : ''}`} />
              
              <Link href="/courses" className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors group">
                <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t('title')}</span>
              </Link>
              
              <ChevronLeft className={`w-4 h-4 text-gray-600 ${locale === 'en' ? 'rotate-180' : ''}`} />
              
              <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full max-w-md truncate">
                {getLocalizedValue(course.title)}
              </span>

              {course.isFree && (
                <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                  <Gift className="w-3 h-3" />
                  {t('details.free')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0">
            {course.image && (
              <Image
                src={course.image}
                alt={getLocalizedValue(course.title)}
                fill
                className="object-cover opacity-20"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900" />
          </div>

          <div className="relative container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getTagColor(course.tag)}`}>
                    {t(`categories.${course.tag}`) || course.tag}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {getLocalizedValue(course.title)}
                </h1>

                <p className="text-xl text-gray-300 mb-6">
                  {getLocalizedValue(course.description)}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold">{course.rating || 4.9}</span>
                    <span className="text-gray-400">({formatNumber(course.reviewsCount || 1)} {t('reviews')})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>{formatNumber(course.studentsCount || 0)} {t('students')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{getLocalizedValue(course.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span>{formatNumber(course.lessons?.length || 0)} {t('lessons')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src={course.instructorAvatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={getLocalizedValue(course.instructorName) || 'Instructor'}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm text-gray-400">{t('instructor')}</p>
                    <p className="font-semibold">{getLocalizedValue(course.instructorName) || (locale === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmed Mohammed')}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={isEnrolled ? handleStartLearning : handleEnroll}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      isEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <PlayCircle className="w-5 h-5" />
                    {isEnrolled ? (t('startLearning') || 'ابدأ التعلم') : (t('enrollNow') || 'سجل الآن')}
                  </button>
                  
                  <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-lg transition-colors ${isLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button onClick={() => setIsSaved(!isSaved)} className={`p-3 rounded-lg transition-colors ${isSaved ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Sidebar Info Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
                  <div className="text-center mb-6">
                    {course.isFree || getLocalizedValue(course.price) === 'مجاني' || getLocalizedValue(course.price) === 'Free' ? (
                      <>
                        <span className="text-4xl font-bold text-green-400">{t('details.free')}</span>
                        <p className="text-gray-400 mt-2">{locale === 'ar' ? 'متاح دائماً مجاناً' : 'Free Forever'}</p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold">{getLocalizedValue(course.price)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span>{locale === 'ar' ? 'اللغة: العربية' : 'Language: Arabic'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Target className="w-5 h-5 text-gray-400" />
                      <span>{locale === 'ar' ? 'الفئة العمرية:' : 'Age Group:'} {course.ageGroup || '13+'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Code className="w-5 h-5 text-gray-400" />
                      <span>{t('level') || (locale === 'ar' ? 'المستوى: مبتدئ' : 'Level: Beginner')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span>{t('certificate') || (locale === 'ar' ? 'شهادة إتمام معتمدة' : 'Certified Certificate')}</span>
                    </div>
                  </div>

                  <button
                    onClick={isEnrolled ? handleStartLearning : handleEnroll}
                    className={`w-full font-semibold py-3 rounded-lg transition-colors ${
                      isEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isEnrolled ? (t('startLearning') || 'ابدأ التعلم') : (t('enrollNow') || 'سجل الآن')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Control */}
        <div className="border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {(['overview', 'syllabus', 'instructor'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {t(tab) || tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-yellow-400" />
                    {locale === 'ar' ? 'ماذا ستتعلم في هذه الدورة؟' : "What you'll learn"}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(locale === 'ar' ? [
                      "مفهوم البرمجة وأهميتها", "التفكير البرمجي وحل المشكلات", 
                      "المتغيرات وأنواع البيانات", "العمليات الحسابية الأساسية", 
                      "الجمل الشرطية والتحكم سير البرنامج", "الحلقات التكرارية لتفادي التكرار", 
                      "تنظيم الكود باستخدام الدوال"
                    ] : [
                      "Programming concepts and logic", "Algorithmic thinking and problem solving",
                      "Variables and data types", "Basic arithmetic operations",
                      "Conditional statements (if-else)", "Control flow and Loops",
                      "Code structure using Functions"
                    ]).map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">
                {locale === 'ar' ? 'المنهج الدراسي للدورة' : 'Course Curriculum'}
              </h2>
              <div className="space-y-4">
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson: any, index: number) => (
                    <div key={index} className="bg-gray-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleLesson(index)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                            {formatNumber(index + 1)}
                          </span>
                          <span className="font-semibold">
                            {getLocalizedValue(lesson.title)}
                          </span>
                        </div>
                        {expandedLessons.includes(index) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      
                      {expandedLessons.includes(index) && (
                        <div className="px-6 pb-4">
                          <div className="border-t border-gray-700 pt-4">
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {getLocalizedValue(lesson.content)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-6">
                    {locale === 'ar' ? 'لا توجد دروس مضافة حالياً.' : 'No lessons available yet.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <Image
                    src={course.instructorAvatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={getLocalizedValue(course.instructorName) || 'Instructor'}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {getLocalizedValue(course.instructorName) || (locale === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmed Mohammed')}
                    </h2>
                    <p className="text-gray-400 mb-4">
                      {locale === 'ar' ? 'كبير مدربي المنصة' : 'Lead Instructor'}
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      {locale === 'ar' ? (
                        'خبير في تعليم البرمجة للمبتدئين وتبسيط المفاهيم المعقدة مع التركيز على التطبيقات العملية وبناء المشاريع الحقيقية لتمكين الطلاب.'
                      ) : (
                        'Expert in programming education for beginners, simplifying complex concepts with a focus on practical applications and project building.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}