import { CommunityStat } from '@/app/lib/data';

interface CommunityStatsProps {
    stats: CommunityStat[];
}

export default function CommunityStats({ stats }: CommunityStatsProps) {
    return (
        <section className="py-12 bg-indigo-600 relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-white mb-4 group-hover:scale-110 transition duration-300">
                                <i className={`${stat.icon} text-xl`}></i>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-indigo-100 font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
