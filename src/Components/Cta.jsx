"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  const ctaRef = useRef(null);
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

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-black dark:to-emerald-950 relative overflow-hidden" ref={ctaRef}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${ 
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95' 
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
            Ready to Start Your Personalized Learning Journey?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Join thousands of learners who've transformed their skills and careers with our expert-led courses.
            Get started today and unlock your full potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center bg-white text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/courses" 
              className="inline-flex items-center justify-center bg-transparent border border-white text-white hover:bg-white/10 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Explore Courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-white/70">
            No credit card required. 7-day free trial on all premium courses.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;