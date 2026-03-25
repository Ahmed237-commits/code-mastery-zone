// app/lib/feedback.ts

const API_BASE_URL = "http://localhost:8000/api";

export interface Feedback {
  _id: string;
  courseId: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  tags: string[];
  isAnonymous: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRating {
  averageRating: number;
  totalRatings: number;
  ratings: Feedback[];
}

// جلب تقييمات الكورس
export async function getCourseFeedbacks(courseId: string): Promise<CourseRating> {
  try {
    const res = await fetch(`${API_BASE_URL}/feedback/course/${courseId}`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch feedbacks');
      return { averageRating: 0, totalRatings: 0, ratings: [] };
    }

    const feedbacks = await res.json();
    
    const totalRatings = feedbacks.length;
    const averageRating = totalRatings > 0 
      ? feedbacks.reduce((sum: number, f: Feedback) => sum + f.rating, 0) / totalRatings 
      : 0;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
      ratings: feedbacks
    };
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return { averageRating: 0, totalRatings: 0, ratings: [] };
  }
}

// إضافة تقييم جديد
export async function addFeedback(feedback: {
  courseId: string;
  rating: number;
  comment: string;
  tags: string[];
  isAnonymous: boolean;
}): Promise<Feedback | null> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(feedback),
    });

    if (!res.ok) {
      throw new Error('Failed to add feedback');
    }

    return await res.json();
  } catch (error) {
    console.error('Error adding feedback:', error);
    return null;
  }
}