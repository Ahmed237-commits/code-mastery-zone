// app/[locale]/layout.tsx
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { NextAuthProvider } from '../components/NextAuthProvider';
import type { Metadata } from 'next';
import { Outfit, Fredoka } from 'next/font/google';
import Header from '../components/Header';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: 'CodeMastery',
  description: 'Free programming academy for kids and adults to learn coding through fun, interactive lessons.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Use next-intl's getMessages() which correctly reads from i18n/request.ts
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${outfit.variable} ${fredoka.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <NextAuthProvider>
            <Header />
            {children}
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}