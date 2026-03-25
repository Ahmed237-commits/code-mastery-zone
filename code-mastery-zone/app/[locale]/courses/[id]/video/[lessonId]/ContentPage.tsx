// app/courses/[id]/video/[lessonId]/ContentPage.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Code, Sparkles, Lightbulb, Target, ArrowLeft } from 'lucide-react';

interface ContentPageProps {
  courseId: string;
  lessonId: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      body: string;
      codeExample?: string;
    }[];
    summary: string;
  };
  onNext: () => void;
}

export default function ContentPage({ courseId, lessonId, content, onNext }: ContentPageProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* المقدمة */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <p className="text-lg leading-relaxed">{content.introduction}</p>
        </div>
      </div>

      {/* الأقسام */}
      {content.sections.map((section, index) => (
        <div key={index} className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">
              {index + 1}
            </span>
            {section.title}
          </h2>
          
          <p className="text-gray-300 whitespace-pre-line leading-relaxed mb-4">
            {section.body}
          </p>
          
          {section.codeExample && (
            <div className="bg-gray-900 rounded-lg p-4 mt-4 border border-gray-700">
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                <Code className="w-4 h-4" />
                <span>مثال برمجي:</span>
              </div>
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
                <code>{section.codeExample}</code>
              </pre>
            </div>
          )}
        </div>
      ))}

      {/* الملخص */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          خلاصة الدرس
        </h3>
        <p className="text-gray-300">{content.summary}</p>
      </div>

      {/* زر الانتقال للاختبار */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors text-lg font-semibold"
        >
          <span>اختبر فهمك</span>
          <Target className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}