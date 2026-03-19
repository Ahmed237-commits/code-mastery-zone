// app/courses/CoursesContent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import MonacoEditor from '@monaco-editor/react';
import { 
  Code2, Loader2, LayoutGrid, List, Home, 
  ChevronLeft, BookOpen, Sparkles, TrendingUp,
  Clock, Filter as FilterIcon, Users, 
  FileText, Save, Plus, Trash2, Download, Upload, 
  FolderOpen, Eye, EyeOff, Play, Terminal, Copy, X
} from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ChatBot from '@/app/components/chatbot';
import { getCourses, getCategories, levels } from '@/app/lib/data';
import CourseCard from './components/CourseCard';
import CourseFilter from './components/CoursesFilter';

interface FilterState {
  search: string;
  category: string;
  level: string;
  sortBy: 'popular' | 'newest' | 'price-low' | 'price-high';
}

interface EditorFile {
  name: string;
  content: string;
  language: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript', icon: '📘' },
  { value: 'typescript', label: 'TypeScript', icon: '📘' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'jsx', label: 'JSX', icon: '⚛️' },
  { value: 'tsx', label: 'TSX', icon: '⚛️' },
];

export default function CoursesContent() {
  const t = useTranslations('Courses');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    level: searchParams.get('level') || 'all',
    sortBy: (searchParams.get('sortBy') as any) || 'popular'
  });

  // حالة المحرر
  const [showEditor, setShowEditor] = useState(false);
  const [showUserCode, setShowUserCode] = useState(false);
  const [editorContent, setEditorContent] = useState('// اكتب كودك هنا\nconsole.log("مرحباً بالعالم");');
  const [fileName, setFileName] = useState('script.js');
  const [language, setLanguage] = useState('javascript');
  const [savedFiles, setSavedFiles] = useState<EditorFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // تحميل الملفات المحفوظة
  useEffect(() => {
    const saved = localStorage.getItem('course_editor_files');
    if (saved) {
      try {
        setSavedFiles(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved files', e);
      }
    }
  }, []);

  // حفظ الملف
  const handleSaveFile = () => {
    if (!fileName.trim()) return;
    
    const existingIndex = savedFiles.findIndex(f => f.name === fileName);
    const newFile = { name: fileName, content: editorContent, language };
    
    let updated: EditorFile[];
    if (existingIndex >= 0) {
      updated = [...savedFiles];
      updated[existingIndex] = newFile;
    } else {
      updated = [...savedFiles, newFile];
    }
    
    setSavedFiles(updated);
    localStorage.setItem('course_editor_files', JSON.stringify(updated));
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  // تحميل ملف
  const handleLoadFile = (file: EditorFile) => {
    setFileName(file.name);
    setEditorContent(file.content);
    setLanguage(file.language);
  };

  // حذف ملف
  const handleDeleteFile = (index: number) => {
    const updated = savedFiles.filter((_, i) => i !== index);
    setSavedFiles(updated);
    localStorage.setItem('course_editor_files', JSON.stringify(updated));
  };

  // إنشاء ملف جديد
  const handleNewFile = () => {
    setFileName('new-file.js');
    setEditorContent('// اكتب كودك هنا\n');
    setLanguage('javascript');
  };

  // استيراد ملف
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const name = file.name;
      const ext = name.split('.').pop() || '';
      const lang = LANGUAGE_OPTIONS.find(opt => opt.value.includes(ext))?.value || 'javascript';
      
      setFileName(name);
      setEditorContent(content);
      setLanguage(lang);
    };
    reader.readAsText(file);
  };

  // تصدير الملف
  const handleExportFile = () => {
    if (!editorContent) return;
    const blob = new Blob([editorContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // نسخ الكود
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // تشغيل الكود (محاكاة)
  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput([]);
    
    setTimeout(() => {
      const output = [
        '> تنفيذ الكود...',
        '> --------------------',
        ...editorContent.split('\n').map(line => `  ${line}`),
        '> --------------------',
        '✅ تم التنفيذ بنجاح',
        '📤 الإخراج:',
        '  مرحباً بالعالم',
        `  عدد الأحرف: ${editorContent.length}`,
      ];
      setConsoleOutput(output);
      setIsRunning(false);
    }, 1000);
  };

  // جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesData, categoriesData] = await Promise.all([
          getCourses(),
          getCategories()
        ]);
        setCourses(coursesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // فلترة وترتيب الكورسات
  useEffect(() => {
    let filtered = [...courses];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(course => 
        course.tag?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.level !== 'all') {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : 0;
          const priceB = typeof b.price === 'number' ? b.price : 0;
          return priceB - priceA;
        });
        break;
    }

    setFilteredCourses(filtered);

    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.level !== 'all') params.set('level', filters.level);
    if (filters.sortBy !== 'popular') params.set('sortBy', filters.sortBy);
    
    router.push(`/courses?${params.toString()}`, { scroll: false });

  }, [filters, courses, router]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const getSelectedCategoryName = () => {
    if (filters.category === 'all') return t('categories.all');
    const category = categories.find(c => c.id === filters.category);
    return category ? t(`categories.${category.name}`) : filters.category;
  };

  const getSelectedLevelName = () => {
    if (filters.level === 'all') return t('levels.all');
    return t(`levels.${filters.level}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-xl">{t('title')}</p>
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
      <main className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <Link href="/" className="flex items-center gap-1 text-gray-400 hover:text-blue-400">
                <Home className="w-4 h-4" />
                <span>{t('home')}</span>
              </Link>
              <ChevronLeft className="w-4 h-4 text-gray-600" />
              <Link href="/courses" className="flex items-center gap-1 text-gray-400 hover:text-blue-400">
                <BookOpen className="w-4 h-4" />
                <span>{t('title')}</span>
              </Link>
              {filters.category !== 'all' && (
                <>
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                  <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                    <FilterIcon className="w-3 h-3" />
                    {getSelectedCategoryName()}
                  </span>
                </>
              )}
              {filters.level !== 'all' && (
                <>
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                  <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {getSelectedLevelName()}
                  </span>
                </>
              )}
              {filters.search && (
                <>
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                  <span className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                    بحث: {filters.search}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <Code2 className="absolute top-10 left-10 w-32 h-32 text-white transform rotate-12" />
            <BookOpen className="absolute bottom-10 right-10 w-32 h-32 text-white transform -rotate-12" />
          </div>

          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 mb-6 border border-white/20">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'كورس' : 'كورسات'} متاحة
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                {t('subtitle')}
              </p>

              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm">أحدث الكورسات</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">تحديث مستمر</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">+5000 طالب</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Filter Component */}
          <CourseFilter 
            categories={categories}
            levels={levels}
            onFilterChange={handleFilterChange}
            initialFilters={filters}
            t={t}
          />

          {/* View Mode Toggle وزر المحرر */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('allCourses')}
              </h2>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'كورس' : 'كورس'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-gray-400">
                عرض {filteredCourses.length} من أصل {courses.length} كورس
              </div>

              <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                {/* زر عرض الكود (الخاص بالمستخدم) */}
                <button
                  onClick={() => setShowUserCode(!showUserCode)}
                  className={`p-2 rounded-lg transition-all ${
                    showUserCode ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  }`}
                  title={showUserCode ? 'إخفاء الكود' : 'عرض الكود'}
                >
                  <Eye className="w-5 h-5" />
                </button>
                
                {/* زر المحرر */}
                <button
                  onClick={() => setShowEditor(!showEditor)}
                  className={`p-2 rounded-lg transition-all ${
                    showEditor ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  }`}
                  title={showEditor ? 'إخفاء المحرر' : 'فتح المحرر'}
                >
                  <Code2 className="w-5 h-5" />
                </button>
                
                {/* أزرار تغيير العرض */}
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  }`}
                  title={t('viewMode.grid')}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  }`}
                  title={t('viewMode.list')}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* قسم عرض الكود بشكل موقع ويب مصغر */}
          {showUserCode && (
            <div className="mb-8">
              <div className="bg-gray-800 rounded-xl overflow-hidden border-2 border-green-500/30 shadow-2xl">
                {/* شريط المتصفح */}
                <div className="bg-gray-700 px-4 py-3 flex items-center gap-2 border-b border-gray-600">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="bg-gray-600 rounded-full px-4 py-1 text-xs text-gray-300 flex items-center gap-2 max-w-md mx-auto">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="truncate">localhost:3000/editor/{fileName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={handleCopyCode} className="p-1 hover:bg-gray-600 rounded-lg" title="نسخ">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={handleRunCode} disabled={isRunning} className="p-1 hover:bg-gray-600 rounded-lg disabled:opacity-50" title="تشغيل">
                      <Play className="w-4 h-4" />
                    </button>
                    <button onClick={() => setShowUserCode(false)} className="p-1 hover:bg-gray-600 rounded-lg" title="إغلاق">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* محتوى الصفحة - مقسم لنافذتين */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[500px]">
                  {/* نافذة الكود */}
                  <div className="bg-gray-900 overflow-hidden flex flex-col border-l border-gray-700">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">{fileName}</span>
                      <span className="text-xs text-gray-500 mr-auto">{language}</span>
                    </div>
                    <div className="flex-1 overflow-auto p-4 font-mono text-sm text-green-400">
                      <pre className="h-full">
                        <code>{editorContent || '// لا يوجد كود بعد'}</code>
                      </pre>
                    </div>
                  </div>

                  {/* نافذة المخرجات */}
                  <div className="bg-gray-950 overflow-hidden flex flex-col">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">المخرجات</span>
                    </div>
                    <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-black/50">
                      {consoleOutput.length > 0 ? (
                        consoleOutput.map((line, i) => (
                          <div key={i} className={`${
                            line.startsWith('✅') ? 'text-green-400' : 
                            line.startsWith('📤') ? 'text-yellow-400' : 
                            line.startsWith('>') ? 'text-blue-400' : 'text-gray-300'
                          }`}>
                            {line}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-center py-8">
                          <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>اضغط على ▶️ لتشغيل الكود</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* شريط الحالة */}
                <div className="bg-gray-700 px-4 py-1.5 text-xs text-gray-400 flex items-center justify-between border-t border-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      متصل
                    </span>
                    <span>|</span>
                    <span>{LANGUAGE_OPTIONS.find(l => l.value === language)?.icon} {language}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>الطول: {editorContent.length} حرف</span>
                    <span>|</span>
                    <span>الأسطر: {editorContent.split('\n').length}</span>
                    {copied && (
                      <>
                        <span>|</span>
                        <span className="text-green-400">تم النسخ ✓</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* محرر الأكواد (يظهر فقط عند الضغط على زر المحرر) */}
          {showEditor && (
            <div className="mb-8">
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <button onClick={handleNewFile} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-sm">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">جديد</span>
                  </button>
                  
                  <label className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-sm cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">استيراد</span>
                    <input type="file" accept=".txt,.js,.ts,.html,.css,.py" onChange={handleImportFile} className="hidden" />
                  </label>
                  
                  <button onClick={handleExportFile} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-sm">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">تصدير</span>
                  </button>
                  
                  <div className="h-6 w-px bg-gray-700 mx-2" />
                  
                  <div className="flex items-center gap-1 bg-gray-700 rounded-lg px-2 py-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} className="bg-transparent text-white text-sm focus:outline-none w-28" placeholder="script.js" />
                  </div>
                  
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-gray-700 text-white text-sm px-2 py-1 rounded-lg">
                    {LANGUAGE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                    ))}
                  </select>
                  
                  <button onClick={handleSaveFile} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${isSaving ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    <Save className="w-4 h-4" />
                    {isSaving ? 'تم' : 'حفظ'}
                  </button>
                </div>

                {savedFiles.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" />
                      الملفات المحفوظة:
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {savedFiles.map((file, index) => (
                        <div key={index} className="group flex items-center gap-1 bg-gray-700 hover:bg-gray-600 rounded-lg px-2 py-1 text-xs cursor-pointer" onClick={() => handleLoadFile(file)}>
                          <FileText className="w-3 h-3" />
                          <span className="truncate max-w-24">{file.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(index); }} className="opacity-0 group-hover:opacity-100 hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-80 rounded-lg overflow-hidden border border-gray-700">
                  <MonacoEditor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={editorContent}
                    onChange={(value) => setEditorContent(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: 'JetBrains Mono, monospace',
                      automaticLayout: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                    }}
                  />
                </div>
                
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>الطول: {editorContent.length} حرف</span>
                  <span>{LANGUAGE_OPTIONS.find(l => l.value === language)?.icon} {language}</span>
                </div>
              </div>
            </div>
          )}

          {/* Courses Grid/List */}
          {filteredCourses.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn' 
                : 'flex flex-col gap-4 animate-fadeIn'
            }>
              {filteredCourses.map((course, index) => (
                <div key={course._id} className="transform transition-all duration-500 hover:scale-105 hover:z-10" style={{ animationDelay: `${index * 100}ms` }}>
                  <CourseCard course={course} variant={viewMode} t={t} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
              <div className="relative">
                <Code2 className="w-20 h-20 mx-auto text-gray-600 mb-4 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('noCourses')}</h3>
              <p className="text-gray-400 mb-6">{t('noCoursesDesc')}</p>
              <button onClick={() => setFilters({ search: '', category: 'all', level: 'all', sortBy: 'popular' })} className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                <span>{t('viewAll')}</span>
                <Sparkles className="w-4 h-4 inline mr-2 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}