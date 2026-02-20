'use client';

import React from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const t = useTranslations('Dashboard');

  /* =======================
     Loading State
  ======================== */
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-lg">{t('loading')}</p>
      </div>
    );
  }

  /* =======================
     Not Signed In
  ======================== */
  if (!session) {
    return (
      <>
        <Header />

        <main className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
          <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-100 text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              {t('notSignedIn')}
            </h1>
            <p className="text-slate-600 mb-6">
              {t('notSignedInDesc')}
            </p>

            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              {t('signIn')}
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* =======================
     Dashboard Data
  ======================== */
  const activeCourse = {
    title: 'Python for Beginners',
    progress: 65,
    lessons: '12/20',
    image:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
  };

  const stats = [
    { label: t('stats.coursesInProgress'), value: '2', icon: 'fa-book-open', color: 'from-orange-400 to-pink-500' },
    { label: t('stats.completedCourses'), value: '5', icon: 'fa-check-circle', color: 'from-green-400 to-emerald-500' },
    { label: t('stats.certificatesEarned'), value: '3', icon: 'fa-certificate', color: 'from-blue-400 to-indigo-500' },
    { label: t('stats.pointsEarned'), value: '1,250', icon: 'fa-star', color: 'from-yellow-400 to-amber-500' },
  ];

  const recentActivity = [
    { title: t('activities.completedVariables'), date: t('timeAgo.twoHours'), icon: 'fa-check' },
    { title: t('activities.startedFunctions'), date: t('timeAgo.oneDay'), icon: 'fa-play' },
    { title: t('activities.earnedBadge'), date: t('timeAgo.threeDays'), icon: 'fa-trophy' },
  ];

  /* =======================
     Signed In – Dashboard
  ======================== */
  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 pt-24 pb-12">
        <div className="container mx-auto px-6">

          {/* Welcome */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {t('welcomeBack')}{' '}
              <span className="text-indigo-600">
                {session.user?.name || 'Student'}
              </span>{' '}
              👋
            </h1>
            <p className="text-slate-600">
              {t('welcomeSubtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl mb-4`}
                >
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">
                  {stat.value}
                </h3>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main */}
            <div className="lg:col-span-2 space-y-8">

              {/* Continue Learning */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  {t('continueLearning')}
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={activeCourse.image}
                    alt={activeCourse.title}
                    className="w-full md:w-48 h-32 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {activeCourse.title}
                    </h3>

                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                      <span>{activeCourse.progress}% {t('completed')}</span>
                      <span>{activeCourse.lessons}</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${activeCourse.progress}%` }}
                      />
                    </div>

                    <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg">
                      {t('resumeCourse')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">

              {/* Profile */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-indigo-600">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>

                <h3 className="font-bold">{session.user?.name}</h3>
                <p className="text-sm text-slate-500 mb-4">
                  {session.user?.email}
                </p>

                <Link
                  href="/profile"
                  className="block w-full py-2 border rounded-xl"
                >
                  {t('editProfile')}
                </Link>
              </div>

              {/* Activity */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-4">{t('recentActivity')}</h3>

                <div className="space-y-4">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <i className={`fas ${item.icon} text-slate-400 mt-1`} />
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
