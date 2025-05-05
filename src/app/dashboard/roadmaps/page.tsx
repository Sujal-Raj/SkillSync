"use client";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { CheckCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";

// Define TypeScript interfaces
interface Task {
  week: number;
  goal: string;
  tasks: string[];
}

interface RoadmapItem {
  _id: string;
  content: Task[];
  createdAt: string;
  experience: string;
  goal: string;
}

type CompletionState = {
  [key: number]: boolean;
};

type ExpansionState = {
  [key: number]: boolean;
};

export default function RoadmapsPage() {
  const { user } = useUserStore();
  const [roadmap, setRoadmap] = useState<RoadmapItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completedWeeks, setCompletedWeeks] = useState<CompletionState>({});
  const [expandedWeeks, setExpandedWeeks] = useState<ExpansionState>({});

  const fetchRoadmap = async () => {
    if (!user?._id) {
      setLoading(false);
      setError("User not found. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/get-roadmap?userId=${user._id}`);
      const data = await response.json();
      console.log(data.roadmap);
      const roadmapData = data.roadmap;
      setRoadmap(roadmapData);
      
      // Initialize expanded state - only first week expanded by default
      if (roadmapData && roadmapData.length > 0 && roadmapData[0].content) {
        const initialExpandedState: ExpansionState = {};
        roadmapData[0].content.forEach((weekData: Task): void => {
          // Only expand the first week, keep others collapsed
          initialExpandedState[weekData.week] = weekData.week === 1;
        });
        setExpandedWeeks(initialExpandedState);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      setError("Failed to load roadmap data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchRoadmap();
    }
  }, [user]);

  const toggleWeekCompletion = (week: number): void => {
    setCompletedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  const toggleWeekExpansion = (week: number): void => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading your roadmap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Roadmaps</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">No roadmap found. Create one to get started!</p>
      </div>
    );
  }

  // Extract content from the first roadmap
  const roadmapContent: Task[] = roadmap[0]?.content || [];
  const roadmapGoal: string = roadmap[0]?.goal || "Your Learning Roadmap";

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">{roadmapGoal}</h1>
          <p className="text-md text-gray-600 dark:text-gray-400">
            {roadmap[0]?.experience && `Experience level: ${roadmap[0].experience}`}
          </p>
        </div>

        <div className="space-y-6">
          {roadmapContent.map((weekData: Task) => (
            <div 
              key={weekData.week}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleWeekExpansion(weekData.week)}
              >
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWeekCompletion(weekData.week);
                    }}
                    className="focus:outline-none"
                    aria-label={completedWeeks[weekData.week] ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {completedWeeks[weekData.week] ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                  <div>
                    <h3 className={`font-bold text-lg ${
                      completedWeeks[weekData.week] 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-gray-800 dark:text-gray-200"
                    }`}>
                      Week {weekData.week}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{weekData.goal}</p>
                  </div>
                </div>
                <div>
                  {expandedWeeks[weekData.week] ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>
              
              <div 
                className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedWeeks[weekData.week] 
                    ? "max-h-96 opacity-100 pb-4" 
                    : "max-h-0 opacity-0 pb-0"
                }`}
              >
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Tasks:</h4>
                  <ul className="space-y-2">
                    {weekData.tasks.map((task: string, taskIndex: number) => (
                      <li 
                        key={taskIndex}
                        className="flex items-start space-x-2"
                      >
                        <span className="text-gray-500 dark:text-gray-400 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Keep going! You're making great progress on your learning journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}