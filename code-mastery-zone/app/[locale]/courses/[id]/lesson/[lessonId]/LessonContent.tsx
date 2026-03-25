// app/courses/[id]/lesson/[lessonId]/LessonContent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { 
  ChevronLeft, ChevronRight, CheckCircle, Circle,
  PlayCircle, Code, Copy, Check, BookOpen,
  Menu, X, ArrowLeft, ArrowRight, Award
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ChatBot from '@/app/components/chatbot';
import { 
  getCourseById, 
  getCourseLessons, 
  getLessonById,
  getNextLesson,
  getPreviousLesson,
  useCourseProgress,
  Lesson 
} from '@/app/lib/data';

export default function LessonContent() {
  const t = useTranslations('Courses');
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [challengeOutput, setChallengeOutput] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const { progress, completeLesson, isLessonCompleted, percentage } = useCourseProgress(
    courseId, 
    lessons.length
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(courseId),
          getCourseLessons(courseId)
        ]);
        
        setCourse(courseData);
        setLessons(lessonsData);
        
        const lesson = await getLessonById(courseId, lessonId);
        setCurrentLesson(lesson);
        
        if (lesson?.content.challenge?.initialCode) {
          setUserCode(lesson.content.challenge.initialCode);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, lessonId]);

  const handleNextLesson = () => {
    if (!currentLesson) return;
    const next = getNextLesson(currentLesson, lessons);
    if (next) {
      router.push(`/courses/${courseId}/lesson/${next.id}`);
    }
  };

  const handlePreviousLesson = () => {
    if (!currentLesson) return;
    const prev = getPreviousLesson(currentLesson, lessons);
    if (prev) {
      router.push(`/courses/${courseId}/lesson/${prev.id}`);
    }
  };

  const handleMarkCompleted = () => {
    if (!currentLesson) return;
    completeLesson(currentLesson.id);
  };

  const handleCopyCode = () => {
    if (!currentLesson) return;
    navigator.clipboard.writeText(currentLesson.content.codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    try {
      // تنفيذ الكود بشكل آمن (هذا مجرد مثال)
      const originalLog = console.log;
      let output = '';
      console.log = (msg: any) => { output += msg + '\n'; };
      
      // تقييم الكود (في التطبيق الحقيقي استخدم بيئة آمنة)
      eval(userCode);
      
      console.log = originalLog;
      setChallengeOutput(output || 'تم تنفيذ الكود بنجاح ✅');
    } catch (error: any) {
      setChallengeOutput(`خطأ: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl">جاري تحميل الدرس...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course || !currentLesson) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">الدرس غير موجود</h1>
            <Link 
              href={`/courses/${courseId}`}
              className="text-blue-400 hover:text-blue-300"
            >
              العودة إلى الكورس
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
        {/* شريط التقدم العلوي */}
        <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <Link 
                  href={`/courses/${courseId}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{course?.title}</span>
                </Link>
              </div>

              <div className="flex-1 max-w-md mx-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400">{percentage}%</span>
                </div>
              </div>

              <button
                onClick={handleMarkCompleted}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  isLessonCompleted(currentLesson.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {isLessonCompleted(currentLesson.id) ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">تم الإكمال</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span className="hidden sm:inline">إكمال</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar للدروس */}
          <div className={`
            fixed lg:static inset-y-0 right-0 z-30 w-80 bg-gray-800 border-l border-gray-700
            transform transition-transform duration-300 ease-in-out overflow-y-auto
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">محتوى الدورة</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">{lessons.length} دروس</p>
            </div>

            <div className="p-2">
              {lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${courseId}/lesson/${lesson.id}`}
                  className={`block p-3 rounded-lg mb-1 transition-colors ${
                    lesson.id === currentLesson.id
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {isLessonCompleted(lesson.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="w-5 h-5 flex items-center justify-center text-xs text-gray-500">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{lesson.title}</h4>
                      <p className="text-xs text-gray-400">{lesson.duration} دقيقة</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {/* عنوان الدرس */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>الدرس {currentLesson.order} من {lessons.length}</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{currentLesson.title}</h1>
                <p className="text-gray-300">{currentLesson.description}</p>
              </div>

              {/* فيديو الشرح (إذا وجد) */}
              {currentLesson.content.video && (
                <div className="mb-8 aspect-video bg-gray-900 rounded-xl overflow-hidden">
                  <iframe
                    src={currentLesson.content.video}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}

              {/* الشرح النصي */}
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-blue-400" />
                  شرح الدرس
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentLesson.content.explanation}
                </p>
              </div>

              {/* مثال الكود */}
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    مثال تطبيقي
                  </h2>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                  <code>{currentLesson.content.codeExample}</code>
                </pre>
              </div>

              {/* التحدي البرمجي */}
              {currentLesson.content.challenge && (
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    التحدي البرمجي
                  </h2>
                  
                  <p className="text-gray-300 mb-4">
                    {currentLesson.content.challenge.instructions}
                  </p>

                  <div className="mb-4">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-40 bg-gray-900 text-white font-mono text-sm p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={handleRunCode}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      تشغيل الكود
                    </button>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {showSolution ? 'إخفاء الحل' : 'عرض الحل'}
                    </button>
                  </div>

                  {showSolution && currentLesson.content.challenge.solution && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">الحل المقترح:</h3>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                        <code>{currentLesson.content.challenge.solution}</code>
                      </pre>
                    </div>
                  )}

                  {challengeOutput && (
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">النتيجة:</h3>
                      <pre className="font-mono text-sm text-green-400 whitespace-pre-line">
                        {challengeOutput}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* أزرار التنقل بين الدروس */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-700">
                <button
                  onClick={handlePreviousLesson}
                  disabled={!getPreviousLesson(currentLesson, lessons)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    getPreviousLesson(currentLesson, lessons)
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>الدرس السابق</span>
                </button>

                <button
                  onClick={handleMarkCompleted}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>تحديد كمكتمل</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={!getNextLesson(currentLesson, lessons)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    getNextLesson(currentLesson, lessons)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>الدرس التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}