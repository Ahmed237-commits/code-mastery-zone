import { getDiscussions, getCommunityStats } from '@/app/lib/data';
import CommunityHero from './components/CommunityHero';
import DiscussionCard from './components/DiscussionCard';
import CommunityStats from './components/CommunityStats';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata = {
    title: 'Community | Code Mastery Zone',
    description: 'Join our vibrant tech community, share your knowledge, and grow together.',
};

export default async function CommunityPage({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Community');

    const [discussions, statsData] = await Promise.all([
        getDiscussions(),
        getCommunityStats(),
    ]);

    const stats = statsData.map(stat => {
        let labelKey = '';
        if (stat.label === 'Active Members') labelKey = 'stats.members';
        else if (stat.label === 'Courses Completed') labelKey = 'stats.courses';
        else if (stat.label === 'Discussions Started') labelKey = 'stats.discussions';
        else if (stat.label === 'Questions Answered') labelKey = 'stats.answers';

        return {
            ...stat,
            label: labelKey ? t(labelKey) : stat.label
        };
    });

    return (
        <main className="min-h-screen bg-white">
            <CommunityHero />

            <CommunityStats stats={stats} />

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                {t('page.recentDiscussions')}
                            </h2>
                            <p className="text-gray-600">
                                {t('page.exploreSubtitle')}
                            </p>
                        </div>
                        <div className="flex bg-white p-1.5 rounded-xl border border-gray-200">
                            <button className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg transition">
                                {t('page.filterLatest')}
                            </button>
                            <button className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-lg transition">
                                {t('page.filterTrending')}
                            </button>
                            <button className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-lg transition">
                                {t('page.filterMyTopics')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {discussions.map((discussion) => (
                            <DiscussionCard key={discussion._id} discussion={discussion} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">
                            {t('page.viewAll')}
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
