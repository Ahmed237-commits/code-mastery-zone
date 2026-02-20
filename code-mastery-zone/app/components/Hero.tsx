import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
  const t = useTranslations('Hero');
  const tHeader = useTranslations('Header'); // Reuse for Sign Up / Login if needed, or keeping it separate

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" id="home">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-3/4 h-3/4 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-3/4 h-3/4 bg-indigo-500/10 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10">

            <div className="inline-flex items-center px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-full text-sm font-semibold mb-8 gap-2 animate-fade-in-up">
              <i className="fas fa-star text-xs"></i> #1 Coding Academy for everyone
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up [animation-delay:100ms]">
              {t('title')}
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-lg lg:max-w-xl animate-fade-in-up [animation-delay:200ms]">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up [animation-delay:300ms]">
              <Link href="/signUp" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300">
                {t('cta')}
              </Link>
              <a href="#" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-indigo-600 font-semibold border-2 border-transparent hover:border-indigo-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <i className="fas fa-play mr-2 group-hover:scale-110 transition-transform"></i> {t('learnMore')}
              </a>
            </div>
          </div>

          {/* Hero Image & Floating Cards */}
          <div className="relative mt-12 lg:mt-0 perspective-1000">
            {/* Floating Elements */}
            <div className="absolute top-6 right-[-10px] sm:right-[-30px] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed z-20 border border-white/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg">
                <i className="fas fa-check"></i>
              </div>
              <div>
                <h5 className="text-slate-800 font-bold text-sm">Courses Completed</h5>
                <p className="text-slate-500 text-xs font-medium">12k+ Lessons</p>
              </div>
            </div>

            <div className="absolute bottom-10 left-[-10px] sm:left-[-40px] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-20 border border-white/50 [animation-duration:7s]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-lg shadow-lg">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div>
                <h5 className="text-slate-800 font-bold text-sm">Active Students</h5>
                <p className="text-slate-500 text-xs font-medium">5,000+ Worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180 leading-none">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] sm:h-[120px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}
