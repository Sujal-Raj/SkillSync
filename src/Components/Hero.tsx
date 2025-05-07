"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-28 lg:pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white dark:from-black dark:to-emerald-950 -z-10" />
      
      {/* Decorative particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-10 dark:opacity-20
              ${i % 2 === 0 ? 'w-64 h-64' : 'w-48 h-48'}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%) scale(${Math.random() * 0.5 + 0.5})`,
              filter: 'blur(50px)'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="space-y-3">
              <div className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-sm text-emerald-700 dark:text-emerald-300">
                Powered by AI
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                Your personalized 
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-transparent bg-clip-text"> learning </span>
                journey
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 md:pr-6 mt-4">
                Generate custom learning roadmaps, track your progress, and optimize your resume with our AI-powered platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/sign-up" 
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Get started
                <ArrowRight size={18} />
              </Link>
              <Link 
                href="#features" 
                className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-emerald-200 rounded-lg font-medium border border-gray-200 dark:border-emerald-900 flex items-center justify-center transition-colors"
              >
                Explore features
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {[
                'Personalized roadmaps', 
                'Progress tracking', 
                'Resume assistance',
                'Skill recommendations', 
                'Adaptive learning', 
                'Career guidance'
              ].map((feature, i) => (
                <div 
                  key={feature} 
                  className={`flex items-center gap-2 transition-all duration-700 delay-${i * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                >
                  <Check size={18} className="text-emerald-500" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image/illustration */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-2xl transform rotate-1 scale-105 opacity-10 dark:opacity-20 blur-xl"></div>
              <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-emerald-900 rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900">
                  {/* Dashboard mockup */}
                  <div className="w-full h-full p-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 w-full mb-4 rounded"></div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="flex-1">
                        <div className="h-32 bg-emerald-200 dark:bg-emerald-800/30 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded mb-3"></div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-8 bg-emerald-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className={`mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">Trusted by learners from leading companies</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'].map((company) => (
              <div key={company} className="text-gray-400 dark:text-emerald-700/50 font-medium text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;