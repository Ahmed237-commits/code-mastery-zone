// contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocale } from 'next-intl';

interface LanguageContextType {
  locale: string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <LanguageContext.Provider value={{ locale, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}