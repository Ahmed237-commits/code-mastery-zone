import CoursesFilter from '@/app/[locale]/courses/components/CoursesFilter';
import CourseCard from '@/app/[locale]/courses/components/CourseCard';
import { getCourses } from '@/app/lib/data';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function CoursesPage({
    params,
    searchParams,
}: {
    params: { locale: string };
    searchParams?: Promise<{
        q?: string;
        category?: string;
    }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations('Courses');

    const search = await searchParams;
    const query = search?.q || '';
    const category = search?.category || 'All';

    const courses = await getCourses(query, category);

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="block text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">
                        {t('tag')}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t('subtitle')}
                    </p>
                </div>

                <CoursesFilter />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseCard key={course.id as string} course={course} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                                <i className="fas fa-search text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noCourses')}</h3>
                            <p className="text-gray-500">
                                {t('tryAdjusting')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
