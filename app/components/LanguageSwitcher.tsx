'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';
import { FaGlobe } from 'react-icons/fa'

export default function LanguageSwitcher() {
    const t = useTranslations('LanguageSwitcher');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = event.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <div className="relative">
            <label className="sr-only">{t('label')}</label>
            <FaGlobe className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none' />
            <select
                defaultValue={locale}
                className="bg-transparent py-2 pl-3 pr-8 rounded-full border border-gray-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 text-sm font-medium appearance-none cursor-pointer transition-colors hover:border-indigo-300 dark:hover:border-indigo-700"
                onChange={onSelectChange}
                disabled={isPending}
            >
                <option value="en" className="dark:bg-slate-900 dark:text-white font-sans font-semibold">{t('en')}</option>
                <option value="ar" className="dark:bg-slate-900 dark:text-white font-sans font-semibold">{t('ar')}</option>
            </select>
        </div>
    );
}
