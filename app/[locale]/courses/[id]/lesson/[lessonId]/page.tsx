// app/courses/[id]/lesson/[lessonId]/page.tsx

import { setRequestLocale } from 'next-intl/server';
import LessonContent from './LessonContent';
type Props = {
  params: Promise<{
    locale: string;
  id: string; 
  lessonId: string
  }>;
};
export default async function LessonPage({ 
  params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <LessonContent />;
}