// app/courses/page.tsx

import { setRequestLocale } from 'next-intl/server';
import CoursesContent from './CourseContent';

export default async function CoursesPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <CoursesContent />;
}