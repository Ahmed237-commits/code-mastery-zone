// app/lib/userProgress.ts

const API_BASE_URL = "http://localhost:8000/api";

export interface WatchedVideo {
  courseId: string;
  lessonId: string;
  videoUrl?: string;
  watchedAt: string;
  completed: boolean;
}

export interface LastWatched {
  courseId: string;
  lessonId: string;
  watchedAt: string;
}

export interface CourseProgress {
  courseId: string;
  videos: WatchedVideo[];
  completedCount: number;
  totalVideos: number;
  percentage: number;
}

// ===============================
// Helper: جلب التوكن من localStorage
// ===============================
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getToken();
  console.log('Token being sent:', token ? 'Present' : 'Missing');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// ===============================
// تسجيل مشاهدة فيديو
// ===============================
export async function trackWatchedVideo(
  courseId: string,
  lessonId: string,
  videoUrl?: string,
  completed: boolean = false
) {
  try {
    console.log('Tracking watched video:', { courseId, lessonId, completed });
    
    const token = getToken();
    if (!token) {
      console.log('No token found, skipping progress tracking');
      return { message: 'User not authenticated' };
    }

    const res = await fetch(`${API_BASE_URL}/users/progress/track`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        courseId, 
        lessonId, 
        videoUrl: videoUrl || '', 
        completed 
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Error response from server:', data);
      throw new Error(data.error || 'Failed to track progress');
    }

    console.log('Progress tracked successfully:', data);
    
    return data;
  } catch (error) {
    console.error('Error tracking progress:', error);
    throw error;
  }
}

// ===============================
// جلب كل تقدم المستخدم
// ===============================
export async function getUserProgress() {
  try {
    const token = getToken();
    if (!token) {
      console.log('No token found, returning empty progress');
      return { watchedVideos: [], lastWatched: null };
    }

    const res = await fetch(`${API_BASE_URL}/users/progress`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Error response from server:', data);
      throw new Error(data.error || 'Failed to get progress');
    }

    return data;
  } catch (error) {
    console.error('Error getting progress:', error);
    return { watchedVideos: [], lastWatched: null };
  }
}

// ===============================
// جلب آخر فيديو شاهده المستخدم
// ===============================
export async function getLastWatched() {
  try {
    const token = getToken();
    if (!token) {
      return null;
    }

    const res = await fetch(`${API_BASE_URL}/users/progress/last`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Error response from server:', data);
      throw new Error(data.error || 'Failed to get last watched');
    }

    return data;
  } catch (error) {
    console.error('Error getting last watched:', error);
    return null;
  }
}

// ===============================
// تحديد درس كمكتمل
// ===============================
export async function markLessonAsCompleted(courseId: string, lessonId: string) {
  try {
    console.log('Marking lesson as completed:', { courseId, lessonId });
    
    const token = getToken();
    if (!token) {
      console.log('No token found, skipping completion');
      return { message: 'User not authenticated' };
    }

    const res = await fetch(`${API_BASE_URL}/users/progress/complete`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ courseId, lessonId }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Error response from server:', data);
      throw new Error(data.error || 'Failed to mark lesson as completed');
    }

    console.log('Lesson marked as completed:', data);
    return data;
  } catch (error) {
    console.error('Error marking lesson as completed:', error);
    throw error;
  }
}

// ===============================
// جلب تقدم كورس معين
// ===============================
export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  try {
    const token = getToken();
    if (!token) {
      return {
        courseId,
        videos: [],
        completedCount: 0,
        totalVideos: 10, // افتراضي 10
        percentage: 0
      };
    }

    const res = await fetch(`${API_BASE_URL}/users/progress/course/${courseId}`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Error response from server:', data);
      throw new Error(data.error || 'Failed to get course progress');
    }

    // تأكد من أن totalVideos له قيمة افتراضية 10
    return {
      ...data,
      totalVideos: data.totalVideos || 10,
      completedCount: data.completedCount || 0,
      percentage: data.percentage || 0
    };
  } catch (error) {
    console.error('Error getting course progress:', error);
    return {
      courseId,
      videos: [],
      completedCount: 0,
      totalVideos: 10, // افتراضي 10
      percentage: 0
    };
  }
}
// app/lib/userProgress.ts

// ===============================
// جلب كل الكورسات التي سجل فيها المستخدم
// ===============================
export async function getEnrolledCourses() {
  try {
    const token = getToken();
    if (!token) {
      return [];
    }

    const res = await fetch(`${API_BASE_URL}/users/progress`, {
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Error response from server:', data);
      return [];
    }

    return data.enrolledCourses || [];
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    return [];
  }
}