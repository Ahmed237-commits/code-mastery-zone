import { getFAQs } from '@/app/lib/data';

export const metadata = {
    title: 'FAQ | Code Mastery Zone',
    description: 'Frequently asked questions about Code Mastery Zone courses and community.',
};

export default async function FAQPage() {
    const faqs = await getFAQs();

    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                        Support Center
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Frequently Asked <span className="text-indigo-600">Questions</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about our courses, platform, and community. Can't find what you're looking for? Reach out to our team.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                                    Q
                                </span>
                                {faq.question}
                            </h3>
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8"></span>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-3xl mx-auto mt-20 p-10 rounded-3xl bg-indigo-600 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
                        <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
                            We're here to help! Send us a message and we'll get back to you as soon as possible.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
