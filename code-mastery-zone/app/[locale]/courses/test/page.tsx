// app/courses/test/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { getCourses, getCourseById } from '@/app/lib/data';
import Link from 'next/link';

export default function TestCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const loadCourseDetails = async (id: string) => {
    const course = await getCourseById(id);
    setSelectedCourse(course);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">اختبار الكورسات</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* قائمة الكورسات */}
        <div>
          <h2 className="text-xl font-bold mb-4">الكورسات المتاحة ({courses.length})</h2>
          {courses.length === 0 ? (
            <p className="text-gray-400">لا توجد كورسات بعد. شغل صفحة admin/init</p>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => loadCourseDetails(course._id)}
                >
                  <h3 className="font-bold">{course.title}</h3>
                  <p className="text-sm text-gray-400">ID: {course._id}</p>
                  <p className="text-sm text-gray-400">{course.tag} - {course.duration}</p>
                  <Link 
                    href={`/courses/${course._id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    عرض الكورس →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل الكورس المحدد */}
        {selectedCourse && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">تفاصيل الكورس</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">العنوان:</p>
                <p className="font-bold">{selectedCourse.title}</p>
              </div>
              <div>
                <p className="text-gray-400">الوصف:</p>
                <p>{selectedCourse.description}</p>
              </div>
              <div>
                <p className="text-gray-400">التصنيف:</p>
                <span className="bg-blue-600 px-2 py-1 rounded text-sm">{selectedCourse.tag}</span>
              </div>
              <div>
                <p className="text-gray-400">المدة:</p>
                <p>{selectedCourse.duration}</p>
              </div>
              <div>
                <p className="text-gray-400">السعر:</p>
                <p className="text-green-400">{selectedCourse.price}</p>
              </div>
              {selectedCourse.lessons && (
                <div>
                  <p className="text-gray-400">عدد الدروس:</p>
                  <p>{selectedCourse.lessons.length}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}