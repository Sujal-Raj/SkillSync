"use client";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Project {
  title: string;
  description: string;
}

interface RecommendationData {
  skills: string[];
  projects: Project[];
}

// Global in-memory cache (persists until browser refresh/close)
const recommendationsCache = new Map<string, { data: RecommendationData; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function page() {
  const { user, setUser } = useUserStore();
  const [goal, setGoal] = useState<string>("");
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user.roadmaps[0].goal);
        const currentGoal = data.user.roadmaps[0].goal;
        setGoal(currentGoal);
        
        if (data.user) {
          setUser(data.user);
        }

        // Check for cached recommendations
        checkCachedRecommendations(currentGoal);
      })
      .catch((err) => console.error(err));
  }, [setUser]);

  const checkCachedRecommendations = (currentGoal: string) => {
    if (!currentGoal) return;

    const cached = recommendationsCache.get(currentGoal);
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
      
      if (!isExpired) {
        setRecommendations(cached.data);
        return; // Don't make API call
      } else {
        // Remove expired cache
        recommendationsCache.delete(currentGoal);
      }
    }
    
    // If no valid cache, make API call
    getResumeAssist(currentGoal);
  };

  const getResumeAssist = async (currentGoal: string) => {
    if (!currentGoal || loading) return;
    
    setLoading(true);
    try {
      const response = await axios.post("/api/resume-assist", {
        goal: currentGoal
      });
      
      // Handle the API response
      if (response.data.success && response.data.data) {
        const recommendationData = response.data.data;
        setRecommendations(recommendationData);
        
        // Cache the recommendations
        recommendationsCache.set(currentGoal, {
          data: recommendationData,
          timestamp: Date.now()
        });
      } else {
        console.error('Invalid response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Add a refresh button to manually get new recommendations
  const refreshRecommendations = () => {
    if (goal) {
      // Clear cache and fetch new recommendations
      recommendationsCache.delete(goal);
      getResumeAssist(goal);
    }
  };

  return (
    <>
      <div className="min-h-screen transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent mb-4">
              Resume Assist
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Personalized career guidance tailored to your professional goals
            </p>
          </div>

          {/* Goal Display Card */}
          <div className=" rounded-2xl shadow-xl  p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-700/50 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/30 w-full max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 whitespace-nowrap">
                    Your Career Goal:
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-200 text-lg font-medium">
                    {goal || "Loading..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400"></div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Generating personalized recommendations...
                </p>
              </div>
            </div>
          )}

          {/* Recommendations Grid */}
          {recommendations && !loading && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Skills Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 h-fit">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Essential Skills
                  </h3>
                  {/* Optional refresh button */}
                  <button
                    onClick={refreshRecommendations}
                    className="ml-auto p-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    title="Refresh recommendations"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  {recommendations.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="group flex items-center gap-4 p-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800/50"
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300"></div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project Ideas
                  </h3>
                </div>

                <div className="space-y-6">
                  {recommendations.projects.map((project, index) => (
                    <div 
                      key={index} 
                      className="group p-6 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 border-l-4 border-emerald-500 hover:border-l-6 hover:shadow-lg"
                    >
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Great for portfolio
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!recommendations && !loading && goal && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Generate personalized recommendations for your career goal
              </p>
              <button
                onClick={() => getResumeAssist(goal)}
                className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Generate Recommendations
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default page;