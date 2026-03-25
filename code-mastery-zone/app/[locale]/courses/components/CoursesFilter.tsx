// app/courses/components/CourseFilter.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterState {
  search: string;
  category: string;
  level: string;
  sortBy: 'popular' | 'newest' | 'price-low' | 'price-high';
}

interface CourseFilterProps {
  categories: { id: string; name: string; icon: string }[];
  levels: { id: string; name: string }[];
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  t: any;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ 
  categories, 
  levels, 
  onFilterChange,
  initialFilters = {},
  t
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    level: 'all',
    sortBy: 'popular',
    ...initialFilters
  });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      category: 'all',
      level: 'all',
      sortBy: 'popular' as const
    };
    setFilters(newFilters);
  };

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.level !== 'all' || filters.sortBy !== 'popular';

  return (
    <div className="bg-gray-800 rounded-xl p-4 mb-8">
      <div className="relative mb-4">
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t('search')}
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full bg-gray-700 text-white pr-12 pl-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="rtl"
        />
        {filters.search && (
          <button
            onClick={() => handleChange('search', '')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        className="lg:hidden w-full flex items-center justify-center gap-2 bg-gray-700 py-2 rounded-lg mb-4"
      >
        <Filter className="w-4 h-4" />
        {showMobileFilter ? t('hideFilters') : t('showFilters')}
      </button>

      <div className={`${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('categories.all')}
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {t(`categories.${cat.name}`) || cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('levels.all')}
            </label>
            <select
              value={filters.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {t(`levels.${level.id}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('sortBy.popular')}
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value as any)}
              className="w-full bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="rtl"
            >
              <option value="popular">{t('sortBy.popular')}</option>
              <option value="newest">{t('sortBy.newest')}</option>
              <option value="price-low">{t('sortBy.priceLow')}</option>
              <option value="price-high">{t('sortBy.priceHigh')}</option>
            </select>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-3 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {categories.filter(c => c.id !== 'all').length}
              </div>
              <div className="text-sm text-gray-400">{t('categories.all')}</div>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            {t('clearFilters')}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseFilter;