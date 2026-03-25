// app/lib/data.ts
import { ReactNode } from "react";

const API_BASE_URL = "http://localhost:8000/api";

export interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  duration: string;
  ageGroup: string;
  price: string;
  lessons?: {
    title: string;
    content: string;
    videoUrl?: string;
  }[];
  createdAt?: string;

  // خصائص إضافية للعرض (هنضيفها يدوياً)
  level?: "beginner" | "intermediate" | "advanced";
  icon?: string;
  isNew?: boolean;
  popular?: boolean;
  isFree?: boolean;
  discount?: number;
  originalPrice?: string;
  instructor?: string;
  instructorAvatar?: string;
  rating?: number;
  studentsCount?: number;
  tagColor?: string;
  whatYouWillLearn?: string[];
  requirements?: string[];
  syllabus?: {
    week: number;
    title: string;
    topics: string[];
  }[];
}

export interface Discussion {
  _id: string;
  theuser: {
    _id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  excerpt: string;
  category: string;
  likes: number;
  comments: number;
  likedBy: string[];
  createdAt: string;
  time?: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

export interface CommunityStat {
  label: string;
  value: string;
  icon: string;
}

// ===============================
// Fetch Courses
// ===============================

export async function getCourses(
  query?: string,
  category?: string
): Promise<Course[]> {
  try {
    const url = `${API_BASE_URL}/courses`;
    
    console.log('Fetching courses from:', url);

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);

    let data: Course[] = await res.json();

    // إضافة الخصائص المحسنة للعرض
    data = data.map((course) => ({
      ...course,
      level: mapAgeGroupToLevel(course.ageGroup),
      icon: getIconForTag(course.tag),
      isNew: isNewCourse(course._id),
      popular: isPopularCourse(course._id),
      isFree: isFreeCourse(course.price),
      discount: getDiscount(course._id),
      originalPrice: course.price !== 'Free' ? String(Number(course.price) * 2) : undefined,
      instructor: getInstructor(course._id),
      instructorAvatar: getInstructorAvatar(course._id),
      rating: getRating(course._id),
      studentsCount: getStudentsCount(course._id),
      tagColor: getTagColor(course.tag),
      whatYouWillLearn: getWhatYouWillLearn(course._id),
      requirements: getRequirements(course._id),
      syllabus: getSyllabus(course._id),
    }));

    // filter category
    if (category && category !== "All" && category !== "all") {
      data = data.filter(
        (course) =>
          course.tag.toLowerCase() === category.toLowerCase()
      );
    }

    // search
    if (query) {
      const lowerQuery = query.toLowerCase();
      data = data.filter(
        (course) =>
          course.title.toLowerCase().includes(lowerQuery) ||
          course.description.toLowerCase().includes(lowerQuery)
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

// ===============================
// Get Single Course
// ===============================

export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch course: ${res.status}`);
    }

    const course: Course = await res.json();
    
    // Add enhanced properties
    return {
      ...course,
      level: mapAgeGroupToLevel(course.ageGroup),
      icon: getIconForTag(course.tag),
      isNew: isNewCourse(course._id),
      popular: isPopularCourse(course._id),
      isFree: isFreeCourse(course.price),
      discount: getDiscount(course._id),
      originalPrice: course.price !== 'Free' ? String(Number(course.price) * 2) : undefined,
      instructor: getInstructor(course._id),
      instructorAvatar: getInstructorAvatar(course._id),
      rating: getRating(course._id),
      studentsCount: getStudentsCount(course._id),
      tagColor: getTagColor(course.tag),
      whatYouWillLearn: getWhatYouWillLearn(course._id),
      requirements: getRequirements(course._id),
      syllabus: getSyllabus(course._id),
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

// ===============================
// Create Course
// ===============================

export async function createCourse(courseData: {
  title: string;
  description: string;
  image: string;
  tag: string;
  duration: string;
  ageGroup: string;
  price: string;
  lessons?: {
    title: string;
    content: string;
    videoUrl?: string;
  }[];
}): Promise<Course | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    if (!res.ok) throw new Error(`Failed to create course: ${res.status}`);

    return res.json();
  } catch (error) {
    console.error("Error creating course:", error);
    return null;
  }
}

// ===============================
// Create New Course (Basic Programming)
// ===============================

export async function createBasicProgrammingCourse() {
  const courseData = {
    title: "أساسيات البرمجة للمبتدئين",
    description: "دورة شاملة لتعلم أساسيات البرمجة من الصفر. ستتعلم المفاهيم الأساسية التي تحتاجها للبدء في أي لغة برمجة مع تطبيقات عملية.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Programming",
    duration: "غير محدد",
    ageGroup: "13+",
    price: "مجاني",
    lessons: [
      {
        title: "مقدمة في البرمجة",
        content: "في هذا الدرس، ستتعرف على مفهوم البرمجة وأهميتها في العالم الحديث. سنشرح كيف يفكر المبرمج وكيف يتعامل مع المشكلات.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        title: "المتغيرات وأنواع البيانات",
        content: "تعلم كيفية تخزين البيانات في البرمجة باستخدام المتغيرات. سنستعرض أنواع البيانات المختلفة مثل الأرقام والنصوص والقيم المنطقية.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        title: "الجمل الشرطية",
        content: "في هذا الدرس، ستتعلم كيفية اتخاذ القرارات في البرمجة باستخدام الجمل الشرطية if-else.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        title: "الحلقات التكرارية",
        content: "تعلم كيفية تكرار تنفيذ الأوامر باستخدام الحلقات التكرارية مثل for و while.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        title: "الدوال",
        content: "في هذا الدرس، ستتعلم كيفية تنظيم الكود باستخدام الدوال لجعله قابلاً لإعادة الاستخدام.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ]
  };

  return await createCourse(courseData);
}

// ===============================
// Discussions (لو موجودة)
// ===============================

export async function getDiscussions(): Promise<Discussion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/discussions`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch discussions: ${res.status}`);

    return res.json();
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return [];
  }
}

// ===============================
// FAQ (لو موجودة)
// ===============================

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/faqs`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch FAQs: ${res.status}`);

    return res.json();
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

// ===============================
// Categories (من الكورسات)
// ===============================

export async function getCategories(): Promise<
  { id: string; name: string; icon: string }[]
> {
  try {
    const courses = await getCourses();
    
    // استخراج التصنيفات الفريدة
    const uniqueTags = [...new Set(courses.map((c) => c.tag))];

    return [
      { id: "all", name: "جميع الكورسات", icon: "📚" },
      ...uniqueTags.map((tag) => ({
        id: tag.toLowerCase(),
        name: tag,
        icon: getIconForTag(tag),
      })),
    ];
  } catch (error) {
    console.error("Error fetching categories:", error);
    
    // Return default categories if API fails
    return [
      { id: "all", name: "جميع الكورسات", icon: "📚" },
      { id: "programming", name: "Programming", icon: "💻" },
      { id: "scratch", name: "Scratch", icon: "🐱" },
      { id: "python", name: "Python", icon: "🐍" },
      { id: "web", name: "Web", icon: "🌐" },
    ];
  }
}

// ===============================
// Levels
// ===============================

export const levels = [
  { id: "all", name: "جميع المستويات" },
  { id: "beginner", name: "مبتدئ" },
  { id: "intermediate", name: "متوسط" },
  { id: "advanced", name: "متقدم" },
];

// ===============================
// Community Stats
// ===============================

export const communityStats: CommunityStat[] = [
  { label: "Active Members", value: "15,000+", icon: "fas fa-users" },
  { label: "Courses Completed", value: "45k+", icon: "fas fa-graduation-cap" },
  { label: "Discussions Started", value: "12k+", icon: "fas fa-comments" },
  { label: "Questions Answered", value: "98%", icon: "fas fa-check-circle" },
];

export async function getCommunityStats(): Promise<CommunityStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return communityStats;
}

// ===============================
// Helper Functions (دوال مساعدة للعرض)
// ===============================

function mapAgeGroupToLevel(ageGroup: string): "beginner" | "intermediate" | "advanced" {
  if (ageGroup.includes("6-8")) return "beginner";
  if (ageGroup.includes("9-12")) return "intermediate";
  if (ageGroup.includes("13+")) return "advanced";
  return "beginner";
}

function getIconForTag(tag: string): string {
  const icons: Record<string, string> = {
    Programming: "💻",
    Scratch: "🐱",
    Python: "🐍",
    Web: "🌐",
    Robotics: "🤖",
    AI: "🧠",
    default: "📚",
  };
  return icons[tag] || icons.default;
}

function isNewCourse(courseId: string): boolean {
  // هتشتغل على أساس الـ ID أو تاريخ الإنشاء
  return false; // مؤقتاً
}

function isPopularCourse(courseId: string): boolean {
  // هتشتغل على أساس عدد الطلاب أو المشاهدات
  return false; // مؤقتاً
}

function isFreeCourse(price: string): boolean {
  return price === 'Free' || price === 'مجاني' || price === '0';
}

function getDiscount(courseId: string): number | undefined {
  // لو عاوز تضيف خصم لكورسات معينة
  return undefined;
}

function getInstructor(courseId: string): string {
  const instructors: Record<string, string> = {
    // هتضيف هنا حسب الـ IDs
  };
  return instructors[courseId] || "فريق أكاديمية البرمجة";
}

function getInstructorAvatar(courseId: string): string {
  const avatars: Record<string, string> = {
    // هتضيف هنا حسب الـ IDs
  };
  return avatars[courseId] || "https://i.pravatar.cc/150?img=1";
}

function getRating(courseId: string): number {
  return 4.5; // قيمة افتراضية
}

function getStudentsCount(courseId: string): number {
  return 1000; // قيمة افتراضية
}

function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    Programming: "blue",
    Scratch: "green",
    Python: "yellow",
    Web: "purple",
    Robotics: "orange",
    AI: "red",
  };
  return colors[tag] || "gray";
}

function getWhatYouWillLearn(courseId: string): string[] {
  const learningOutcomes: Record<string, string[]> = {
    // هتضيف هنا حسب الـ IDs
  };
  return learningOutcomes[courseId] || ["محتوى قيد التحديث"];
}

function getRequirements(courseId: string): string[] {
  const requirements: Record<string, string[]> = {
    // هتضيف هنا حسب الـ IDs
  };
  return requirements[courseId] || ["لا توجد متطلبات مسبقة"];
}

function getSyllabus(courseId: string): { week: number; title: string; topics: string[] }[] {
  const syllabus: Record<string, { week: number; title: string; topics: string[] }[]> = {
    // هتضيف هنا حسب الـ IDs
  };
  return syllabus[courseId] || [];
}

// ===============================
// Course Progress Management (localStorage)
// ===============================

export interface CourseProgress {
  courseId: string;
  completedLessons: string[]; // هنا هنخزن أرقام الدروس المكتملة
  lastLessonIndex?: number;
  percentage: number;
  updatedAt: string;
}

export function getCourseProgress(courseId: string): CourseProgress | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const progress = localStorage.getItem(`course_progress_${courseId}`);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    console.error('Error getting course progress:', error);
    return null;
  }
}

export function saveCourseProgress(progress: CourseProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`course_progress_${progress.courseId}`, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving course progress:', error);
  }
}

export function updateLessonProgress(
  courseId: string, 
  lessonIndex: number, 
  completed: boolean,
  totalLessons: number
): CourseProgress {
  const existingProgress = getCourseProgress(courseId) || {
    courseId,
    completedLessons: [],
    percentage: 0,
    updatedAt: new Date().toISOString()
  };

  let completedLessons = [...existingProgress.completedLessons];
  const lessonId = lessonIndex.toString();
  
  if (completed && !completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  } else if (!completed) {
    completedLessons = completedLessons.filter(id => id !== lessonId);
  }

  const percentage = Math.round((completedLessons.length / totalLessons) * 100);

  const newProgress: CourseProgress = {
    ...existingProgress,
    completedLessons,
    lastLessonIndex: lessonIndex,
    percentage,
    updatedAt: new Date().toISOString()
  };

  saveCourseProgress(newProgress);
  return newProgress;
}
// app/lib/data.ts - أضف هذه الدالة

// ===============================
// Initialize Courses (شغل هذه الدالة مرة واحدة)
// ===============================

export async function initializeCourses() {
  try {
    // 1. جلب الكورسات الموجودة
    const existingCourses = await getCourses();
    
    // 2. لو مفيش كورسات، أنشئ الكورس الجديد
    if (existingCourses.length === 0) {
      console.log('No courses found. Creating sample courses...');
      
      // كورس أساسيات البرمجة
      const basicProgramming = await createCourse({
        title: "أساسيات البرمجة للمبتدئين",
        description: "دورة شاملة لتعلم أساسيات البرمجة من الصفر. ستتعلم المفاهيم الأساسية التي تحتاجها للبدء في أي لغة برمجة مع تطبيقات عملية.",
        image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        tag: "Programming",
        duration: "غير محدد",
        ageGroup: "13+",
        price: "مجاني",
        lessons: [
          {
            title: "مقدمة في البرمجة",
            content: "في هذا الدرس، ستتعرف على مفهوم البرمجة وأهميتها في العالم الحديث. سنشرح كيف يفكر المبرمج وكيف يتعامل مع المشكلات.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            title: "المتغيرات وأنواع البيانات",
            content: "تعلم كيفية تخزين البيانات في البرمجة باستخدام المتغيرات. سنستعرض أنواع البيانات المختلفة مثل الأرقام والنصوص والقيم المنطقية.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            title: "الجمل الشرطية",
            content: "في هذا الدرس، ستتعلم كيفية اتخاذ القرارات في البرمجة باستخدام الجمل الشرطية if-else.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            title: "الحلقات التكرارية",
            content: "تعلم كيفية تكرار تنفيذ الأوامر باستخدام الحلقات التكرارية مثل for و while.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          },
          {
            title: "الدوال",
            content: "في هذا الدرس، ستتعلم كيفية تنظيم الكود باستخدام الدوال لجعله قابلاً لإعادة الاستخدام.",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ]
      });

      console.log('Sample courses created successfully!');
      return basicProgramming;
    } else {
      console.log('Courses already exist:', existingCourses.length);
      return existingCourses[0];
    }
  } catch (error) {
    console.error('Error initializing courses:', error);
    return null;
  }
}
// أضف في ملف app/lib/data.ts

export interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct answer
  explanation?: string;
}

export interface Quiz {
  _id: string;
  lessonId: string;
  title: string;
  questions: Question[];
  passingScore: number; // مثلاً 70%
}

export interface VideoPage {
  _id: string;
  courseId: string;
  lessonId: string;
  type: 'knowledge-check' | 'content' | 'quiz';
  title: string;
  
  // لو type = 'knowledge-check'
  checkQuestion?: string;
  
  // لو type = 'content'
  content?: {
    introduction: string;
    sections: {
      title: string;
      body: string;
      codeExample?: string;
    }[];
    summary: string;
  };
  
  // لو type = 'quiz'
  quiz?: Quiz;
  
  order: number;
}

// ===============================
// Mock Data للصفحة التعليمية
// ===============================

export const getVideoPage = async (courseId: string, lessonId: string, step: number): Promise<VideoPage | null> => {
  // محاكاة API
  const pages: Record<string, VideoPage[]> = {
    "67d2856c5413fc370b786b16": [ // اساسيات البرمجة
      {
        _id: "page-1",
        courseId: "67d2856c5413fc370b786b16",
        lessonId: "lesson-1",
        type: "knowledge-check",
        title: "اختبار المعرفة المسبقة",
        checkQuestion: "هل لديك معرفة سابقة بأساسيات البرمجة؟",
        order: 1
      },
      {
        _id: "page-2",
        courseId: "67d2856c5413fc370b786b16",
        lessonId: "lesson-1",
        type: "content",
        title: "مقدمة في البرمجة",
        content: {
          introduction: "البرمجة هي عملية كتابة تعليمات وتوجيهات لجهاز الحاسوب لتنفيذ مهام محددة. تعتبر البرمجة لغة التواصل مع الحاسوب.",
          sections: [
            {
              title: "ما هي البرمجة؟",
              body: "البرمجة (Programming) هي عملية إنشاء برامج وتطبيقات الحاسوب باستخدام لغات برمجة معينة. المبرمج يكتب تعليمات يفهمها الحاسوب وينفذها.\n\nمثال بسيط: عندما تطلب من الحاسوب حساب 5 + 3، هو لا يفهم هذه العملية بشكل طبيعي، لكن بلغة البرمجة تكتبها بطريقة يفهمها.",
              codeExample: "// مثال بسيط\nlet x = 5;\nlet y = 3;\nlet sum = x + y;\nconsole.log(\"الناتج = \" + sum);"
            },
            {
              title: "لماذا نتعلم البرمجة؟",
              body: "البرمجة تفتح لك آفاق جديدة:\n• تبني تطبيقات وألعاب خاصة بك\n• تفكر بطريقة منطقية ومنظمة\n• تحل المشكلات بطرق إبداعية\n• فرص عمل ممتازة"
            },
            {
              title: "أساسيات أي لغة برمجة",
              body: "كل لغات البرمجة تشترك في مفاهيم أساسية:\n1. المتغيرات (Variables): لتخزين البيانات\n2. الجمل الشرطية (Conditions): لاتخاذ القرارات\n3. الحلقات (Loops): لتكرار الأوامر\n4. الدوال (Functions): لتنظيم الكود"
            }
          ],
          summary: "البرمجة مهارة أساسية في العصر الحديث. بتعلمك التفكير المنطقي وحل المشكلات. في الدروس القادمة هنتعلم كل مفهوم بالتفصيل مع أمثلة عملية."
        },
        order: 2
      },
      {
        _id: "page-3",
        courseId: "67d2856c5413fc370b786b16",
        lessonId: "lesson-1",
        type: "quiz",
        title: "اختبار الدرس الأول",
        quiz: {
          _id: "quiz-1",
          lessonId: "lesson-1",
          title: "اختبار أساسيات البرمجة",
          passingScore: 70,
          questions: [
            {
              _id: "q1",
              text: "ما هي البرمجة؟",
              options: [
                "كتابة النصوص",
                "كتابة تعليمات للحاسوب لتنفيذ مهام محددة",
                "تصميم المواقع فقط",
                "لعب الألعاب"
              ],
              correctAnswer: 1,
              explanation: "البرمجة هي عملية كتابة تعليمات وتوجيهات لجهاز الحاسوب لتنفيذ مهام محددة."
            },
            {
              _id: "q2",
              text: "أي من التالي يعتبر مثالاً على المتغيرات؟",
              options: [
                "let name = 'أحمد'",
                "if (x > 5)",
                "for (let i=0; i<5; i++)",
                "function sayHello()"
              ],
              correctAnswer: 0,
              explanation: "المتغيرات تستخدم لتخزين البيانات، مثل let name = 'أحمد'"
            },
            {
              _id: "q3",
              text: "ماذا تستخدم لاتخاذ القرارات في البرمجة؟",
              options: [
                "المتغيرات",
                "الدوال",
                "الجمل الشرطية",
                "الحلقات"
              ],
              correctAnswer: 2,
              explanation: "الجمل الشرطية مثل if-else تستخدم لاتخاذ القرارات في البرمجة."
            }
          ]
        },
        order: 3
      }
    ]
  };
  
  const coursePages = pages[courseId] || [];
  return coursePages.find(p => p.order === step) || null;
};
// app/lib/data.ts

// ===============================
// Get Course with User Progress
// ===============================
export async function getCourseWithProgress(courseId: string, userId?: string) {
  try {
    const course = await getCourseById(courseId);
    
    if (!userId) {
      return { course, progress: null };
    }

    // جلب تقدم المستخدم من الباك إند
    const token = localStorage.getItem('token');
    if (!token) {
      return { course, progress: null };
    }

    const res = await fetch(`${API_BASE_URL}/users/progress/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return { course, progress: null };
    }

    const progress = await res.json();
    
    return { course, progress };
  } catch (error) {
    console.error('Error fetching course with progress:', error);
    return { course: null, progress: null };
  }
}
export function markLessonAsCompleted(
  courseId: string, 
  lessonIndex: number, 
  totalLessons: number
): CourseProgress {
  return updateLessonProgress(courseId, lessonIndex, true, totalLessons);
}