'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

interface WeeklyEntry {
  week: number;
  goal: string;
  tasks: string[];
}

export default function RoadmapForm() {
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('beginner');
  const [roadmap, setRoadmap] = useState<WeeklyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      if (!user?._id) {
        console.error("User not found");
        alert("User not found, please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/generate-roadmap', { 
        goal, 
        experience, 
        userId: user._id,
      });

      setRoadmap(response.data.response); // response should be the array
      setLoading(false);
    }
    catch (error) {
      console.error("Error generating roadmap:", error);
      setLoading(false);
      alert("Server is not responding, please try again later");
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto py-6 sm:py-8 px-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Learning Roadmap Generator</h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="goal" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                What's your goal?
              </label>
              <input
                type="text"
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="E.g., Become a frontend dev"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Experience level
              </label>
              <div className="flex flex-wrap gap-4">
                {["beginner", "intermediate", "Experienced"].map((level) => (
                  <label className="flex items-center" key={level}>
                    <input
                      type="radio"
                      name="experience"
                      value={level}
                      checked={experience === level}
                      onChange={(e) => setExperience(e.target.value)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-700"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Generate Roadmap
              </button>
            </div>
          </form>
        </div>
      </div>

      <section className="bg-gray-100 dark:bg-black py-6 sm:py-8 min-h-[40vh]">
        {loading && (
          <div className="text-center text-gray-700 dark:text-gray-300">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 dark:border-gray-700 border-t-emerald-600 dark:border-t-emerald-500 mb-4"></div>
            <p>Getting Roadmap...</p>
          </div>
        )}

        {!loading && roadmap.length > 0 && (
          <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Roadmap</h2>
            <div className="space-y-6">
              {roadmap.map((entry) => (
                <div key={entry.week} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                  <h3 className="text-md sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                    Week {entry.week}: {entry.goal}
                  </h3>
                  <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
                    {entry.tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
