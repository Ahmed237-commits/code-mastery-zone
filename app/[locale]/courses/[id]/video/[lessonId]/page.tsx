// app/courses/[id]/video/[lessonId]/page.tsx

import { setRequestLocale } from 'next-intl/server';
import VideoContent from './VideoContent';
type Props = {
  params: Promise<{
    locale: string;
  id: string; 
  lessonId: string
  }>;
};
export default async function VideoPage({ 
  params 
}:  
Props
) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <VideoContent />;
}