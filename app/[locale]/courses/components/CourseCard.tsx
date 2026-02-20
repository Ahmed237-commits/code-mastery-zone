import { Course } from '@/app/lib/data';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    const t = useTranslations('CourseCard');

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col group h-full">
            <div className="relative h-52 overflow-hidden">
                <span className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 backdrop-blur-sm z-10">
                    {course.tag}
                </span>
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between mb-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <i className="far fa-clock"></i> {course.duration}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <i className="fas fa-signal"></i> {course.age}
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 subpixel-antialiased leading-relaxed">
                    {course.description}
                </p>
                <div className="border-t border-gray-100 pt-5 flex justify-between items-center">
                    <span className="text-xl font-bold text-indigo-600 font-sans">{course.price}</span>
                    <a
                        href="#"
                        className="text-slate-700 font-semibold no-underline flex items-center gap-1.5 text-sm transition-all duration-300 hover:text-indigo-600 hover:gap-2.5"
                    >
                        {t('viewCourse')} <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}
