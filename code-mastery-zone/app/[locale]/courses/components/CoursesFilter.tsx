'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useTranslations } from 'next-intl';

const categories = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const t = useTranslations('Courses');

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category && category !== 'All') {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        defaultValue={searchParams.get('q')?.toString()}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Category Filters */}
                <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto max-w-full">
                    {categories.map((cat) => {
                        const isActive =
                            cat === 'All'
                                ? !searchParams.get('category')
                                : searchParams.get('category') === cat;

                        return (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                {t(`categories.${cat}`)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
