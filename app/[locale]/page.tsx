// app/page.tsx
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Courses from '../components/Courses';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { setRequestLocale } from 'next-intl/server';
import ChatBot from '../components/chatbot';
export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <main>
      <ChatBot />
        <Hero />
        <Features />
        <Courses />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}