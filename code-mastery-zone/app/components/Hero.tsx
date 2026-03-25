import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden" id="home">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-3/4 h-3/4 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-3/4 h-3/4 bg-indigo-500/10 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">

          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 order-2 lg:order-1">

            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 gap-2 animate-fade-in-up">
              <i className="fas fa-star text-[10px] sm:text-xs"></i> 
              <span className="whitespace-nowrap">{t('badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight animate-fade-in-up [animation-delay:100ms]">
              {t('title')}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-8 sm:mb-10 max-w-lg lg:max-w-xl animate-fade-in-up [animation-delay:200ms]">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto animate-fade-in-up [animation-delay:300ms]">
              <Link 
                href="/signUp" 
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base"
              >
                {t('cta')}
              </Link>
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-sm sm:text-base"
              >
                <i className="fas fa-play mr-2 group-hover:scale-110 transition-transform text-xs sm:text-sm"></i> 
                {t('learnMore')}
              </a>
            </div>
          </div>

          {/* Hero Image & Floating Cards */}
          <div className="relative mt-8 sm:mt-12 lg:mt-0 perspective-1000 order-1 lg:order-2">
            
            {/* Floating Elements - متجاوب بالكامل مع الموبايل */}
            <div className="relative w-full h-full min-h-[280px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px]">
              
              {/* Card 1 - Courses Completed */}
              <div className="absolute top-0 sm:top-2 md:top-4 right-0 sm:right-[-5px] md:right-[-10px] lg:right-[-30px] 
                              bg-white/95 dark:bg-slate-800/95 backdrop-blur-md 
                              p-2 sm:p-3 md:p-4 
                              rounded-xl sm:rounded-2xl 
                              shadow-lg sm:shadow-xl 
                              flex items-center gap-2 sm:gap-3 
                              animate-float-card-1 
                              z-20 
                              border border-white/50 dark:border-slate-700/50 
                              max-w-[150px] sm:max-w-[170px] md:max-w-[200px] lg:max-w-none
                              hover:scale-105 transition-transform duration-300
                              cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                                rounded-lg sm:rounded-xl 
                                bg-gradient-to-br from-indigo-500 to-purple-600 
                                flex items-center justify-center text-white 
                                shadow-lg">
                  <i className="fas fa-check text-xs sm:text-sm md:text-base"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-slate-800 dark:text-slate-100 
                                font-bold text-[10px] sm:text-[11px] md:text-xs lg:text-sm 
                                truncate">
                    {t('coursesCompleted')}
                  </h5>
                  <p className="text-slate-500 dark:text-slate-400 
                                text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs 
                                font-medium truncate">
                    {t('coursesLessons')}
                  </p>
                </div>
              </div>

              {/* Card 2 - Active Students */}
              <div className="absolute bottom-0 sm:bottom-2 md:bottom-4 lg:bottom-8 
                              left-0 sm:left-[-5px] md:left-[-10px] lg:left-[-40px] 
                              bg-white/95 dark:bg-slate-800/95 backdrop-blur-md 
                              p-2 sm:p-3 md:p-4 
                              rounded-xl sm:rounded-2xl 
                              shadow-lg sm:shadow-xl 
                              flex items-center gap-2 sm:gap-3 
                              animate-float-card-2 
                              z-20 
                              border border-white/50 dark:border-slate-700/50 
                              max-w-[150px] sm:max-w-[170px] md:max-w-[200px] lg:max-w-none
                              hover:scale-105 transition-transform duration-300
                              cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                                rounded-lg sm:rounded-xl 
                                bg-gradient-to-br from-pink-500 to-rose-500 
                                flex items-center justify-center text-white 
                                shadow-lg">
                  <i className="fas fa-user-graduate text-xs sm:text-sm md:text-base"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-slate-800 dark:text-slate-100 
                                font-bold text-[10px] sm:text-[11px] md:text-xs lg:text-sm 
                                truncate">
                    {t('activeStudents')}
                  </h5>
                  <p className="text-slate-500 dark:text-slate-400 
                                text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs 
                                font-medium truncate">
                    {t('activeStudentsCount')}
                  </p>
                </div>
              </div>
              
              {/* Optional: Add a decorative element or image */}
              <div className="flex items-center justify-center h-full">
                <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180 leading-none pointer-events-none">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[40px] sm:h-[60px] lg:h-[120px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white dark:fill-slate-900"
          ></path>
        </svg>
      </div>
    </section>
  );
}