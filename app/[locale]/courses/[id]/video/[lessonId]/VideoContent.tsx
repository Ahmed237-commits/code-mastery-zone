// app/courses/[id]/video/[lessonId]/VideoContent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { 
  ChevronLeft, BookOpen, GraduationCap, Loader2,
  AlertCircle, Lock, CheckCircle
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ChatBot from '@/app/components/chatbot';
import ContentPage from './ContentPage';
import QuizPage from './QuizPage';
import { 
  trackWatchedVideo, 
  markLessonAsCompleted,
  getCourseProgress,
  type CourseProgress
} from '@/app/lib/userProgress';

// تعريف الأنواع
interface VideoPage {
  _id: string;
  courseId: string;
  lessonId: string;
  type: 'knowledge-check' | 'content' | 'quiz';
  title: string;
  checkQuestion?: string;
  content?: {
    introduction: string;
    sections: {
      title: string;
      body: string;
      codeExample?: string;
    }[];
    summary: string;
  };
  quiz?: {
    title: string;
    passingScore: number;
    questions: {
      _id: string;
      text: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }[];
  };
  order: number;
}

const getVideoPage = async (courseId: string, lessonId: string, step: number): Promise<VideoPage | null> => {
  // محاكاة تأخير API
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('Fetching page with:', { courseId, lessonId, step });

  const fixedCourseId = "67d2856c5413fc370b786b16";

  // بيانات كاملة لجميع الدروس العشرة
  const pages: Record<string, VideoPage[]> = {
    [fixedCourseId]: [
      // ==================== الدرس 1: ما هي البرمجة؟ ====================
      {
        _id: "page-1-lesson-1",
        courseId: fixedCourseId,
        lessonId: "lesson-1",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل لديك معرفة سابقة بمفهوم البرمجة؟",
        order: 1
      },
      {
        _id: "page-2-lesson-1",
        courseId: fixedCourseId,
        lessonId: "lesson-1",
        type: "content",
        title: "ما هي البرمجة؟",
        content: {
          introduction: "البرمجة هي الطريقة التي نستخدمها للتواصل مع الكمبيوتر وإعطائه تعليمات ليقوم بتنفيذ مهام معينة. كل برنامج تستخدمه يوميًا مثل المتصفح، الألعاب، تطبيقات الهاتف، ومواقع الإنترنت تم إنشاؤه باستخدام البرمجة.",
          sections: [
            {
              title: "مثال بسيط",
              body: "تخيل أنك تريد من الكمبيوتر أن يصنع كوب شاي. يمكن كتابة الخطوات كالتالي:\n\n1. اغلي الماء\n2. ضع الشاي في الكوب\n3. اسكب الماء\n4. أضف السكر\n\nهذه الخطوات تسمى خوارزمية (Algorithm). الخوارزمية هي مجموعة خطوات مرتبة لحل مشكلة.",
              codeExample: "// مثال على خوارزمية بسيطة\n// 1. اغلي الماء\n// 2. ضع الشاي في الكوب\n// 3. اسكب الماء\n// 4. أضف السكر"
            },
            {
              title: "دور البرمجة في حياتنا",
              body: "البرمجة موجودة في كل شيء تقريبًا:\n\n• مواقع الإنترنت\n• التطبيقات\n• السيارات الذكية\n• الذكاء الاصطناعي\n• الألعاب\n\nولهذا تعتبر البرمجة واحدة من أهم المهارات في العصر الحديث."
            }
          ],
          summary: "البرمجة هي كتابة تعليمات يفهمها الكمبيوتر لتنفيذ مهام محددة. كل التطبيقات والمواقع التي نستخدمها يوميًا مبنية على البرمجة."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-1",
        courseId: fixedCourseId,
        lessonId: "lesson-1",
        type: "quiz",
        title: "اختبار الدرس الأول",
        quiz: {
          title: "اختبر فهمك لمفهوم البرمجة",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson1",
              text: "ما هي البرمجة؟",
              options: [
                "كتابة النصوص فقط",
                "طريقة للتواصل مع الكمبيوتر وإعطائه تعليمات",
                "تصميم المواقع فقط",
                "لعب الألعاب"
              ],
              correctAnswer: 1,
              explanation: "البرمجة هي الطريقة التي نستخدمها للتواصل مع الكمبيوتر وإعطائه تعليمات لتنفيذ مهام معينة."
            },
            {
              _id: "q2-lesson1",
              text: "ماذا تسمى مجموعة الخطوات المرتبة لحل مشكلة؟",
              options: [
                "برنامج",
                "كود",
                "خوارزمية",
                "دالة"
              ],
              correctAnswer: 2,
              explanation: "الخوارزمية هي مجموعة خطوات مرتبة لحل مشكلة."
            },
            {
              _id: "q3-lesson1",
              text: "أي من التالي تم إنشاؤه باستخدام البرمجة؟",
              options: [
                "المتصفح فقط",
                "الألعاب فقط",
                "تطبيقات الهاتف فقط",
                "جميع ما ذكر"
              ],
              correctAnswer: 3,
              explanation: "كل ما ذكر (المتصفح، الألعاب، تطبيقات الهاتف) تم إنشاؤه باستخدام البرمجة."
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 2: كيف يفكر المبرمج ====================
      {
        _id: "page-1-lesson-2",
        courseId: fixedCourseId,
        lessonId: "lesson-2",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل تعرف كيف يفكر المبرمجون عند حل المشكلات؟",
        order: 1
      },
      {
        _id: "page-2-lesson-2",
        courseId: fixedCourseId,
        lessonId: "lesson-2",
        type: "content",
        title: "كيف يفكر المبرمج",
        content: {
          introduction: "قبل كتابة أي كود، يجب أن نتعلم كيف نفكر كمبرمج. المبرمج الجيد لا يبدأ بالكود مباشرة، بل يتبع خطوات منهجية لحل المشكلات.",
          sections: [
            {
              title: "خطوات التفكير البرمجي",
              body: "المبرمج الجيد يتبع هذه الخطوات:\n\n1. فهم المشكلة\n2. تقسيم المشكلة إلى أجزاء صغيرة\n3. كتابة الخوارزمية\n4. تحويل الخوارزمية إلى كود",
              codeExample: "// مثال: برنامج يحسب مجموع رقمين\n\n// 1. فهم المشكلة: حساب مجموع رقمين\n// 2. تقسيم المشكلة: إدخال رقمين، جمعهما، إخراج النتيجة\n// 3. الخوارزمية:\n//    - أدخل الرقم الأول\n//    - أدخل الرقم الثاني\n//    - اجمع الرقمين\n//    - اطبع الناتج\n\n// 4. تحويل إلى كود\nlet num1 = 5;\nlet num2 = 10;\nlet result = num1 + num2;\nconsole.log(result);"
            }
          ],
          summary: "التفكير البرمجي هو مهارة أساسية للمبرمج، تعتمد على فهم المشكلة وتقسيمها وحلها خطوة بخطوة."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-2",
        courseId: fixedCourseId,
        lessonId: "lesson-2",
        type: "quiz",
        title: "اختبار الدرس الثاني",
        quiz: {
          title: "اختبر فهمك للتفكير البرمجي",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson2",
              text: "ما هي أول خطوة في التفكير البرمجي؟",
              options: [
                "كتابة الكود مباشرة",
                "فهم المشكلة",
                "اختبار البرنامج",
                "تشغيل البرنامج"
              ],
              correctAnswer: 1,
              explanation: "أول خطوة هي فهم المشكلة قبل البدء في كتابة أي كود."
            },
            {
              _id: "q2-lesson2",
              text: "ماذا نسمي مجموعة الخطوات المرتبة لحل مشكلة قبل تحويلها لكود؟",
              options: [
                "برنامج",
                "خوارزمية",
                "دالة",
                "متغير"
              ],
              correctAnswer: 1,
              explanation: "الخوارزمية هي الخطوات المرتبة لحل المشكلة قبل تحويلها إلى كود."
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 3: المتغيرات ====================
      {
        _id: "page-1-lesson-3",
        courseId: fixedCourseId,
        lessonId: "lesson-3",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل لديك معرفة سابقة بالمتغيرات في البرمجة؟",
        order: 1
      },
      {
        _id: "page-2-lesson-3",
        courseId: fixedCourseId,
        lessonId: "lesson-3",
        type: "content",
        title: "المتغيرات",
        content: {
          introduction: "المتغير هو مكان في الذاكرة لتخزين البيانات. يمكن تخيله كأنه صندوق نضع فيه قيمة.",
          sections: [
            {
              title: "تعريف المتغيرات",
              body: "في JavaScript، نستخدم الكلمات let أو const لتعريف المتغيرات:\n\nlet name = \"Ahmed\";\nlet age = 17;\n\nهنا:\n- name متغير يحتوي على نص\n- age متغير يحتوي على رقم",
              codeExample: "// تعريف متغيرات\nlet name = \"Ahmed\";\nlet age = 17;\nlet city = \"Cairo\";\n\nconsole.log(name); // Ahmed\nconsole.log(age);  // 17"
            },
            {
              title: "أنواع البيانات الأساسية",
              body: "1. النصوص (Strings):\n   let city = \"Cairo\";\n\n2. الأرقام (Numbers):\n   let price = 100;\n\n3. القيم المنطقية (Boolean):\n   let isStudent = true; // true أو false"
            }
          ],
          summary: "المتغيرات هي حاويات لتخزين البيانات في الذاكرة. كل متغير له اسم وقيمة ونوع بيانات."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-3",
        courseId: fixedCourseId,
        lessonId: "lesson-3",
        type: "quiz",
        title: "اختبار الدرس الثالث",
        quiz: {
          title: "اختبر فهمك للمتغيرات",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson3",
              text: "ما هو المتغير في البرمجة؟",
              options: [
                "قيمة ثابتة لا تتغير",
                "مكان في الذاكرة لتخزين البيانات",
                "عملية حسابية",
                "دالة برمجية"
              ],
              correctAnswer: 1,
              explanation: "المتغير هو مكان في الذاكرة لتخزين البيانات، يمكن تخيله كصندوق نضع فيه قيمة."
            },
            {
              _id: "q2-lesson3",
              text: "أي من التالي هو متغير نصي (String)؟",
              options: [
                "let age = 17",
                "let name = 'Ahmed'",
                "let isStudent = true",
                "let price = 100"
              ],
              correctAnswer: 1,
              explanation: "النصوص (Strings) تكتب بين علامتي اقتباس، مثل 'Ahmed'."
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 4: العمليات الحسابية ====================
      {
        _id: "page-1-lesson-4",
        courseId: fixedCourseId,
        lessonId: "lesson-4",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل تعرف العمليات الحسابية الأساسية في البرمجة؟",
        order: 1
      },
      {
        _id: "page-2-lesson-4",
        courseId: fixedCourseId,
        lessonId: "lesson-4",
        type: "content",
        title: "العمليات الحسابية",
        content: {
          introduction: "البرامج تقوم بالكثير من العمليات الحسابية. أهم العمليات هي الجمع، الطرح، الضرب، والقسمة.",
          sections: [
            {
              title: "العمليات الأساسية",
              body: "الجمع: +\nالطرح: -\nالضرب: *\nالقسمة: /",
              codeExample: "let a = 10;\nlet b = 5;\n\nlet sum = a + b;      // 15\nlet difference = a - b; // 5\nlet product = a * b;    // 50\nlet quotient = a / b;   // 2\n\nconsole.log(\"المجموع:\", sum);\nconsole.log(\"الفرق:\", difference);\nconsole.log(\"الضرب:\", product);\nconsole.log(\"القسمة:\", quotient);"
            },
            {
              title: "مثال تطبيقي",
              body: "حساب السعر بعد الخصم:\nlet price = 100;\nlet discount = 20;\nlet finalPrice = price - discount;",
              codeExample: "let price = 100;\nlet discount = 20;\nlet finalPrice = price - discount;\nconsole.log(\"السعر بعد الخصم:\", finalPrice); // 80"
            }
          ],
          summary: "العمليات الحسابية الأساسية (+, -, *, /) تستخدم بكثرة في البرمجة لإجراء الحسابات المختلفة."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-4",
        courseId: fixedCourseId,
        lessonId: "lesson-4",
        type: "quiz",
        title: "اختبار الدرس الرابع",
        quiz: {
          title: "اختبر فهمك للعمليات الحسابية",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson4",
              text: "ما هي نتيجة العملية التالية: 15 - 7",
              options: [
                "22",
                "8",
                "105",
                "2"
              ],
              correctAnswer: 1,
              explanation: "15 - 7 = 8"
            },
            {
              _id: "q2-lesson4",
              text: "إذا كان price = 200 و discount = 30، فما هي قيمة finalPrice؟",
              options: [
                "230",
                "170",
                "6000",
                "6.66"
              ],
              correctAnswer: 1,
              explanation: "finalPrice = price - discount = 200 - 30 = 170"
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 5: الجمل الشرطية ====================
      {
        _id: "page-1-lesson-5",
        courseId: fixedCourseId,
        lessonId: "lesson-5",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل تعرف كيف يتخذ البرنامج قرارات؟",
        order: 1
      },
      {
        _id: "page-2-lesson-5",
        courseId: fixedCourseId,
        lessonId: "lesson-5",
        type: "content",
        title: "الجمل الشرطية",
        content: {
          introduction: "أحيانًا يحتاج البرنامج لاتخاذ قرار. الجمل الشرطية تسمح للبرنامج بتنفيذ كود معين بناءً على تحقق شرط معين.",
          sections: [
            {
              title: "جملة if",
              body: "تستخدم لتنفيذ كود إذا كان الشرط صحيحاً.\n\nif (شرط) {\n  // كود يتم تنفيذه إذا كان الشرط صحيحاً\n}",
              codeExample: "let age = 20;\n\nif (age >= 18) {\n  console.log(\"مسموح بالدخول\");\n}"
            },
            {
              title: "جملة if-else",
              body: "تنفيذ كود إذا كان الشرط صحيحاً، وكود آخر إذا كان خطأ.",
              codeExample: "let score = 90;\n\nif (score >= 50) {\n  console.log(\"نجحت\");\n} else {\n  console.log(\"راسب\");\n}"
            }
          ],
          summary: "الجمل الشرطية تسمح للبرنامج باتخاذ قرارات بناءً على شروط محددة، مما يجعله ذكياً وقادراً على التعامل مع مواقف مختلفة."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-5",
        courseId: fixedCourseId,
        lessonId: "lesson-5",
        type: "quiz",
        title: "اختبار الدرس الخامس",
        quiz: {
          title: "اختبر فهمك للجمل الشرطية",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson5",
              text: "ماذا تطبع الجملة التالية إذا كانت age = 15؟\nif (age >= 18) {\n  console.log('مسموح');\n} else {\n  console.log('غير مسموح');\n}",
              options: [
                "مسموح",
                "غير مسموح",
                "خطأ في الكود",
                "لا شيء"
              ],
              correctAnswer: 1,
              explanation: "لأن 15 أقل من 18، سيتم تنفيذ الجزء else وطباعة 'غير مسموح'."
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 6: الحلقات التكرارية ====================
      {
        _id: "page-1-lesson-6",
        courseId: fixedCourseId,
        lessonId: "lesson-6",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل تعرف كيف تكرر تنفيذ كود عدة مرات؟",
        order: 1
      },
      {
        _id: "page-2-lesson-6",
        courseId: fixedCourseId,
        lessonId: "lesson-6",
        type: "content",
        title: "الحلقات التكرارية",
        content: {
          introduction: "الحلقات التكرارية تستخدم عندما نريد تكرار كود عدة مرات.",
          sections: [
            {
              title: "حلقة for",
              body: "تستخدم عندما نعرف عدد مرات التكرار.",
              codeExample: "// طباعة الأرقام من 1 إلى 5\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}"
            },
            {
              title: "مثال آخر",
              body: "طباعة كلمة Hello عشر مرات.",
              codeExample: "for (let i = 1; i <= 10; i++) {\n  console.log(\"Hello\");\n}"
            }
          ],
          summary: "الحلقات التكرارية توفر وقت وجهد كبيرين في البرمجة، وتستخدم لتكرار تنفيذ نفس الكود عدة مرات."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-6",
        courseId: fixedCourseId,
        lessonId: "lesson-6",
        type: "quiz",
        title: "اختبار الدرس السادس",
        quiz: {
          title: "اختبر فهمك للحلقات التكرارية",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson6",
              text: "كم مرة ستطبع الجملة في الكود التالي؟\nfor (let i = 0; i < 3; i++) {\n  console.log('مرحباً');\n}",
              options: [
                "مرة واحدة",
                "مرتين",
                "3 مرات",
                "4 مرات"
              ],
              correctAnswer: 2,
              explanation: "الحلقة تبدأ من i=0 وتستمر حتى i=2 (3 مرات)."
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 7: الدوال ====================
      {
        _id: "page-1-lesson-7",
        courseId: fixedCourseId,
        lessonId: "lesson-7",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل تعرف ما هي الدوال في البرمجة؟",
        order: 1
      },
      {
        _id: "page-2-lesson-7",
        courseId: fixedCourseId,
        lessonId: "lesson-7",
        type: "content",
        title: "الدوال",
        content: {
          introduction: "الدالة هي جزء من الكود يمكن إعادة استخدامه. بدلاً من كتابة نفس الكود عدة مرات، يمكن وضعه داخل دالة.",
          sections: [
            {
              title: "تعريف دالة",
              body: "نستخدم الكلمة function لتعريف دالة.",
              codeExample: "function greet() {\n  console.log(\"مرحبا بك\");\n}\n\ngreet(); // استدعاء الدالة"
            },
            {
              title: "دالة مع مدخلات",
              body: "يمكن للدوال استقبال بيانات وإرجاع نتائج.",
              codeExample: "function greet(name) {\n  console.log(\"مرحبا \" + name);\n}\n\ngreet(\"Ahmed\");\ngreet(\"Sara\");"
            }
          ],
          summary: "الدوال تجعل الكود منظماً وقابلاً لإعادة الاستخدام، مما يسهل صيانة وتطوير البرامج."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-7",
        courseId: fixedCourseId,
        lessonId: "lesson-7",
        type: "quiz",
        title: "اختبار الدرس السابع",
        quiz: {
          title: "اختبر فهمك للدوال",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson7",
              text: "ما هي الدالة في البرمجة؟",
              options: [
                "متغير خاص",
                "جزء من الكود يمكن إعادة استخدامه",
                "عملية حسابية",
                "نوع من البيانات"
              ],
              correctAnswer: 1,
              explanation: "الدالة هي جزء من الكود يمكن إعادة استخدامه عدة مرات."
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 8: المصفوفات ====================
      {
        _id: "page-1-lesson-8",
        courseId: fixedCourseId,
        lessonId: "lesson-8",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل تعرف كيف تخزن مجموعة من القيم في متغير واحد؟",
        order: 1
      },
      {
        _id: "page-2-lesson-8",
        courseId: fixedCourseId,
        lessonId: "lesson-8",
        type: "content",
        title: "المصفوفات",
        content: {
          introduction: "المصفوفة تستخدم لتخزين مجموعة من القيم في متغير واحد.",
          sections: [
            {
              title: "تعريف مصفوفة",
              body: "نستخدم الأقواس المربعة [] لتعريف مصفوفة.",
              codeExample: "let fruits = [\"Apple\", \"Banana\", \"Orange\"];\nconsole.log(fruits);"
            },
            {
              title: "الوصول إلى عناصر المصفوفة",
              body: "يمكن الوصول إلى عنصر داخل المصفوفة باستخدام الفهرس (index). أول عنصر له index = 0.",
              codeExample: "let fruits = [\"Apple\", \"Banana\", \"Orange\"];\nconsole.log(fruits[0]); // Apple\nconsole.log(fruits[1]); // Banana\nconsole.log(fruits[2]); // Orange"
            }
          ],
          summary: "المصفوفات تسمح بتخزين وتنظيم مجموعات من البيانات، والوصول إليها بسهولة باستخدام الفهارس."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-8",
        courseId: fixedCourseId,
        lessonId: "lesson-8",
        type: "quiz",
        title: "اختبار الدرس الثامن",
        quiz: {
          title: "اختبر فهمك للمصفوفات",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson8",
              text: "كيف نصل إلى العنصر 'Banana' في المصفوفة fruits = ['Apple', 'Banana', 'Orange']؟",
              options: [
                "fruits[0]",
                "fruits[1]",
                "fruits[2]",
                "fruits[3]"
              ],
              correctAnswer: 1,
              explanation: "الفهارس تبدأ من 0، لذا 'Banana' في الموقع 1."
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 9: الكائنات ====================
      {
        _id: "page-1-lesson-9",
        courseId: fixedCourseId,
        lessonId: "lesson-9",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل تعرف كيف تخزن بيانات مرتبطة ببعضها في البرمجة؟",
        order: 1
      },
      {
        _id: "page-2-lesson-9",
        courseId: fixedCourseId,
        lessonId: "lesson-9",
        type: "content",
        title: "الكائنات",
        content: {
          introduction: "الكائن يستخدم لتجميع بيانات مرتبطة ببعضها. الكائن يتكون من خصائص (properties) وقيم (values).",
          sections: [
            {
              title: "تعريف كائن",
              body: "نستخدم الأقواس {} لتعريف كائن، ونكتب الخصائص على شكل key: value.",
              codeExample: "let user = {\n  name: \"Ahmed\",\n  age: 17,\n  country: \"Egypt\"\n};\n\nconsole.log(user);"
            },
            {
              title: "الوصول إلى خصائص الكائن",
              body: "يمكن الوصول إلى قيم الخصائص باستخدام النقطة .",
              codeExample: "let user = {\n  name: \"Ahmed\",\n  age: 17,\n  country: \"Egypt\"\n};\n\nconsole.log(user.name);    // Ahmed\nconsole.log(user.age);     // 17\nconsole.log(user.country); // Egypt"
            }
          ],
          summary: "الكائنات تسمح بتجميع البيانات المرتبطة ببعضها في هيكل واحد منظم، مما يسهل التعامل معها."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-9",
        courseId: fixedCourseId,
        lessonId: "lesson-9",
        type: "quiz",
        title: "اختبار الدرس التاسع",
        quiz: {
          title: "اختبر فهمك للكائنات",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson9",
              text: "كيف نصل إلى قيمة name في الكائن user = { name: 'Sara', age: 20 }؟",
              options: [
                "user[0]",
                "user.name",
                "user('name')",
                "name.user"
              ],
              correctAnswer: 1,
              explanation: "نستخدم النقطة (.) للوصول إلى خصائص الكائن: user.name"
            }
          ]
        },
        order: 3
      },

      // ==================== الدرس 10: مشروع صغير (آلة حاسبة) ====================
      {
        _id: "page-1-lesson-10",
        courseId: fixedCourseId,
        lessonId: "lesson-10",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل أنت مستعد لتطبيق ما تعلمته في مشروع صغير؟",
        order: 1
      },
      {
        _id: "page-2-lesson-10",
        courseId: fixedCourseId,
        lessonId: "lesson-10",
        type: "content",
        title: "مشروع آلة حاسبة بسيطة",
        content: {
          introduction: "سنقوم بإنشاء برنامج آلة حاسبة بسيط تقوم بجمع وطرح رقمين.",
          sections: [
            {
              title: "الكود الكامل",
              body: "الآلة الحاسبة تستقبل رقمين وعملية حسابية، ثم ترجع النتيجة.",
              codeExample: "function calculator(a, b, operation) {\n  if (operation === \"+\") {\n    return a + b;\n  }\n  if (operation === \"-\") {\n    return a - b;\n  }\n  return \"عملية غير مدعومة\";\n}\n\nconsole.log(calculator(10, 5, \"+\")); // 15\nconsole.log(calculator(10, 5, \"-\")); // 5"
            },
            {
              title: "تطوير الآلة الحاسبة",
              body: "يمكن تطوير الآلة الحاسبة لإضافة عمليات أخرى مثل الضرب والقسمة.",
              codeExample: "function calculator(a, b, operation) {\n  if (operation === \"+\") {\n    return a + b;\n  }\n  if (operation === \"-\") {\n    return a - b;\n  }\n  if (operation === \"*\") {\n    return a * b;\n  }\n  if (operation === \"/\") {\n    return a / b;\n  }\n  return \"عملية غير مدعومة\";\n}\n\nconsole.log(calculator(10, 5, \"*\")); // 50\nconsole.log(calculator(10, 5, \"/\")); // 2"
            }
          ],
          summary: "مبروك! لقد أنشأت أول مشروع برمجي لك. الآلة الحاسبة البسيطة هي بداية رحلتك في عالم البرمجة."
        },
        order: 2
      },
      {
        _id: "page-3-lesson-10",
        courseId: fixedCourseId,
        lessonId: "lesson-10",
        type: "quiz",
        title: "الاختبار النهائي",
        quiz: {
          title: "اختبر فهمك للمشروع النهائي",
          passingScore: 70,
          questions: [
            {
              _id: "q1-lesson10",
              text: "ما هي نتيجة calculator(8, 3, '+') في الكود أعلاه؟",
              options: [
                "5",
                "11",
                "24",
                "2.66"
              ],
              correctAnswer: 1,
              explanation: "8 + 3 = 11"
            },
            {
              _id: "q2-lesson10",
              text: "إذا أضفنا عملية الضرب للآلة الحاسبة، ما هي نتيجة calculator(6, 4, '*')؟",
              options: [
                "10",
                "2",
                "24",
                "1.5"
              ],
              correctAnswer: 2,
              explanation: "6 * 4 = 24"
            }
          ]
        },
        order: 3
      }
    ]
  };

  // البحث عن الصفحة المطلوبة حسب الـ lessonId والـ step
  const coursePages = pages[fixedCourseId] || [];
  const foundPage = coursePages.find(p => p.lessonId === lessonId && p.order === step);
  
  console.log('Found page:', foundPage);
  return foundPage || null;
};

export default function VideoContent() {
  const t = useTranslations('Courses');
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const { data: session } = useSession();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [page, setPage] = useState<VideoPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [knowledgeAnswer, setKnowledgeAnswer] = useState<'yes' | 'no' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);

  // جلب تقدم الكورس
  useEffect(() => {
    const fetchProgress = async () => {
      if (!session?.user) return;
      
      try {
        const progress = await getCourseProgress(courseId);
        setCourseProgress(progress);
      } catch (error) {
        console.error('Failed to load course progress:', error);
      }
    };
    
    fetchProgress();
  }, [courseId, session]);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching page for step:', currentStep);
        const data = await getVideoPage(courseId, lessonId, currentStep);
        console.log('Received data:', data);
        
        if (!data) {
          setError('لم يتم العثور على الصفحة');
        }
        
        setPage(data);
      } catch (error) {
        console.error('Error fetching page:', error);
        setError('حدث خطأ في تحميل الصفحة');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [courseId, lessonId, currentStep]);

  // للتحقق من الـ params
  console.log('Params:', { courseId, lessonId });

  const handleKnowledgeAnswer = async (answer: 'yes' | 'no') => {
    setKnowledgeAnswer(answer);
    
    // تسجيل المشاهدة (حتى لو مختار نعم)
    if (session?.user) {
      try {
        await trackWatchedVideo(courseId, lessonId);
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    }
    
    if (answer === 'yes') {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  };

  const handleQuizComplete = async (score: number) => {
  console.log('Quiz completed with score:', score);
  
  if (score >= (page?.quiz?.passingScore || 70)) {
    setIsLessonCompleted(true);
  }
  
  if (session?.user) {
    try {
      // تسجيل المشاهدة مع اكتمال
      await trackWatchedVideo(courseId, lessonId, '', true);
      
      // تحديد الدرس كمكتمل إذا نجح
      if (score >= (page?.quiz?.passingScore || 70)) {
        const result = await markLessonAsCompleted(courseId, lessonId);
        console.log('Mark lesson result:', result); // ✅ شوف هنا البيانات
      }
      
      // تحديث التقدم
      const updatedProgress = await getCourseProgress(courseId);
      console.log('Updated progress:', updatedProgress); // ✅ شوف هنا التقدم المحدث
      setCourseProgress(updatedProgress);
      
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  } else {
    console.log('User not logged in, progress saved locally only');
  }
};

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-xl">جاري تحميل الدرس...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">خطأ</h1>
            <p className="text-gray-400 mb-6">{error || 'لم يتم العثور على الصفحة'}</p>
            <div className="text-sm text-gray-500 mb-4">
              <p>Course ID: {courseId}</p>
              <p>Lesson ID: {lessonId}</p>
              <p>Step: {currentStep}</p>
            </div>
            <Link 
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>العودة للكورس</span>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ChatBot />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
        {/* Animated Background */}
        <div className="bg-animation">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* شريط التقدم */}
          <div className="glass-container p-4 mb-6">
            <div className="flex items-center justify-between">
              <Link 
                href={`/courses/${courseId}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>العودة للكورس</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  الخطوة {currentStep} من 3
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        step === currentStep
                          ? 'bg-blue-500'
                          : step < currentStep
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* العنوان */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
            <p className="text-gray-400">
              {lessonId === 'lesson-1' && 'الدرس الأول: ما هي البرمجة؟'}
              {lessonId === 'lesson-2' && 'الدرس الثاني: كيف يفكر المبرمج'}
              {lessonId === 'lesson-3' && 'الدرس الثالث: المتغيرات'}
              {lessonId === 'lesson-4' && 'الدرس الرابع: العمليات الحسابية'}
              {lessonId === 'lesson-5' && 'الدرس الخامس: الجمل الشرطية'}
              {lessonId === 'lesson-6' && 'الدرس السادس: الحلقات التكرارية'}
              {lessonId === 'lesson-7' && 'الدرس السابع: الدوال'}
              {lessonId === 'lesson-8' && 'الدرس الثامن: المصفوفات'}
              {lessonId === 'lesson-9' && 'الدرس التاسع: الكائنات'}
              {lessonId === 'lesson-10' && 'الدرس العاشر: مشروع آلة حاسبة'}
            </p>
          </div>

          {/* عرض المحتوى */}
          {currentStep === 1 && (
            <div className="glass-container p-12 text-center animate-slideUp">
              <GraduationCap className="w-20 h-20 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-8">{page.checkQuestion}</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleKnowledgeAnswer('yes')}
                  className="px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ✅ نعم، أعرف
                </button>
                
                <button
                  onClick={() => handleKnowledgeAnswer('no')}
                  className="px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  📚 لا، أريد التعلم
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && page.content && (
            <ContentPage
              courseId={courseId}
              lessonId={lessonId}
              content={page.content}
              onNext={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && page.quiz && (
            <QuizPage
              courseId={courseId}
              lessonId={lessonId}
              quiz={page.quiz}
              onComplete={handleQuizComplete}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {/* ✅ زر واحد فقط - الدرس التالي (يظهر في الخطوة 3) */}
          {currentStep === 3 && (
            <div className="flex justify-center mt-8 pt-6 border-t border-gray-700">
              {lessonId === 'lesson-10' ? (
                // آخر درس
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">🎉 تهانينا! لقد أكملت جميع الدروس</span>
                  </div>
                  <Link
                    href={`/courses/${courseId}`}
                    className="block mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    العودة إلى صفحة الكورس
                  </Link>
                </div>
              ) : (
                // ليس آخر درس
                <>
                  {isLessonCompleted ? (
                    // ✅ الدرس مكتمل - الزر شغال
                    <button
                      onClick={() => {
                        const currentLessonNumber = parseInt(lessonId.split('-')[1]);
                        const nextLessonNumber = currentLessonNumber + 1;
                        router.push(`/courses/${courseId}/video/lesson-${nextLessonNumber}`);
                      }}
                      className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-xl text-white font-bold text-lg shadow-lg shadow-green-600/30 transform hover:scale-105 transition-all duration-300"
                    >
                      <span>الدرس التالي</span>
                      <ChevronLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    // ❌ الدرس غير مكتمل - الزر معطل
                    <div className="group flex items-center gap-3 px-8 py-4 bg-gray-700 rounded-xl text-gray-400 font-bold text-lg cursor-not-allowed">
                      <Lock className="w-5 h-5" />
                      <span>الدرس التالي (غير متاح)</span>
                      <span className="text-xs text-gray-500 mr-2">أكمل الاختبار أولاً</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

         {/* عرض تقدم الكورس (للمستخدمين المسجلين) */}
{/* عرض تقدم الكورس (للمستخدمين المسجلين) */}
{session?.user && (
  <div className="mt-6 text-center">
    {courseProgress ? (
      <div className="inline-flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-gray-700 shadow-lg">
        {/* أيقونة التقدم */}
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            courseProgress.percentage === 0 ? 'bg-gray-500' :
            courseProgress.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
          } animate-pulse`}></div>
          <span className="text-sm font-medium text-gray-300">تقدمك:</span>
        </div>

        {/* عداد الدروس - بيتحدث تلقائياً */}
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-white">{courseProgress.completedCount}</span>
          <span className="text-xs text-gray-500">/</span>
          <span className="text-sm text-gray-400">{courseProgress.totalVideos || 10}</span>
          <span className="text-xs text-gray-500 mr-1">دروس</span>
        </div>

        {/* الفاصل */}
        <div className="h-5 w-px bg-gray-700"></div>

        {/* النسبة المئوية */}
        <div className="flex items-center gap-1.5">
          <span className={`text-lg font-bold ${
            courseProgress.percentage === 0 ? 'text-gray-400' :
            courseProgress.percentage === 100 ? 'text-green-400' : 'text-blue-400'
          }`}>
            {courseProgress.percentage}%
          </span>
          <span className="text-xs text-gray-500">مكتمل</span>
        </div>

        {/* شريط التقدم الصغير */}
        <div className="hidden sm:block w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${courseProgress.percentage}%` }}
          ></div>
        </div>
      </div>
    ) : (
      <div className="inline-flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-gray-700">
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">لم تبدأ بعد</span>
        <span className="text-xs text-gray-600">(0/10 دروس)</span>
      </div>
    )}
  </div>
)}
        </div>
      </main>
      <Footer />
    </>
  );
}