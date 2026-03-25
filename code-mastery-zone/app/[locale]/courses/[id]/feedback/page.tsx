// app/courses/[id]/feedback/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, Send, MessageSquare, X, ChevronLeft, 
  Smile, Meh, Frown, Heart, Award, Calendar,
  CheckCircle, AlertCircle, Loader2, ThumbsUp,
  MessageCircle, Share2, Flag, Quote, Sparkles,
  TrendingUp, Users, Clock, BookOpen,GraduationCap, Target,
  Code
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ChatBot from '@/app/components/chatbot';
import { getCourseById } from '@/app/lib/data';
import { addFeedback } from '@/app/lib/feedback';

interface Feedback {
  rating: number;
  comment: string;
  tags: string[];
  isAnonymous: boolean;
}

export default function CourseFeedbackPage() {
  const t = useTranslations('Courses');
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { data: session } = useSession();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    rating: 0,
    comment: '',
    tags: [],
    isAnonymous: false
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // جلب بيانات الكورس
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // خيارات التقييم السريع
  const ratingOptions = [
    { value: 5, label: 'ممتاز', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/20', desc: 'تجربة رائعة' },
    { value: 4, label: 'جيد جداً', icon: Smile, color: 'text-green-400', bg: 'bg-green-500/20', desc: 'تجربة جيدة' },
    { value: 3, label: 'جيد', icon: Meh, color: 'text-blue-400', bg: 'bg-blue-500/20', desc: 'تجربة مقبولة' },
    { value: 2, label: 'مقبول', icon: Meh, color: 'text-orange-400', bg: 'bg-orange-500/20', desc: 'يحتاج تحسين' },
    { value: 1, label: 'ضعيف', icon: Frown, color: 'text-red-400', bg: 'bg-red-500/20', desc: 'غير راضٍ' }
  ];

  // خيارات الوسوم
  const tagOptions = [
    { name: 'محتوى مفيد', icon: BookOpen },
    { name: 'شرح ممتاز', icon: Sparkles },
    { name: 'أمثلة عملية', icon: Code },
    { name: 'مناسب للمبتدئين', icon: GraduationCap },
    { name: 'تحديات مناسبة', icon: Target },
    { name: 'مشاريع تطبيقية', icon: Award },
    { name: 'دعم ممتاز', icon: MessageCircle },
    { name: 'سرعة في الرد', icon: Clock },
    { name: 'يحتاج تحسين', icon: AlertCircle },
    { name: 'صعوبة في الفهم', icon: AlertCircle }
  ];

  const handleRatingClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleTagToggle = (tag: string) => {
    setFeedback(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

 // استبدال الدالة handleSubmit بهذا الكود
const handleSubmit = async () => {
  if (feedback.rating === 0) {
    toast.error('يرجى اختيار تقييم للكورس');
    return;
  }

  setSubmitting(true);

  try {
    const result = await addFeedback({
      courseId,
      rating: feedback.rating,
      comment: feedback.comment,
      tags: feedback.tags,
      isAnonymous: feedback.isAnonymous
    });

    if (result) {
      setIsSubmitted(true);
      toast.success('شكراً لك! تم إرسال تقييمك بنجاح');
      
      setTimeout(() => {
        router.push(`/courses/${courseId}`);
      }, 3000);
    } else {
      toast.error('حدث خطأ في إرسال التقييم');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    toast.error('حدث خطأ في إرسال التقييم');
  } finally {
    setSubmitting(false);
  }
};
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
        <Footer />
      </>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <Header />
        <ChatBot />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">شكراً لتقييمك!</h2>
            <p className="text-gray-400 text-lg mb-6">
              رأيك مهم جداً لنا ويساعدنا في تحسين المحتوى وتقديم أفضل تجربة تعليمية.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/courses/${courseId}`}
                className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition text-lg font-medium"
              >
                العودة للكورس
              </Link>
              <Link
                href="/courses"
                className="px-6 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition text-lg font-medium"
              >
                استكشاف كورسات أخرى
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ChatBot />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-blue-400 transition">الرئيسية</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href="/courses" className="hover:text-blue-400 transition">الكورسات</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href={`/courses/${courseId}`} className="hover:text-blue-400 transition truncate max-w-[200px]">
              {course?.title}
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-blue-400 font-medium">تقييم الكورس</span>
          </div>

          {/* معلومات الكورس */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 mb-8 border border-blue-500/30">
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={course?.image || ''}
                  alt={course?.title || ''}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">{course?.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course?.studentsCount?.toLocaleString() || 0} طالب</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course?.lessons?.length || 10} درس</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{course?.averageRating || 4.9}</span>
                  </div>
                </div>
                <p className="text-gray-300 mt-2 text-sm">أخبرنا برأيك في هذه الدورة</p>
              </div>
            </div>
          </div>

          {/* نموذج التقييم */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
            
            {/* التقييم بالنجوم */}
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold mb-6">كيف تقيم هذه الدورة؟</h2>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-14 h-14 ${
                        star <= (hoverRating || feedback.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      } transition-all duration-200`}
                    />
                  </button>
                ))}
              </div>
              {feedback.rating > 0 && (
                <div className="mt-4">
                  <p className="text-lg font-semibold">
                    {ratingOptions.find(r => r.value === feedback.rating)?.label}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ratingOptions.find(r => r.value === feedback.rating)?.desc}
                  </p>
                </div>
              )}
            </div>

            {/* خيارات سريعة */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                اختر ما يناسب تجربتك
              </h3>
              <div className="flex flex-wrap gap-3">
                {tagOptions.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTagToggle(tag.name)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      feedback.tags.includes(tag.name)
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <tag.icon className="w-4 h-4" />
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* رسالة نصية */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                رأيك الإضافي
              </h3>
              <textarea
                value={feedback.comment}
                onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="اكتب رأيك هنا... ما أعجبك؟ ما الذي يمكن تحسينه؟"
                rows={5}
                className="w-full bg-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">(اختياري)</p>
            </div>

            {/* إرسال مجهول */}
            <div className="flex items-center justify-between mb-8 p-4 bg-gray-700/30 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feedback.isAnonymous}
                  onChange={(e) => setFeedback(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="w-5 h-5 accent-blue-600"
                />
                <span className="text-gray-300">إرسال كتقييم مجهول</span>
              </label>
              <div className="text-sm text-gray-500">
                {!session?.user && (
                  <Link href="/signin" className="text-blue-400 hover:underline">
                    سجل دخول
                  </Link>
                )}
              </div>
            </div>

            {/* زر الإرسال */}
            <button
              onClick={handleSubmit}
              disabled={submitting || feedback.rating === 0}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  إرسال التقييم
                </>
              )}
            </button>

            {/* ملاحظة */}
            <p className="text-sm text-gray-500 text-center mt-6 flex items-center justify-center gap-1">
              <Quote className="w-4 h-4" />
              تقييمك يساعدنا في تحسين المحتوى وتقديم أفضل تجربة تعليمية للجميع
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}