"use client";
import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonialsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Developer",
      image: "/api/placeholder/100/100",
      content: "The personalized roadmap helped me structure my learning journey perfectly. I went from a beginner to landing my first developer job in just 6 months!",
      stars: 5
    },
    {
      name: "Sarah Williams",
      role: "UX Designer",
      image: "/api/placeholder/100/100",
      content: "I love how the AI adapts to my learning style. The resume assistance feature helped me highlight skills I didn't even realize were valuable in my field.",
      stars: 5
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      image: "/api/placeholder/100/100",
      content: "The progress tracking kept me accountable, and the skill analytics highlighted areas I needed to improve. This platform has been invaluable for my career growth.",
      stars: 4
    },
    {
      name: "Jessica Patel",
      role: "Frontend Developer",
      image: "/api/placeholder/100/100",
      content: "I was skeptical about AI-generated learning paths, but this exceeded my expectations. The curriculum was perfectly tailored to my goals and experience level.",
      stars: 5
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden" ref={testimonialsRef}>
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-emerald-50 to-transparent dark:from-black dark:to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See how our platform has transformed learning journeys and careers
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <div 
              key={testimonial.name}
              className={`bg-emerald-50 dark:bg-gray-800 p-6 rounded-xl shadow-md border border-emerald-100 dark:border-emerald-900/20 transition-all duration-700 delay-${i * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col space-y-4">
                {/* Star rating */}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.stars ? "text-emerald-500 fill-emerald-500" : "text-gray-300 dark:text-gray-600"}
                    />
                  ))}
                </div>
                
                {/* Testimonial content */}
                <p className="text-gray-600 dark:text-gray-300 italic">
&quot;{testimonial.content}&quot;
                </p>
                
                {/* User info */}
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-200 dark:bg-emerald-700/30">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;