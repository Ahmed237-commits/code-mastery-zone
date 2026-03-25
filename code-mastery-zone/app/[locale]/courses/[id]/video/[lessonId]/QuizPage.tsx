// app/courses/[id]/video/[lessonId]/QuizPage.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, CheckCircle2, XCircle, RefreshCw, 
  Home, Info, CheckCircle, ArrowLeft, Eye,
  ChevronLeft, ChevronRight, Code
} from 'lucide-react';

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  type?: 'multiple-choice' | 'coding';
  tags?: string[];
  answer?: {
    summary: string;
    details?: string[];
    code?: string;
  };
}

interface QuizPageProps {
  courseId: string;
  lessonId: string;
  quiz: {
    title: string;
    questions: Question[];
    passingScore: number;
  };
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function QuizPage({ courseId, lessonId, quiz, onComplete, onBack }: QuizPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const progress = currentIndex + 1;

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    
    const finalScore = (correct / quiz.questions.length) * 100;
    setScore(finalScore);
    setSubmitted(true);
    setShowResults(true);
    onComplete(finalScore);
  };

  const handleRetry = () => {
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setSubmitted(false);
    setShowResults(false);
    setCurrentIndex(0);
  };

  const nextQuestion = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const allAnswered = !answers.includes(-1);

  if (showResults) {
    return (
      <div className="glass-container p-8">
        <div className="text-center py-8">
          {/* النتيجة */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-4xl font-bold">{Math.round(score)}%</span>
            </div>
            {score >= (quiz.passingScore || 70) ? (
              <CheckCircle2 className="w-10 h-10 text-green-500 absolute -bottom-2 -right-2" />
            ) : (
              <XCircle className="w-10 h-10 text-red-500 absolute -bottom-2 -right-2" />
            )}
          </div>

          <h3 className="text-2xl font-bold mb-4">
            {score >= (quiz.passingScore || 70)
              ? '🎉 تهانينا! لقد نجحت في الاختبار'
              : '💪 حاول مرة أخرى'}
          </h3>

          <p className="text-gray-400 mb-8">
            {score >= (quiz.passingScore || 70)
              ? 'أنت جاهز للانتقال إلى الدرس التالي'
              : `تحتاج إلى ${quiz.passingScore}% للنجاح`}
          </p>

          {/* شرح الإجابات */}
          <div className="bg-gray-900/50 rounded-lg p-6 mb-8 text-right">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              شرح الإجابات:
            </h4>
            {quiz.questions.map((q, index) => (
              <div key={q._id} className="mb-4 last:mb-0 border-b border-gray-700 pb-4 last:border-0">
                <p className="font-medium mb-2">{index + 1}. {q.text}</p>
                <p className="text-sm text-gray-400">
                  <span className="text-green-400">✓ الإجابة الصحيحة: </span>
                  {q.options[q.correctAnswer]}
                </p>
                {q.explanation && (
                  <p className="text-sm text-gray-500 mt-1">{q.explanation}</p>
                )}
              </div>
            ))}
          </div>

          {/* أزرار النتيجة */}
          <div className="flex gap-4 justify-center">
            {score < (quiz.passingScore || 70) ? (
              <button
                onClick={handleRetry}
                className="btn btn-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
            ) : (
              <Link
                href={`/courses/${courseId}`}
                className="btn btn-primary flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>الاستمرار إلى الدرس التالي</span>
              </Link>
            )}
            
            <Link
              href={`/courses/${courseId}`}
              className="btn bg-gray-700 hover:bg-gray-600 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>العودة للكورس</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-container p-8 animate-slideUp">
      {/* رأس السؤال */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة</span>
        </button>
        <div className="progress-pill">
          {progress} / {total}
        </div>
      </div>

      {/* بطاقة السؤال */}
      <div className="bg-gray-800/30 rounded-xl p-8 mb-6 border border-gray-700">
        {/* التاجات */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {question.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* نص السؤال */}
        <h2 className="text-2xl font-bold mb-6 leading-relaxed">
          {question.text}
        </h2>

        {/* محرر الكود (لأسئلة البرمجة) */}
        {question.type === 'coding' && (
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span className="terminal-title">solution.js</span>
            </div>
            <textarea
              className="code-input"
              placeholder="// اكتب الحل هنا..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
          </div>
        )}

        {/* الخيارات (لأسئلة الاختيار) */}
        {question.type !== 'coding' && (
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentIndex, index)}
                className={`w-full text-right p-4 rounded-lg transition-colors ${
                  answers[currentIndex] === index
                    ? 'bg-blue-600 border-2 border-blue-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* زر إظهار الإجابة */}
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="btn btn-primary flex items-center gap-2 mx-auto"
        >
          <Eye className="w-4 h-4" />
          <span>{showAnswer ? 'إخفاء الإجابة' : 'عرض الإجابة'}</span>
        </button>

        {/* الإجابة (تظهر عند الضغط على الزر) */}
        {showAnswer && question.answer && (
          <div className="mt-6 p-6 bg-gray-900/50 rounded-lg border-r-4 border-green-500 animate-fadeIn">
            <h4 className="font-bold text-green-400 mb-2">الإجابة:</h4>
            <p className="text-gray-300 mb-3">{question.answer.summary}</p>
            {question.answer.details && (
              <ul className="list-disc mr-5 mb-3 text-gray-400">
                {question.answer.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            )}
            {question.answer.code && (
              <pre className="code-block mt-3">
                <code>{question.answer.code}</code>
              </pre>
            )}
          </div>
        )}
      </div>

      {/* أزرار التنقل */}
      <div className="flex justify-between gap-4">
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className={`btn ${currentIndex === 0 ? 'bg-gray-700 opacity-50' : 'bg-gray-700 hover:bg-gray-600'} flex items-center gap-2`}
        >
          <ChevronRight className="w-4 h-4" />
          <span>السابق</span>
        </button>

        {currentIndex === total - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`btn ${allAnswered ? 'btn-primary' : 'bg-gray-700 opacity-50'} flex items-center gap-2`}
          >
            <span>إنهاء الاختبار</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="btn btn-primary flex items-center gap-2"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}