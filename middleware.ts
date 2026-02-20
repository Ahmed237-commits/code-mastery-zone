// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// إعداد الـ next-intl
const intlMiddleware = createMiddleware(routing);

// قائمة الدول العربية (ISO Alpha-2)
const ARABIC_COUNTRIES = [
  'SA','EG','AE','KW','QA','BH','OM','LB','JO','IQ',
  'YE','SY','PS','SD','LY','DZ','MA','TN','MR','KM','DJ','SO'
];

// اسم Cookie لحفظ اختيار المستخدم
const LOCALE_COOKIE = 'NEXT_LOCALE';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // تحديد الدولة من headers أو geo (Vercel/Cloudflare)
  const country = (
    (request as any).geo?.country ||
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    'US'
  ).toUpperCase();

  // نحط الدولة في headers عشان Server Components يقدروا يقرؤها
  request.headers.set('x-user-country', country);

  // فقط نتدخل على أول زيارة للـ root '/'
  if (pathname === '/') {
    const hasLocaleCookie = request.cookies.has(LOCALE_COOKIE);

    if (!hasLocaleCookie) {
      // نحدد اللغة حسب الدولة
      const isArabicCountry = ARABIC_COUNTRIES.includes(country);
      const locale = isArabicCountry ? 'ar' : 'en';

      // نعمل redirect للغة المناسبة
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}`;

      // نحط Cookie لحفظ اختيار المستخدم
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, locale, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365 // سنة كاملة
      });

      return response;
    }
  }

  // نمرر الطلب للـ next-intl Middleware
  return intlMiddleware(request);
}

// matcher لتحديد المسارات اللي نطبق عليها Middleware
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};