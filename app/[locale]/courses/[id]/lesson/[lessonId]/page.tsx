// app/courses/[id]/lesson/[lessonId]/page.tsx

import { setRequestLocale } from 'next-intl/server';
import LessonContent from './LessonContent';

export default async function LessonPage({ 
  params 
}: { 
  params: { locale: string; id: string; lessonId: string } 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <LessonContent />;
}