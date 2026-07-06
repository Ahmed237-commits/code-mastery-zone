// app/lib/data.ts
//
// طبقة الوصول للبيانات (Data Access Layer) الخاصة بالكورسات، النقاشات، والأسئلة الشائعة.
// كل الأنواع (types) وكل التعامل مع الـ API وكل الـ localStorage helpers موجودة هنا.

// =================================================================
// Config
// =================================================================

/**
 * عنوان الـ API الأساسي.
 * بيتقرأ من environment variable عشان يفرق بين local / staging / production
 * من غير ما نعدل الكود.
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** اللغات المدعومة في الموقع. */
export type Locale = "ar" | "en";

const DEFAULT_LOCALE: Locale = "ar";

// =================================================================
// Shared / Localization Types
// =================================================================

/** نص متعدد اللغات. أي حقل ممكن يتعرض للمستخدم بلغتين لازم يكون من النوع ده. */
export interface LocalizedString {
  ar: string;
  en: string;
}

/**
 * بيرجع النص بلغة معينة، مع fallback للغة الافتراضية لو مفيش ترجمة،
 * وبيدعم كمان استقبال string عادي (للتوافق مع بيانات قديمة).
 */
export function localize(
  value: LocalizedString | string | undefined | null,
  locale: Locale = DEFAULT_LOCALE
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value[DEFAULT_LOCALE] || "";
}

// =================================================================
// Core Domain Types
// =================================================================

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface CourseLessonInput {
  title: LocalizedString;
  content: LocalizedString;
  videoUrl?: string;
}

/** الشكل اللي بيرجع بيه الكورس من الـ API (زي ما هو مخزن في الداتابيز). */
export interface Course {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  tag: string;
  duration: LocalizedString;
  ageGroup: string;
  price: LocalizedString;
  lessons?: CourseLessonInput[];
  createdAt?: string;

  // خصائص إضافية للعرض (متضافة يدويًا في enrichCourse، مش جاية من الباك إند)
  level?: CourseLevel;
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
  syllabus?: CourseSyllabusWeek[];
}

export interface CourseSyllabusWeek {
  week: number;
  title: string;
  topics: string[];
}

/** الشكل المطلوب لإنشاء كورس جديد (نفس شكل Course بدون الحقول المولّدة تلقائيًا). */
export type CourseInput = Omit<
  Course,
  | "_id"
  | "createdAt"
  | "level"
  | "icon"
  | "isNew"
  | "popular"
  | "isFree"
  | "discount"
  | "originalPrice"
  | "instructor"
  | "instructorAvatar"
  | "rating"
  | "studentsCount"
  | "tagColor"
  | "whatYouWillLearn"
  | "requirements"
  | "syllabus"
>;

export interface Discussion {
  _id: string;
  theuser: {
    _id: string | undefined;
    name: string | null | undefined;
    avatar?: string;
  };
  title: string;
  excerpt: string;
  category: string;
  likes: number;
  comments: number[];
  likedBy: string[];
  createdAt: string | Date;
  time?: string;
}

export interface FAQ {
  _id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface CommunityStat {
  label: string;
  value: string;
  icon: string;
}

// =================================================================
// Generic API helper
// =================================================================

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends RequestInit {
  /** لو true، هيرجع null بدل ما يرمي error لما الـ response يكون 404. */
  treat404AsNull?: boolean;
}

/**
 * نداء موحّد لأي endpoint في الـ API.
 * بيوحّد الـ headers، الـ error handling، والـ logging عشان منكررش الكود ده
 * في كل دالة على حدة.
 */
async function apiFetch<T>(
  path: string,
  { treat404AsNull = false, headers, ...init }: ApiFetchOptions = {}
): Promise<T | null> {
  const url = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!res.ok) {
      if (res.status === 404 && treat404AsNull) return null;
      throw new ApiError(res.status, `Request failed: ${res.status} ${url}`);
    }

    // بعض الـ endpoints ممكن ترجع بدون body (زي DELETE)
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  } catch (error) {
    console.error(`[apiFetch] ${url} ->`, error);
    return null;
  }
}

// =================================================================
// Courses
// =================================================================

/**
 * بيضيف الخصائص الإضافية الخاصة بالعرض (level, icon, instructor, ...)
 * لكورس واحد. مستخدمة من getCourses و getCourseById عشان منكررش نفس المابنج مرتين.
 */
function enrichCourse(course: Course): Course {
  const priceAr = localize(course.price, "ar");

  return {
    ...course,
    level: mapAgeGroupToLevel(course.ageGroup),
    icon: getIconForTag(course.tag),
    isNew: isNewCourse(course._id),
    popular: isPopularCourse(course._id),
    isFree: isFreeCourse(priceAr),
    discount: getDiscount(course._id),
    originalPrice: !isFreeCourse(priceAr)
      ? String(Number(priceAr) * 2)
      : undefined,
    instructor: getInstructor(course._id),
    instructorAvatar: getInstructorAvatar(course._id),
    rating: getRating(course._id),
    studentsCount: getStudentsCount(course._id),
    tagColor: getTagColor(course.tag),
    whatYouWillLearn: getWhatYouWillLearn(course._id),
    requirements: getRequirements(course._id),
    syllabus: getSyllabus(course._id),
  };
}

export async function getCourses(
  query?: string,
  category?: string
): Promise<Course[]> {
  const data = await apiFetch<Course[]>("/courses");
  if (!data) return [];

  let courses = data.map(enrichCourse);

  if (category && category !== "All" && category !== "all") {
    courses = courses.filter(
      (course) => course.tag.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    courses = courses.filter(
      (course) =>
        localize(course.title, "ar").toLowerCase().includes(lowerQuery) ||
        localize(course.title, "en").toLowerCase().includes(lowerQuery) ||
        localize(course.description, "ar")
          .toLowerCase()
          .includes(lowerQuery) ||
        localize(course.description, "en").toLowerCase().includes(lowerQuery)
    );
  }

  return courses;
}

export async function getCourseById(id: string, token: string | null): Promise<Course | null> {
  const course = await apiFetch<Course>(`/courses/${id}`, {
    treat404AsNull: true,
  });
  return course ? enrichCourse(course) : null;
}

export async function createCourse(
  courseData: CourseInput
): Promise<Course | null> {
  return apiFetch<Course>("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
}

/** كورس تجريبي جاهز - "أساسيات البرمجة للمبتدئين". */
export function buildBasicProgrammingCourse(): CourseInput {
  return {
    title: {
      ar: "أساسيات البرمجة للمبتدئين",
      en: "Programming Basics for Beginners",
    },
    description: {
      ar: "دورة شاملة لتعلم أساسيات البرمجة من الصفر. ستتعلم المفاهيم الأساسية التي تحتاجها للبدء في أي لغة برمجة مع تطبيقات عملية.",
      en: "A comprehensive course to learn programming basics from scratch. You will learn the core concepts needed to start with any language.",
    },
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tag: "Programming",
    duration: { ar: "غير محدد", en: "Self-paced" },
    ageGroup: "13+",
    price: { ar: "مجاني", en: "Free" },
    lessons: [
      {
        title: { ar: "مقدمة في البرمجة", en: "Introduction to Programming" },
        content: {
          ar: "في هذا الدرس، ستتعرف على مفهوم البرمجة وأهميتها في العالم الحديث. سنشرح كيف يفكر المبرمج وكيف يتعامل مع المشكلات.",
          en: "In this lesson, you will discover the concept of programming and its importance. We will explain how programmers think.",
        },
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: {
          ar: "المتغيرات وأنواع البيانات",
          en: "Variables and Data Types",
        },
        content: {
          ar: "تعلم كيفية تخزين البيانات في البرمجة باستخدام المتغيرات. سنستعرض أنواع البيانات المختلفة مثل الأرقام والنصوص والقيم المنطقية.",
          en: "Learn how to store data using variables, and explore different data types such as numbers, strings, and booleans.",
        },
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: { ar: "الجمل الشرطية", en: "Conditional Statements" },
        content: {
          ar: "في هذا الدرس، ستتعلم كيفية اتخاذ القرارات في البرمجة باستخدام الجمل الشرطية if-else.",
          en: "In this lesson, you'll learn how to make decisions in code using if-else statements.",
        },
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: { ar: "الحلقات التكرارية", en: "Loops" },
        content: {
          ar: "تعلم كيفية تكرار تنفيذ الأوامر باستخدام الحلقات التكرارية مثل for و while.",
          en: "Learn how to repeat instructions using loops such as for and while.",
        },
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        title: { ar: "الدوال", en: "Functions" },
        content: {
          ar: "في هذا الدرس، ستتعلم كيفية تنظيم الكود باستخدام الدوال لجعله قابلاً لإعادة الاستخدام.",
          en: "In this lesson, you'll learn how to organize your code into reusable functions.",
        },
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ],
  };
}

/**
 * بتتأكد إن فيه كورسات موجودة، ولو مفيش بتنشئ الكورس التجريبي.
 * مفيد كـ seed script وقت الإعداد الأول للمشروع.
 */
export async function initializeCourses(): Promise<Course | null> {
  const existingCourses = await getCourses();

  if (existingCourses.length > 0) {
    console.log("Courses already exist:", existingCourses.length);
    return existingCourses[0];
  }

  console.log("No courses found. Creating sample course...");
  const newCourse = await createCourse(buildBasicProgrammingCourse());

  if (newCourse) {
    console.log("Sample course created successfully!");
  } else {
    console.error("Failed to create sample course.");
  }

  return newCourse;
}

// =================================================================
// Discussions
// =================================================================

export async function getDiscussions(): Promise<Discussion[]> {
  const data = await apiFetch<Discussion[]>("/discussions");
  return data ?? [];
}

// =================================================================
// FAQs
// =================================================================

export async function getFAQs(): Promise<FAQ[]> {
  const data = await apiFetch<FAQ[]>("/faqs");
  return data ?? [];
}

// =================================================================
// Categories & Levels
// =================================================================

export async function getCategories(): Promise<
  { id: string; name: string; icon: string }[]
> {
  try {
    const courses = await getCourses();
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
    console.error("Error building categories:", error);
    return [
      { id: "all", name: "جميع الكورسات", icon: "📚" },
      { id: "programming", name: "Programming", icon: "💻" },
      { id: "scratch", name: "Scratch", icon: "🐱" },
      { id: "python", name: "Python", icon: "🐍" },
      { id: "web", name: "Web", icon: "🌐" },
    ];
  }
}

export const levels: { id: CourseLevel | "all"; name: string }[] = [
  { id: "all", name: "جميع المستويات" },
  { id: "beginner", name: "مبتدئ" },
  { id: "intermediate", name: "متوسط" },
  { id: "advanced", name: "متقدم" },
];

// =================================================================
// Community Stats
// =================================================================

export const communityStats: CommunityStat[] = [
  { label: "Active Members", value: "15,000+", icon: "fas fa-users" },
  { label: "Courses Completed", value: "45k+", icon: "fas fa-graduation-cap" },
  { label: "Discussions Started", value: "12k+", icon: "fas fa-comments" },
  { label: "Questions Answered", value: "98%", icon: "fas fa-check-circle" },
];

export async function getCommunityStats(): Promise<CommunityStat[]> {
  // مؤقتًا mock data لحد ما يتوصل بالـ API الحقيقي
  return communityStats;
}

// =================================================================
// Display Helper Functions
// (منطق عرض بسيط - بعضها لسه placeholder لحد ما يتضاف منطق حقيقي
//  من الباك إند، زي عدد الطلاب الحقيقي أو تقييمات فعلية)
// =================================================================

function mapAgeGroupToLevel(ageGroup: string): CourseLevel {
  if (ageGroup.includes("6-8")) return "beginner";
  if (ageGroup.includes("9-12")) return "intermediate";
  if (ageGroup.includes("13+")) return "advanced";
  return "beginner";
}

const TAG_ICONS: Record<string, string> = {
  Programming: "💻",
  Scratch: "🐱",
  Python: "🐍",
  Web: "🌐",
  Robotics: "🤖",
  AI: "🧠",
};

function getIconForTag(tag: string): string {
  return TAG_ICONS[tag] ?? "📚";
}

const TAG_COLORS: Record<string, string> = {
  Programming: "blue",
  Scratch: "green",
  Python: "yellow",
  Web: "purple",
  Robotics: "orange",
  AI: "red",
};

function getTagColor(tag: string): string {
  return TAG_COLORS[tag] ?? "gray";
}

// TODO: استبدال الـ placeholders دي ببيانات حقيقية من الباك إند
// (تاريخ الإنشاء الفعلي، عدد الطلاب المسجلين، متوسط التقييمات...)

function isNewCourse(_courseId: string): boolean {
  return false;
}

function isPopularCourse(_courseId: string): boolean {
  return false;
}

function isFreeCourse(price: string): boolean {
  return price === "Free" || price === "مجاني" || price === "0";
}

function getDiscount(_courseId: string): number | undefined {
  return undefined;
}

const INSTRUCTORS: Record<string, string> = {};
function getInstructor(courseId: string): string {
  return INSTRUCTORS[courseId] ?? "ِAhmed Eissa";
}

const INSTRUCTOR_AVATARS: Record<string, string> = {};
function getInstructorAvatar(courseId: string): string {
  return INSTRUCTOR_AVATARS[courseId] ?? "https://i.pravatar.cc/150?img=1";
}

function getRating(_courseId: string): number {
  return 4.5;
}

function getStudentsCount(_courseId: string): number {
  return 0;
}

const LEARNING_OUTCOMES: Record<string, string[]> = {};
function getWhatYouWillLearn(courseId: string): string[] {
  return LEARNING_OUTCOMES[courseId] ?? ["محتوى قيد التحديث"];
}

const COURSE_REQUIREMENTS: Record<string, string[]> = {};
function getRequirements(courseId: string): string[] {
  return COURSE_REQUIREMENTS[courseId] ?? ["لا توجد متطلبات مسبقة"];
}

const COURSE_SYLLABUS: Record<string, CourseSyllabusWeek[]> = {};
function getSyllabus(courseId: string): CourseSyllabusWeek[] {
  return COURSE_SYLLABUS[courseId] ?? [];
}

// =================================================================
// localStorage helpers (safe wrapper)
// =================================================================

/**
 * غلاف آمن حول localStorage عشان:
 *  - منكررش شرط `typeof window === 'undefined'` في كل مكان.
 *  - نمسك أي error (زي private browsing أو quota exceeded) في مكان واحد.
 */
const safeStorage = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error(`[safeStorage.get] ${key}:`, error);
      return null;
    }
  },
  set(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[safeStorage.set] ${key}:`, error);
    }
  },
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  },
};

// =================================================================
// Course Progress (stored client-side in localStorage)
// =================================================================

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  lastLessonIndex?: number;
  percentage: number;
  updatedAt: string;
}

function progressKey(courseId: string): string {
  return `course_progress_${courseId}`;
}

export function getCourseProgress(courseId: string): CourseProgress | null {
  return safeStorage.get<CourseProgress>(progressKey(courseId));
}

export function saveCourseProgress(progress: CourseProgress): void {
  safeStorage.set(progressKey(progress.courseId), progress);
}

export function updateLessonProgress(
  courseId: string,
  lessonIndex: number,
  completed: boolean,
  totalLessons: number
): CourseProgress {
  const existing = getCourseProgress(courseId) ?? {
    courseId,
    completedLessons: [],
    percentage: 0,
    updatedAt: new Date().toISOString(),
  };

  const lessonId = lessonIndex.toString();
  const completedLessons = completed
    ? Array.from(new Set([...existing.completedLessons, lessonId]))
    : existing.completedLessons.filter((id) => id !== lessonId);

  const percentage =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  const updated: CourseProgress = {
    ...existing,
    completedLessons,
    lastLessonIndex: lessonIndex,
    percentage,
    updatedAt: new Date().toISOString(),
  };

  saveCourseProgress(updated);
  return updated;
}

export function markLessonAsCompleted(
  courseId: string,
  lessonIndex: number,
  totalLessons: number
): CourseProgress {
  return updateLessonProgress(courseId, lessonIndex, true, totalLessons);
}

/** بيرجع الكورس مع تقدم المستخدم فيه (لو مسجل دخول). */
export async function getCourseWithProgress(
  courseId: string,
  userId?: string
): Promise<{ course: Course | null; progress: unknown | null }> {
  const course = await getCourseById(courseId, safeStorage.getToken());

  if (!userId) {
    return { course, progress: null };
  }

  const token = safeStorage.getToken();
  if (!token) {
    return { course, progress: null };
  }

  const progress = await apiFetch<unknown>(
    `/users/progress/course/${courseId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return { course, progress };
}

// =================================================================
// Lessons (derived from Course.lessons)
// =================================================================

export interface Challenge {
  instructions: string;
  initialCode: string;
  solution: string;
}

export interface LessonContentDetails {
  video?: string;
  explanation: string;
  codeExample: string;
  challenge?: Challenge;
}

export interface Lesson {
  id: string; // index الدرس كنص
  title: string;
  description?: string;
  duration?: string;
  order: number;
  content: LessonContentDetails;
}

/** بتحوّل مصفوفة lessons الخام (جاية من الكورس) لشكل الـ Lesson اللي بتستخدمه صفحة العرض. */
function mapLessons(course: Course | null, locale: Locale = DEFAULT_LOCALE): Lesson[] {
  if (!course?.lessons) return [];

  return course.lessons.map((lesson, index) => {
    const title = localize(lesson.title, locale);
    return {
      id: index.toString(),
      title,
      description: localize(course.description, locale),
      duration: "10", // قيمة افتراضية لدقائق الدرس لحد ما تتضاف بيانات حقيقية
      order: index + 1,
      content: {
        video: lesson.videoUrl ?? "",
        explanation: localize(lesson.content, locale),
        codeExample: `// مثال تطبيقي لـ ${title}\nconsole.log("مرحباً بك في درس: ${title}");`,
        challenge: {
          instructions:
            "اكتب كود يقوم بطباعة نص في الـ console باستخدام console.log",
          initialCode: "// اكتب كود الحل هنا\n",
          solution: 'console.log("Hello World");',
        },
      },
    };
  });
}

export async function getCourseLessons(
  courseId: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Lesson[]> {
  const course = await getCourseById(courseId, safeStorage.getToken());
  return mapLessons(course, locale);
}

export async function getLessonById(
  courseId: string,
  lessonId: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<Lesson | null> {
  const lessons = await getCourseLessons(courseId, locale);
  return lessons.find((l) => l.id === lessonId) ?? null;
}

export async function getNextLesson(
  courseId: string,
  currentLessonId: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<Lesson | null> {
  const lessons = await getCourseLessons(courseId, locale);
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  return currentIndex !== -1 ? lessons[currentIndex + 1] ?? null : null;
}

export async function getPreviousLesson(
  courseId: string,
  currentLessonId: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<Lesson | null> {
  const lessons = await getCourseLessons(courseId, locale);
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  return currentIndex > 0 ? lessons[currentIndex - 1] : null;
}

// =================================================================
// Quizzes / Knowledge checks (mock content for the learning flow)
// =================================================================

export interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index الإجابة الصحيحة
  explanation?: string;
}

export interface Quiz {
  _id: string;
  lessonId: string;
  title: string;
  questions: Question[];
  passingScore: number; // نسبة النجاح، مثلاً 70
}

export type VideoPageType = "knowledge-check" | "content" | "quiz";

export interface VideoPageContent {
  introduction: string;
  sections: {
    title: string;
    body: string;
    codeExample?: string;
  }[];
  summary: string;
}

export interface VideoPage {
  _id: string;
  courseId: string;
  lessonId: string;
  type: VideoPageType;
  title: string;
  checkQuestion?: string; // لو type === 'knowledge-check'
  content?: VideoPageContent; // لو type === 'content'
  quiz?: Quiz; // لو type === 'quiz'
  order: number;
}

// Mock data لصفحة الدرس الأول - "أساسيات البرمجة".
// TODO: نقل البيانات دي للباك إند بدل ما تكون hardcoded هنا.
const MOCK_VIDEO_PAGES: Record<string, VideoPage[]> = {
  "67d2856c5413fc370b786b16": [
    {
      _id: "page-1",
      courseId: "67d2856c5413fc370b786b16",
      lessonId: "lesson-1",
      type: "knowledge-check",
      title: "اختبار المعرفة المسبقة",
      checkQuestion: "هل لديك معرفة سابقة بأساسيات البرمجة؟",
      order: 1,
    },
    {
      _id: "page-2",
      courseId: "67d2856c5413fc370b786b16",
      lessonId: "lesson-1",
      type: "content",
      title: "مقدمة في البرمجة",
      content: {
        introduction:
          "البرمجة هي عملية كتابة تعليمات وتوجيهات لجهاز الحاسوب لتنفيذ مهام محددة. تعتبر البرمجة لغة التواصل مع الحاسوب.",
        sections: [
          {
            title: "ما هي البرمجة؟",
            body: "البرمجة (Programming) هي عملية إنشاء برامج وتطبيقات الحاسوب باستخدام لغات برمجة معينة. المبرمج يكتب تعليمات يفهمها الحاسوب وينفذها.\n\nمثال بسيط: عندما تطلب من الحاسوب حساب 5 + 3، هو لا يفهم هذه العملية بشكل طبيعي، لكن بلغة البرمجة تكتبها بطريقة يفهمها.",
            codeExample:
              '// مثال بسيط\nlet x = 5;\nlet y = 3;\nlet sum = x + y;\nconsole.log("الناتج = " + sum);',
          },
          {
            title: "لماذا نتعلم البرمجة؟",
            body: "البرمجة تفتح لك آفاق جديدة:\n• تبني تطبيقات وألعاب خاصة بك\n• تفكر بطريقة منطقية ومنظمة\n• تحل المشكلات بطرق إبداعية\n• فرص عمل ممتازة",
          },
          {
            title: "أساسيات أي لغة برمجة",
            body: "كل لغات البرمجة تشترك في مفاهيم أساسية:\n1. المتغيرات (Variables): لتخزين البيانات\n2. الجمل الشرطية (Conditions): لاتخاذ القرارات\n3. الحلقات (Loops): لتكرار الأوامر\n4. الدوال (Functions): لتنظيم الكود",
          },
        ],
        summary:
          "البرمجة مهارة أساسية في العصر الحديث. بتعلمك التفكير المنطقي وحل المشكلات. في الدروس القادمة هنتعلم كل مفهوم بالتفصيل مع أمثلة عملية.",
      },
      order: 2,
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
              "لعب الألعاب",
            ],
            correctAnswer: 1,
            explanation:
              "البرمجة هي عملية كتابة تعليمات وتوجيهات لجهاز الحاسوب لتنفيذ مهام محددة.",
          },
          {
            _id: "q2",
            text: "أي من التالي يعتبر مثالاً على المتغيرات؟",
            options: [
              "let name = 'أحمد'",
              "if (x > 5)",
              "for (let i=0; i<5; i++)",
              "function sayHello()",
            ],
            correctAnswer: 0,
            explanation: "المتغيرات تستخدم لتخزين البيانات، مثل let name = 'أحمد'",
          },
          {
            _id: "q3",
            text: "ماذا تستخدم لاتخاذ القرارات في البرمجة؟",
            options: ["المتغيرات", "الدوال", "الجمل الشرطية", "الحلقات"],
            correctAnswer: 2,
            explanation:
              "الجمل الشرطية مثل if-else تستخدم لاتخاذ القرارات في البرمجة.",
          },
        ],
      },
      order: 3,
    },
  ],
};

export async function getVideoPage(
  courseId: string,
  _lessonId: string,
  step: number
): Promise<VideoPage | null> {
  const coursePages = MOCK_VIDEO_PAGES[courseId] ?? [];
  return coursePages.find((p) => p.order === step) ?? null;
}