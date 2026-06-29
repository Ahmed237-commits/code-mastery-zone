// app/courses/[id]/page.tsx

import { setRequestLocale } from 'next-intl/server';
import CourseDetailsContent from './CourseDetailsContent';
type Props = {
  params: Promise<{
    locale: string;
  id: string; 
  }>;
};
export default async function CourseDetailsPage({ 
  params 
}:  
Props 
) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <CourseDetailsContent />;
}