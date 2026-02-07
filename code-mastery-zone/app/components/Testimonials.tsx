// app/components/Testimonials.tsx
export default function Testimonials() {
  const testimonials = [
    {
      quote: '"I built my first website in just 3 weeks! The lessons are super fun and I love the challenges."',
      name: 'Sarah M.',
      role: 'Student, Age 11',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    {
      quote: '"As a parent, I\'m amazed at how much my son has learned. He\'s more confident and logical now."',
      name: 'James R.',
      role: 'Parent',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    {
      quote: '"The community is so helpful. Whenever I get stuck, there\'s always someone to help me out!"',
      name: 'Michael C.',
      role: 'Student, Age 13',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
  ];

  return (
    <section className="py-24 bg-slate-50" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="block text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Success Stories</span>
          <h2 className="text-4xl font-bold text-slate-900">Loved by Parents & Kids</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow duration-300">
              <i className="fas fa-quote-right absolute top-8 right-8 text-6xl text-indigo-500/10 transition-colors group-hover:text-indigo-500/20"></i>
              <p className="text-slate-700 mb-6 italic relative z-10 leading-relaxed min-h-[80px]">{testimonial.quote}</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-4 border-slate-50"
                />
                <div>
                  <h4 className="text-slate-800 font-semibold">{testimonial.name}</h4>
                  <p className="text-slate-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}