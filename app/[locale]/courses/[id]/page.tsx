// app/courses/[id]/page.tsx

import { setRequestLocale } from 'next-intl/server';
import CourseDetailsContent from './CourseDetailsContent';

export default async function CourseDetailsPage({ 
  params 
}: { 
  params: { locale: string; id: string } 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <CourseDetailsContent />;
}