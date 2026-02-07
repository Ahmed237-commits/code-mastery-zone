// app/layout.tsx
import './globals.css';
import { NextAuthProvider } from './components/NextAuthProvider';
import type { Metadata } from 'next';
import { Outfit, Fredoka } from 'next/font/google';
import Header from './components/Header';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${fredoka.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <NextAuthProvider>
        <Header />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}