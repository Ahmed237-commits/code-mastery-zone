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
import { 
  Star, Users, Clock, BookOpen, Award, Gift, 
  CheckCircle, ChevronLeft, Download,
  PlayCircle, FileText, MessageCircle, Share2,
  Heart, Bookmark, ChevronDown, ChevronUp, Loader2,
  Globe, Code, Zap, Target, Info, AlertCircle, Video,
  Home, Sparkles, GraduationCap
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ChatBot from '@/app/components/chatbot';
import sweetAlert from 'sweetalert2';
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

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
        
        // التحقق مما إذا كان المستخدم مسجل في الكورس (من localStorage)
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

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev =>
      prev.includes(week)
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const handleEnroll = async () => {
    // التحقق من تسجيل الدخول أولاً
    if (!session?.user) {
      toast.error('يجب تسجيل الدخول أولاً');
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    try {
      // جلب التوكن من localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى');
        router.push('/auth/signin');
        return;
      }

      // استدعاء API التسجيل في الكورس
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
        // تسجيل المستخدم في الكورس (محلياً)
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
        if (!enrolledCourses.includes(courseId)) {
          enrolledCourses.push(courseId);
          localStorage.setItem('enrolled_courses', JSON.stringify(enrolledCourses));
        }
        setIsEnrolled(true);
        
        toast.success('تم التسجيل في الكورس بنجاح!');
        
        // التوجيه إلى أول درس في الكورس
        router.push(`/courses/${courseId}/video/lesson-1`);
      } else {
        console.error('Failed to enroll:', data.error);
        toast.error(data.error || 'حدث خطأ في التسجيل في الكورس');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('حدث خطأ في الاتصال بالخادم');
    }
  };

  const handleStartLearning = () => {
    // التحقق من تسجيل الدخول
    if (!session?.user) {
      toast.error('يجب تسجيل الدخول أولاً');
     sweetAlert.fire({
        title: 'تسجيل الدخول مطلوب',
        text: 'يجب تسجيل الدخول لبدء التعلم. هل ترغب في تسجيل الدخول الآن؟',
        showCancelButton: true,
        confirmButtonText: 'نعم',
        cancelButtonText: 'لا'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/signIn');
        }
      });
      return;
    }
    
    // التوجيه إلى أول درس في الكورس
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
    return num.toLocaleString('ar-EG');
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
      <main className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Link 
                href="/" 
                className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors group"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{t('home')}</span>
              </Link>
              
              <ChevronLeft className="w-4 h-4 text-gray-600" />
              
              <Link 
                href="/courses" 
                className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors group"
              >
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
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover opacity-20"
            />
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

                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {course.title}
                </h1>

                <p className="text-xl text-gray-300 mb-6">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold">{course.rating || 4.9}</span>
                    </div>
                    <span className="text-gray-400">({formatNumber(course.studentsCount || 15420)} {t('reviews')})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>{formatNumber(course.studentsCount || 15420)} {t('students')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>غير محدد</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span>10 {t('lessons')}</span>
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

                <div className="flex flex-wrap items-center gap-4">
                  {isEnrolled ? (
                    <button
                      onClick={handleStartLearning}
                      className="px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {t('startLearning') || 'ابدأ التعلم'}
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {t('enrollNow') || 'سجل الآن'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-lg transition-colors ${
                      isLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-3 rounded-lg transition-colors ${
                      isSaved ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
                  <div className="text-center mb-6">
                    {course.isFree ? (
                      <>
                        <span className="text-4xl font-bold text-green-400">{t('details.free')}</span>
                        <p className="text-gray-400 mt-2">{t('freeForever')}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-4xl font-bold">{course.price}</span>
                          <span className="text-gray-400">{t('currency')}</span>
                        </div>
                        {course.originalPrice && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-gray-500 line-through">{course.originalPrice} {t('currency')}</span>
                            {course.discount && (
                              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm">
                                {t('save')} {course.discount}%
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span>{t('language')}: العربية</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Target className="w-5 h-5 text-gray-400" />
                      <span>{t('level')}: {t(`levels.${course.level}`) || course.level || 'مبتدئ'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Code className="w-5 h-5 text-gray-400" />
                      <span>{t('projects')}: 8 {t('projects')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <span>{t('certificate')}</span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={handleStartLearning}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      {t('startLearning') || 'ابدأ التعلم'}
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      {t('enrollNow') || 'سجل الآن'}
                    </button>
                  )}

                  <p className="text-xs text-gray-500 text-center mt-4">
                    {t('moneyBack')}
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
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {t('overview')}
              </button>
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'syllabus'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {t('syllabus')}
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'instructor'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
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
                    ماذا ستتعلم في هذه الدورة؟
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "مفهوم البرمجة وأهميتها",
                      "التفكير البرمجي وحل المشكلات",
                      "المتغيرات وأنواع البيانات",
                      "العمليات الحسابية",
                      "الجمل الشرطية (if-else)",
                      "الحلقات التكرارية (loops)",
                      "الدوال (functions)",
                      "المصفوفات (arrays)",
                      "الكائنات (objects)",
                      "بناء مشروع آلة حاسبة"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Info className="w-6 h-6 text-blue-400" />
                    المتطلبات
                  </h2>
                  <div className="space-y-3">
                    {[
                      "جهاز كمبيوتر متصل بالإنترنت",
                      "لا تحتاج أي خبرة سابقة - الدورة تبدأ معك من الصفر",
                      "شغف وحب للتعلم والاستكشاف",
                      "دفتر وقلم للملاحظات"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">{t('thisCourseIncludes')}</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Video className="w-5 h-5 text-gray-400" />
                      <span>10 {t('videoLessons')}</span>
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
                {[
                  {
                    week: 1,
                    title: "ما هي البرمجة؟",
                    topics: ["مفهوم البرمجة", "الخوارزميات", "أهمية البرمجة في حياتنا"]
                  },
                  {
                    week: 2,
                    title: "كيف يفكر المبرمج",
                    topics: ["خطوات التفكير البرمجي", "فهم المشكلة", "تقسيم المشكلة", "كتابة الخوارزمية"]
                  },
                  {
                    week: 3,
                    title: "المتغيرات",
                    topics: ["ما هي المتغيرات", "تعريف المتغيرات", "أنواع البيانات الأساسية"]
                  },
                  {
                    week: 4,
                    title: "العمليات الحسابية",
                    topics: ["الجمع", "الطرح", "الضرب", "القسمة"]
                  },
                  {
                    week: 5,
                    title: "الجمل الشرطية",
                    topics: ["جملة if", "جملة if-else", "اتخاذ القرارات في البرمجة"]
                  },
                  {
                    week: 6,
                    title: "الحلقات التكرارية",
                    topics: ["حلقة for", "حلقة while", "تكرار تنفيذ الأوامر"]
                  },
                  {
                    week: 7,
                    title: "الدوال",
                    topics: ["ما هي الدوال", "تعريف دالة", "دوال مع مدخلات"]
                  },
                  {
                    week: 8,
                    title: "المصفوفات",
                    topics: ["تعريف مصفوفة", "الوصول إلى عناصر المصفوفة", "التكرار على المصفوفات"]
                  },
                  {
                    week: 9,
                    title: "الكائنات",
                    topics: ["تعريف كائن", "الخصائص", "الوصول إلى البيانات"]
                  },
                  {
                    week: 10,
                    title: "مشروع آلة حاسبة",
                    topics: ["تطبيق عملي", "بناء آلة حاسبة بسيطة", "إضافة عمليات الضرب والقسمة"]
                  }
                ].map((week) => (
                  <div key={week.week} className="bg-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleWeek(week.week)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {week.week}
                        </span>
                        <span className="font-semibold">{week.title}</span>
                      </div>
                      {expandedWeeks.includes(week.week) ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedWeeks.includes(week.week) && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-700 pt-4">
                          <ul className="space-y-2">
                            {week.topics.map((topic, index) => (
                              <li key={index} className="flex items-start gap-3 text-gray-300">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
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