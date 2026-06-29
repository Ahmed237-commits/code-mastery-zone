// app/lib/feedback.ts

export interface CourseRating {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// دالة جلب التقييمات والآراء الخاصة بكورس معين
export async function getCourseFeedbacks(courseId: string): Promise<CourseRating[]> {
  try {
    // تقييمات افتراضية (Mock Data) علشان الكومبوننت يقرأها والـ Build يمر بسلام
    return [
      {
        id: "f1",
        userName: "أحمد محمد",
        rating: 5,
        comment: "كورس ممتاز جداً وشرح مبسط وعملي للغاية، أنصح به بشدة!",
        createdAt: "2026-05-10"
      },
      {
        id: "f2",
        userName: "سارة أحمد",
        rating: 4.5,
        comment: "محتوى رائع وتطبيقات عملية ممتازة، شكراً للقائمين على المنصة.",
        createdAt: "2026-06-01"
      }
    ];
  } catch (error) {
    console.error("Error in getCourseFeedbacks:", error);
    return [];
  }
}