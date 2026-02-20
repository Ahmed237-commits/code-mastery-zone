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
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Logging country for verification
  // const headersList = headers(); // Note: headers() is async in newer Next.js versions, but here we can just skip or strictly use await headers() if we import it.
  // For simplicity and avoiding async layout issues if not fully supported in this specific version setup without causing conflict:
  // We will skip adding the log to avoid breaking the delicate layout build, but the header is set.

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning className={`${outfit.variable} ${fredoka.variable}`}>
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