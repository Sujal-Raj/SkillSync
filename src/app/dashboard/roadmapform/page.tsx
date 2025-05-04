"use client";

import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function RoadmapForm() {
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('beginner');
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit =async  (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log("Goal:", goal);
    console.log("Experience:", experience);
    // Send to AI API 

    try{
      setLoading(true);
      const response =await axios.post('/api/generate-roadmap', { goal, experience })
      // console.log("AI response:", response.data.response);
      setRoadmap(response.data.response);
      setLoading(false);
    }
    catch (error:unknown) {
      console.error("Error generating roadmap:", error);
      setLoading(false);
      alert("Server is not responding, please try again later");
    }


  };

  return (
    <>
    <div className="max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Learning Roadmap Generator</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
              What's your goal?
            </label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="E.g., Become a frontend dev"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience level
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="experience"
                  value="beginner"
                  checked={experience === 'beginner'}
                  onChange={(e) => setExperience(e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2">Beginner</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="experience"
                  value="intermediate"
                  checked={experience === 'intermediate'}
                  onChange={(e) => setExperience(e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2">Intermediate</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="experience"
                  value="Experienced"
                  checked={experience === 'Experienced'}
                  onChange={(e) => setExperience(e.target.value)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2">Experienced</span>
              </label>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Roadmap
            </button>
          </div>
        </form>
      </div>
    </div>
    <section className=' bg-gray-100 py-8 min-h-[40vh]'>
      {loading && <div className="text-center">Getting Roadmap...</div>}
      {roadmap && (
        <div className="max-w-2xl mx-auto py-8 px-4">
          <h2 className="text-xl font-bold mb-4">Your Roadmap</h2>
          <div className="bg-white rounded-lg shadow-md p-6 whitespace-pre-wrap">
            <ReactMarkdown>{roadmap}</ReactMarkdown>
          </div>
        </div>
      )}

    </section>
    </>


  );
}