"use client";
import { useEffect, useRef, useState } from 'react';
import { Code, BarChart3, Calendar, UserCircle, BookOpen, Award } from 'lucide-react';

const Features = () => {
  const featuresRef = useRef(null);
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

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-10 h-10 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg" />,
      title: "AI-Generated Learning Paths",
      description: "Personalized roadmaps tailored to your skill level, learning goals, and preferred pace. Our AI analyzes your needs and creates the perfect learning journey."
    },
    {
      icon: <Calendar className="w-10 h-10 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg" />,
      title: "Progress Tracking",
      description: "Mark completed topics and visualize your learning progress. Stay motivated with achievement milestones and personalized insights on your development."
    },
    {
      icon: <UserCircle className="w-10 h-10 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg" />,
      title: "Resume Assistance",
      description: "Enhance your resume with AI-powered recommendations. Highlight relevant skills and experience based on your learning path and career objectives."
    },
    {
      icon: <BarChart3 className="w-10 h-10 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg" />,
      title: "Skill Analytics",
      description: "Detailed insights into your skill development with visual analytics. Identify strengths and areas for improvement to optimize your learning journey."
    },
    {
      icon: <Code className="w-10 h-10 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg" />,
      title: "Learning Resources",
      description: "Curated learning materials including tutorials, articles, videos, and practice exercises tailored to your specific learning path."
    },
    {
      icon: <Award className="w-10 h-10 p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg" />,
      title: "Certification Prep",
      description: "Targeted preparation for industry certifications and exams. Focus on the topics that matter most for your chosen certification path."
    }
  ];

  return (
    <section id="features" className="py-24 bg-emerald-50 dark:bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300 dark:bg-emerald-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-[128px] opacity-30 dark:opacity-20"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200 dark:bg-emerald-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-[128px] opacity-30 dark:opacity-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6" ref={featuresRef}>
        {/* Section header */}
        <div className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Supercharge Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our AI-powered platform provides everything you need to learn efficiently, track your progress, and showcase your skills.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={feature.title}
              className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-emerald-900/20 transition-all duration-700 delay-${i * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <a 
            href="/sign-up" 
            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            Start Learning Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;