"use client";

import { useState, useEffect } from "react";
import { getCourseProgress, updateLessonProgress } from "@/app/lib/data"; // تأكد من صحة مسار الدوال دي عندك

export function useCourseProgress(courseId: string, totalLessons: number) {
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentProgress = getCourseProgress(courseId);
      setProgress(currentProgress);
    }
  }, [courseId, totalLessons]);

  const completeLesson = (lessonId: string) => {
    const lessonIndex = parseInt(lessonId, 10);
    const updated = updateLessonProgress(courseId, isNaN(lessonIndex) ? 0 : lessonIndex, true, totalLessons);
    setProgress(updated);
    return updated;
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons?.includes(lessonId) || false;
  };

  return {
    progress,
    completeLesson,
    isLessonCompleted,
    percentage: progress?.percentage || 0
  };
}