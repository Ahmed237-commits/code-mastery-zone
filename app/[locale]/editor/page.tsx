'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MonacoEditor from '@monaco-editor/react';
import { 
  Save, FileText, Trash2, ChevronLeft, Plus, 
  Download, Upload, Edit, FolderOpen, Code2,
  Settings, Maximize2, Minimize2
} from 'lucide-react';

interface FileData {
  name: string;
  content: string;
  language: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript', icon: '📘' },
  { value: 'typescript', label: 'TypeScript', icon: '📘' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'csharp', label: 'C#', icon: '🎯' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'json', label: 'JSON', icon: '📋' },
  { value: 'markdown', label: 'Markdown', icon: '📝' },
];

export default function EditorPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [fileName, setFileName] = useState('program.js');
  const [language, setLanguage] = useState('javascript');
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // تحميل الملفات من localStorage عند بدء التشغيل
  useEffect(() => {
    const saved = localStorage.getItem('code_editor_files');
    if (saved) {
      try {
        const parsed: FileData[] = JSON.parse(saved);
        setFiles(parsed);
        if (parsed.length > 0) {
          setCurrentFile(parsed[0]);
          setEditorContent(parsed[0].content);
          setFileName(parsed[0].name);
          setLanguage(parsed[0].language || 'javascript');
        }
      } catch (e) {
        console.error('Failed to parse saved files', e);
      }
    }
  }, []);

  // حفظ كل الملفات إلى localStorage
  const saveToStorage = (updatedFiles: FileData[]) => {
    localStorage.setItem('code_editor_files', JSON.stringify(updatedFiles));
    setFiles(updatedFiles);
  };

  // حفظ الملف الحالي
  const handleSave = () => {
    if (!fileName.trim()) {
      alert('الرجاء إدخال اسم الملف');
      return;
    }

    const existingIndex = files.findIndex(f => f.name === fileName);
    const updatedFile: FileData = { name: fileName, content: editorContent, language };

    let updatedFiles: FileData[];
    if (existingIndex >= 0) {
      updatedFiles = [...files];
      updatedFiles[existingIndex] = updatedFile;
    } else {
      updatedFiles = [...files, updatedFile];
    }

    saveToStorage(updatedFiles);
    setCurrentFile(updatedFile);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  // تحميل ملف عند النقر
  const handleLoadFile = (file: FileData) => {
    setCurrentFile(file);
    setEditorContent(file.content);
    setFileName(file.name);
    setLanguage(file.language || 'javascript');
  };

  // حذف ملف
  const handleDeleteFile = (fileNameToDelete: string) => {
    const updated = files.filter(f => f.name !== fileNameToDelete);
    saveToStorage(updated);
    if (currentFile?.name === fileNameToDelete) {
      if (updated.length > 0) {
        handleLoadFile(updated[0]);
      } else {
        setCurrentFile(null);
        setEditorContent('');
        setFileName('program.js');
        setLanguage('javascript');
      }
    }
  };

  // إنشاء ملف جديد
  const handleNewFile = () => {
    setCurrentFile(null);
    setEditorContent('');
    setFileName('program.js');
    setLanguage('javascript');
  };

  // استيراد ملف من الجهاز
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

  // تصدير الملف الحالي
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

  // تبديل وضع ملء الشاشة
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* شريط العنوان */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/courses" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">الكورسات</span>
          </Link>
          <div className="h-6 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              محرر الأكواد المتقدم
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? 'تصغير' : 'تكبير'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={handleNewFile}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">ملف جديد</span>
          </button>
          <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">استيراد</span>
            <input type="file" accept=".txt,.js,.ts,.html,.css,.py,.java,.cpp,.c,.json,.md" onChange={handleImportFile} className="hidden" />
          </label>
          <button
            onClick={handleExportFile}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تصدير</span>
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1 overflow-hidden">
        {/* الشريط الجانبي - قائمة الملفات */}
        <aside className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col shadow-xl">
          <div className="p-4 border-b border-gray-700 bg-gray-900/50">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <FolderOpen className="w-5 h-5 text-yellow-400" />
              المستودع المحلي
              <span className="text-sm bg-gray-700 px-2 py-0.5 rounded-full ml-auto">{files.length}</span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {files.map((file) => {
              const langIcon = LANGUAGE_OPTIONS.find(l => l.value === file.language)?.icon || '📄';
              return (
                <div
                  key={file.name}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    currentFile?.name === file.name
                      ? 'bg-blue-600 shadow-lg scale-105'
                      : 'hover:bg-gray-700 hover:scale-102'
                  }`}
                  onClick={() => handleLoadFile(file)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{langIcon}</span>
                    <span className="truncate font-medium" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.name);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-600 rounded-lg transition-all"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {files.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>لا توجد ملفات</p>
                <p className="text-sm">أنشئ ملفاً جديداً للبدء</p>
              </div>
            )}
          </div>
        </aside>

        {/* منطقة المحرر الرئيسية */}
        <main className="flex-1 flex flex-col bg-gray-900">
          {/* شريط أدوات المحرر */}
          <div className="bg-gray-800 border-b border-gray-700 p-3 flex items-center gap-4 shadow-md">
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1.5">
              <span className="text-sm text-gray-400">📁</span>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-transparent text-white focus:outline-none w-48 text-sm font-medium"
                placeholder="اسم الملف"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1.5">
              <span className="text-sm text-gray-400">🌐</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white focus:outline-none text-sm font-medium"
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-gray-800">
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1" />
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all shadow-md ${
                isSaving
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'تم الحفظ ✓' : 'حفظ الملف'}
            </button>
          </div>

          {/* محرر Monaco */}
          <div className="flex-1 p-4 bg-gray-900">
            <div className="h-full rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl">
              <MonacoEditor
                height="100%"
                language={language}
                theme="vs-dark"
                value={editorContent}
                onChange={(value) => setEditorContent(value || '')}
                options={{
                  minimap: { enabled: true },
                  fontSize: 20,                     // خط كبير جداً
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  fontWeight: 'bold',                // عريض
                  lineHeight: 28,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  glyphMargin: false,
                  folding: true,
                  bracketPairColorization: { enabled: true },
                  autoClosingBrackets: 'always',
                  autoIndent: 'full',
                  formatOnPaste: true,
                  formatOnType: true,
                  renderWhitespace: 'selection',
                  smoothScrolling: true,
                  cursorBlinking: 'phase',
                  cursorStyle: 'line',
                }}
              />
            </div>
          </div>

          {/* شريط الحالة */}
          <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 text-sm text-gray-400 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>متصل</span>
            </div>
            <div>|</div>
            <div>{LANGUAGE_OPTIONS.find(l => l.value === language)?.icon} {language}</div>
            <div>|</div>
            <div>الطول: {editorContent.length} حرف</div>
            <div className="flex-1" />
            <div>⚡ حفظ تلقائي</div>
          </div>
        </main>
      </div>
    </div>
  );
}