// app/courses/page.tsx

import { setRequestLocale } from 'next-intl/server';
import CoursesContent from './CourseContent';
type Props = {
  params: Promise<{
    locale: string;
  }>;
};
export default async function CoursesPage({ params }:  Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <CoursesContent />;
}