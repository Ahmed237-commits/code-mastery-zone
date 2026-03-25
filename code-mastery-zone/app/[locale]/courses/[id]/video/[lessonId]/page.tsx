// app/courses/[id]/video/[lessonId]/page.tsx

import { setRequestLocale } from 'next-intl/server';
import VideoContent from './VideoContent';

export default async function VideoPage({ 
  params 
}: { 
  params: { locale: string; id: string; lessonId: string } 
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <VideoContent />;
}