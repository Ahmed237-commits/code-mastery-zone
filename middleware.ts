
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// List of Arabic country codes (ISO 3166-1 alpha-2)
const ARABIC_COUNTRIES = [
    'SA', 'EG', 'AE', 'KW', 'QA', 'BH', 'OM', 'LB', 'JO', 'IQ',
    'YE', 'SY', 'PS', 'SD', 'LY', 'DZ', 'MA', 'TN', 'MR', 'KM',
    'DJ', 'SO'
];

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get country from headers (Vercel or Cloudflare) or default to US
    const country = (
        (request as any).geo?.country ||
        request.headers.get('x-vercel-ip-country') ||
        request.headers.get('cf-ipcountry') ||
        'US'
    ).toUpperCase();

    // Add country to request headers so it can be read in Server Components (e.g. Layout)
    request.headers.set('x-user-country', country);

    // We only want to intervene on the root path '/' for the first visit
    if (pathname === '/') {
        // Check if the user has already chosen a locale (cookie exists)
        const hasLocaleCookie = request.cookies.has('NEXT_LOCALE');

        if (!hasLocaleCookie) {
            // Check if the user is from an Arabic-speaking country
            const isArabicCountry = ARABIC_COUNTRIES.includes(country);

            if (isArabicCountry) {
                // Redirect to Arabic locale
                const url = request.nextUrl.clone();
                url.pathname = '/ar';
                return NextResponse.redirect(url);
            }
        }
    }

    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
