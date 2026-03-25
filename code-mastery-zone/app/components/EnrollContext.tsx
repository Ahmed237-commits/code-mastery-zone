// app/context/EnrollContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

// تعريف الأنواع
interface EnrolledCourse {
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

interface EnrollContextType {
  // الدولة
  enrolledCourses: EnrolledCourse[];
  loading: boolean;
  error: string | null;
  
  // الدوال
  enrollInCourse: (courseId: string, courseTitle: string, totalLessons?: number) => Promise<boolean>;
  checkEnrollment: (courseId: string) => boolean;
  getCourseProgress: (courseId: string) => EnrolledCourse | undefined;
  updateCourseProgress: (courseId: string, completedLessons: number, totalLessons: number) => void;
  removeEnrollment: (courseId: string) => Promise<boolean>;
  syncWithServer: () => Promise<void>;
}

// إنشاء الـ Context
const EnrollContext = createContext<EnrollContextType | undefined>(undefined);

// Provider Component
export function EnrollProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل الكورسات المسجل فيها من localStorage عند بدء التشغيل
  useEffect(() => {
    const loadEnrolledCourses = async () => {
      setLoading(true);
      try {
        // جلب من localStorage أولاً
        const saved = localStorage.getItem('enrolled_courses');
        if (saved) {
          const parsed = JSON.parse(saved);
          setEnrolledCourses(parsed);
        }

        // إذا كان المستخدم مسجل دخول، نجلب من السيرفر
        if (session?.user) {
          await syncWithServer();
        }
      } catch (err) {
        console.error('Error loading enrolled courses:', err);
        setError('فشل في تحميل الكورسات المسجل فيها');
      } finally {
        setLoading(false);
      }
    };

    loadEnrolledCourses();
  }, [session]);

  // حفظ التغييرات في localStorage
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      localStorage.setItem('enrolled_courses', JSON.stringify(enrolledCourses));
    }
  }, [enrolledCourses]);

  // تسجيل في كورس
  const enrollInCourse = async (
    courseId: string,
    courseTitle: string,
    totalLessons: number = 10
  ): Promise<boolean> => {
    try {
      // التحقق من وجود المستخدم
      if (!session?.user) {
        toast.error('يجب تسجيل الدخول أولاً');
        return false;
      }

      // جلب التوكن
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى');
        return false;
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
        // التحقق من عدم وجود الكورس بالفعل
        const existing = enrolledCourses.find(c => c.courseId === courseId);
        if (!existing) {
          const newCourse: EnrolledCourse = {
            courseId,
            courseTitle,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            completedLessons: 0,
            totalLessons
          };
          setEnrolledCourses(prev => [...prev, newCourse]);
        }
        
        toast.success('تم التسجيل في الكورس بنجاح!');
        return true;
      } else {
        toast.error(data.error || 'حدث خطأ في التسجيل');
        return false;
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      toast.error('حدث خطأ في الاتصال بالخادم');
      return false;
    }
  };

  // التحقق من التسجيل في كورس
  const checkEnrollment = (courseId: string): boolean => {
    return enrolledCourses.some(course => course.courseId === courseId);
  };

  // جلب تقدم كورس معين
  const getCourseProgress = (courseId: string): EnrolledCourse | undefined => {
    return enrolledCourses.find(course => course.courseId === courseId);
  };

  // تحديث تقدم الكورس
  const updateCourseProgress = (courseId: string, completedLessons: number, totalLessons: number) => {
    setEnrolledCourses(prev =>
      prev.map(course =>
        course.courseId === courseId
          ? {
              ...course,
              completedLessons,
              totalLessons,
              progress: Math.round((completedLessons / totalLessons) * 100)
            }
          : course
      )
    );
  };

  // إزالة كورس من قائمة المسجل فيها
  const removeEnrollment = async (courseId: string): Promise<boolean> => {
    try {
      // هنا يمكن إضافة API لإلغاء التسجيل إذا كان موجوداً
      setEnrolledCourses(prev => prev.filter(course => course.courseId !== courseId));
      toast.success('تم إلغاء التسجيل بنجاح');
      return true;
    } catch (err) {
      console.error('Error removing enrollment:', err);
      toast.error('حدث خطأ في إلغاء التسجيل');
      return false;
    }
  };

  // مزامنة مع السيرفر
  const syncWithServer = async (): Promise<void> => {
    if (!session?.user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:8000/api/users/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        
        if (data.enrolledCourses && data.enrolledCourses.length > 0) {
          const serverCourses = data.enrolledCourses.map((item: any) => ({
            courseId: item.courseId._id || item.courseId,
            courseTitle: item.courseId?.title || 'كورس',
            enrolledAt: item.enrolledAt,
            progress: 0,
            completedLessons: 0,
            totalLessons: 10
          }));

          // دمج الكورسات المحلية مع السيرفر
          const merged = [...serverCourses];
          enrolledCourses.forEach(localCourse => {
            if (!serverCourses.some((s: any) => s.courseId === localCourse.courseId)) {
              merged.push(localCourse);
            }
          });
          
          setEnrolledCourses(merged);
        }
      }
    } catch (err) {
      console.error('Error syncing with server:', err);
    }
  };

  const value = {
    enrolledCourses,
    loading,
    error,
    enrollInCourse,
    checkEnrollment,
    getCourseProgress,
    updateCourseProgress,
    removeEnrollment,
    syncWithServer
  };

  return (
    <EnrollContext.Provider value={value}>
      {children}
    </EnrollContext.Provider>
  );
}

// Hook للوصول إلى الـ Context
export const useEnroll = () => {
  const context = useContext(EnrollContext);
  if (context === undefined) {
    throw new Error('useEnroll must be used within an EnrollProvider');
  }
  return context;
};