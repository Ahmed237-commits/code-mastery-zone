// 'use client';

// import React from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// export default function DashboardPage() {
//     const { data: session } = useSession();

//     const activeCourse = {
//         title: 'Python for Beginners',
//         progress: 65,
//         lessons: '12/20 Lessons',
//         image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800'
//     };

//     const stats = [
//         { label: 'Courses in Progress', value: '2', icon: 'fa-book-open', color: 'from-orange-400 to-pink-500' },
//         { label: 'Completed Courses', value: '5', icon: 'fa-check-circle', color: 'from-green-400 to-emerald-500' },
//         { label: 'Certificates Earned', value: '3', icon: 'fa-certificate', color: 'from-blue-400 to-indigo-500' },
//         { label: 'Points Earned', value: '1,250', icon: 'fa-star', color: 'from-yellow-400 to-amber-500' },
//     ];

//     const recentActivity = [
//         { title: 'Completed "Variables & Data Types"', date: '2 hours ago', icon: 'fa-check' },
//         { title: 'Started "Python Functions"', date: '1 day ago', icon: 'fa-play' },
//         { title: 'Earned "Fast Learner" Badge', date: '3 days ago', icon: 'fa-trophy' },
//     ];

//     return (
// <>
// {session?(
//     <>
//     <Header />
//     <main className="min-h-screen bg-slate-50 pt-24 pb-12">
//         <div className="container mx-auto px-6">
//             {/* Welcome Section */}
//             <div className="mb-10">
//                         <h1 className="text-3xl font-bold text-slate-800 mb-2">
//                             Welcome back, <span className="text-indigo-600">{session?.user?.name || 'Student'}</span>! 👋
//                         </h1>
//                         <p className="text-slate-600">Here's what's happening with your learning journey today.</p>
//                     </div>

//                     {/* Stats Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//                         {stats.map((stat, index) => (
//                             <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
//                                 <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl mb-4 shadow-lg shadow-indigo-500/10`}>
//                                     <i className={`fas ${stat.icon}`}></i>
//                                 </div>
//                                 <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
//                                 <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {/* Main Content Area */}
//                         <div className="lg:col-span-2 space-y-8">

//                             {/* Continue Learning */}
//                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
//                                     <Link href="/courses" className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">View All</Link>
//                                 </div>

//                                 <div className="flex flex-col md:flex-row gap-6 items-center">
//                                     <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shadow-md flex-shrink-0 relative group">
//                                         <img src={activeCourse.image} alt={activeCourse.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                                             <i className="fas fa-play text-white text-2xl drop-shadow-lg"></i>
//                                         </div>
//                                     </div>
//                                     <div className="flex-1 w-full">
//                                         <h3 className="text-lg font-bold text-slate-800 mb-2">{activeCourse.title}</h3>
//                                         <div className="flex justify-between text-sm text-slate-500 mb-2">
//                                             <span>{activeCourse.progress}% Completed</span>
//                                             <span>{activeCourse.lessons}</span>
//                                         </div>
//                                         <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
//                                             <div
//                                                 className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
//                                                 style={{ width: `${activeCourse.progress}%` }}
//                                             ></div>
//                                         </div>
//                                         <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
//                                             Resume Course
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Recommended Section (Simple Placeholder for now) */}
//                             <div className="bg-indigo-900 rounded-2xl p-8 relative overflow-hidden">
//                                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
//                                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
//                                     <div className="text-white">
//                                         <h2 className="text-2xl font-bold mb-2">Unlock Pro Features</h2>
//                                         <p className="text-indigo-200 mb-6 max-w-md">Get unlimited access to all courses, projects, and career paths with our Pro plan.</p>
//                                         <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-xl">
//                                             Upgrade to Pro
//                                         </button>
//                                     </div>
//                                     <div className="text-8xl text-indigo-500 opacity-20">
//                                         <i className="fas fa-crown"></i>
//                                     </div>
//                                 </div>
//                             </div>

//                         </div>

//                         {/* Sidebar */}
//                         <div className="space-y-8">
//                             {/* Profile Card (Mini) */}
//                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
//                                 <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mb-4">
//                                     {session?.user?.image ? (
//                                         <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
//                                     ) : (
//                                         <span className="text-2xl font-bold text-indigo-600">{session?.user?.name?.charAt(0) || 'U'}</span>
//                                     )}
//                                 </div>
//                                 <h3 className="text-lg font-bold text-slate-800">{session?.user?.name || 'Guest User'}</h3>
//                                 <p className="text-slate-500 text-sm mb-4">{session?.user?.email || 'Start your journey'}</p>
//                                 <Link href="/profile" className="block w-full py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
//                                     Edit Profile
//                                 </Link>
//                             </div>

//                             {/* Recent Activity */}
//                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//                                 <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
//                                 <div className="space-y-4">
//                                     {recentActivity.map((activity, i) => (
//                                         <div key={i} className="flex items-start gap-4">
//                                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
//                                                 <i className={`fas ${activity.icon} text-xs`}></i>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-semibold text-slate-800">{activity.title}</h4>
//                                                 <p className="text-xs text-slate-400">{activity.date}</p>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <Footer />
// </>
// ):(


//    );

// }
'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  /* =======================
     Loading State
  ======================== */
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-lg">Loading...</p>
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
              You are not signed in
            </h1>
            <p className="text-slate-600 mb-6">
              Please sign in to access your dashboard and continue learning.
            </p>

            <Link
              href="/signin"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Sign In
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
    lessons: '12/20 Lessons',
    image:
      'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
  };

  const stats = [
    { label: 'Courses in Progress', value: '2', icon: 'fa-book-open', color: 'from-orange-400 to-pink-500' },
    { label: 'Completed Courses', value: '5', icon: 'fa-check-circle', color: 'from-green-400 to-emerald-500' },
    { label: 'Certificates Earned', value: '3', icon: 'fa-certificate', color: 'from-blue-400 to-indigo-500' },
    { label: 'Points Earned', value: '1,250', icon: 'fa-star', color: 'from-yellow-400 to-amber-500' },
  ];

  const recentActivity = [
    { title: 'Completed "Variables & Data Types"', date: '2 hours ago', icon: 'fa-check' },
    { title: 'Started "Python Functions"', date: '1 day ago', icon: 'fa-play' },
    { title: 'Earned "Fast Learner" Badge', date: '3 days ago', icon: 'fa-trophy' },
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
              Welcome back,{' '}
              <span className="text-indigo-600">
                {session.user?.name || 'Student'}
              </span>{' '}
              👋
            </h1>
            <p className="text-slate-600">
              Here's what's happening with your learning journey today.
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
                  Continue Learning
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
                      <span>{activeCourse.progress}% Completed</span>
                      <span>{activeCourse.lessons}</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${activeCourse.progress}%` }}
                      />
                    </div>

                    <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg">
                      Resume Course
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
                  Edit Profile
                </Link>
              </div>

              {/* Activity */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-4">Recent Activity</h3>

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
