"use client";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { 
  CheckCircle, 
  ChevronRight, 
  Activity, 
  Calendar, 
  Award, 
  Clock, 
  Zap,
  ChartPie,
  BarChart3,
  Target
} from "lucide-react";

// Define TypeScript interfaces
interface Task {
  week: number;
  goal: string;
  tasks: string[];
  completed: boolean; // Using the actual completed field from the database
}

interface RoadmapItem {
  _id: string;
  content: Task[];
  createdAt: string;
  experience: string;
  goal: string;
}

export default function RoadmapAnalytics() {
  const { user } = useUserStore();
  const [roadmap, setRoadmap] = useState<RoadmapItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

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
      const roadmapData = data.roadmap;
      setRoadmap(roadmapData);
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

  // Calculate overall progress metrics based on actual completion data
  const calculateMetrics = () => {
    if (!roadmap || roadmap.length === 0 || !roadmap[0].content) {
      return {
        totalWeeks: 0,
        completedWeeks: 0,
        completionPercentage: 0,
        totalTasks: 0,
        completedTasks: 0,
        taskCompletionPercentage: 0,
        streakDays: 0,
      };
    }

    const content = roadmap[0].content;
    const totalWeeks = content.length;
    
    // Count completed weeks using the 'completed' field from the database
    const completedWeeksCount = content.filter(week => week.completed).length;
    
    // Calculate total tasks across all weeks
    const totalTasks = content.reduce((sum, week) => sum + week.tasks.length, 0);
    
    // Calculate completed tasks based on completed weeks
    const completedTasksCount = content.reduce((sum, week) => {
      return week.completed ? sum + week.tasks.length : sum;
    }, 0);

    // Calculate streak days (this would ideally come from a separate streak tracking system)
    // For now, we'll calculate it based on consecutive completed weeks
    let streakDays = 0;
    let currentStreak = 0;
    
    // Sort weeks by week number to ensure proper streak calculation
    const sortedWeeks = [...content].sort((a, b) => a.week - b.week);
    
    for (const week of sortedWeeks) {
      if (week.completed) {
        currentStreak++;
      } else {
        break; // Break on first incomplete week
      }
    }
    
    // Each week represents 7 days
    streakDays = currentStreak * 7;

    return {
      totalWeeks,
      completedWeeks: completedWeeksCount,
      completionPercentage: Math.round((completedWeeksCount / totalWeeks) * 100),
      totalTasks,
      completedTasks: completedTasksCount,
      taskCompletionPercentage: Math.round((completedTasksCount / totalTasks) * 100),
      streakDays,
    };
  };

  const metrics = calculateMetrics();

  // Function to estimate completion date
  const estimateCompletionDays = () => {
    if (!roadmap || !roadmap[0]?.content || metrics.completedWeeks === 0) {
      return "--";
    }
    
    // Calculate average days per week based on current progress
    const totalWeeks = roadmap[0].content.length;
    const remainingWeeks = totalWeeks - metrics.completedWeeks;
    
    // If all weeks are completed, return 0
    if (remainingWeeks <= 0) return 0;
    
    // Calculate days per week based on streak days and completed weeks
    // Add fallback calculation if streak is 0
    const daysPerWeek = metrics.streakDays > 0 && metrics.completedWeeks > 0 
      ? metrics.streakDays / metrics.completedWeeks 
      : 7; // Default to 7 days per week if no progress yet
    
    // Estimate remaining days
    return Math.ceil(remainingWeeks * daysPerWeek);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">Loading your analytics...</div>
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
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Roadmap Analytics</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">No roadmap found. Create one to see analytics!</p>
      </div>
    );
  }

  // Extract content from the first roadmap
  const roadmapContent: Task[] = roadmap[0]?.content || [];
  const roadmapGoal: string = roadmap[0]?.goal || "Your Learning Roadmap";

  // Find the next incomplete week for the "Next Tasks" section
  const nextIncompleteWeek = roadmapContent
    .filter(week => !week.completed)
    .sort((a, b) => a.week - b.week)[0];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">Roadmap Analytics</h1>
          <p className="text-md text-gray-600 dark:text-gray-400">
            Track your progress on: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{roadmapGoal}</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          <button 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "overview" 
                ? "bg-emerald-500 text-white shadow-md" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <Activity size={18} />
            <span>Overview</span>
          </button>
          <button 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "weekly" 
                ? "bg-emerald-500 text-white shadow-md" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("weekly")}
          >
            <Calendar size={18} />
            <span>Weekly Progress</span>
          </button>
          <button 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === "achievements" 
                ? "bg-emerald-500 text-white shadow-md" 
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            <Award size={18} />
            <span>Achievements</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Overall Progress Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Overall Progress</h3>
                  <ChartPie className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-emerald-100 dark:bg-gray-700">
                    <div 
                      style={{ width: `${metrics.completionPercentage}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Week {metrics.completedWeeks} of {metrics.totalWeeks}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{metrics.completionPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Task Completion Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Tasks Completed</h3>
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-emerald-100 dark:bg-gray-700">
                    <div 
                      style={{ width: `${metrics.taskCompletionPercentage}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{metrics.completedTasks} of {metrics.totalTasks} tasks</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{metrics.taskCompletionPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Current Streak Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current Streak</h3>
                  <Zap className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.streakDays}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">days</span>
                </div>
                <p className="text-sm text-center mt-2 text-gray-500 dark:text-gray-400">
                  {metrics.streakDays > 0 ? "Keep it up! (One Week completion counts as 7 days)" : "Start your streak today!"}
                </p>
              </div>

              {/* Estimated Completion Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Est. Completion</h3>
                  <Clock className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    {estimateCompletionDays()}
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">days left</span>
                </div>
                <p className="text-sm text-center mt-2 text-gray-500 dark:text-gray-400">At current pace</p>
              </div>
            </div>

            {/* Progress By Week Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Progress by Week</h3>
                <BarChart3 className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="w-full h-64">
                <div className="flex h-full items-end">
                  {/* Sort weeks by week number for proper display */}
                  {[...roadmapContent]
                    .sort((a, b) => a.week - b.week)
                    .map((weekData: Task) => (
                      <div key={weekData.week} className="flex-1 mx-1 flex flex-col items-center">
                        <div 
                          className={`w-full ${
                            weekData.completed 
                              ? "bg-emerald-500" 
                              : "bg-gray-300 dark:bg-gray-600"
                          } rounded-t-sm`}
                          style={{ 
                            height: `${(weekData.tasks.length / Math.max(...roadmapContent.map(w => w.tasks.length))) * 100}%`,
                            minHeight: "20px"
                          }}
                        />
                        <div className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                          Week {weekData.week}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Next Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Next Tasks</h3>
                <Target className="h-6 w-6 text-emerald-500" />
              </div>
              
              {nextIncompleteWeek ? (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Week {nextIncompleteWeek.week}: {nextIncompleteWeek.goal}
                    </h4>
                    <div className="space-y-3">
                      {nextIncompleteWeek.tasks.slice(0, 3).map((task, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                          <ChevronRight className="h-5 w-5 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">{task}</p>
                        </div>
                      ))}
                      {nextIncompleteWeek.tasks.length > 3 && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 ml-2">
                          +{nextIncompleteWeek.tasks.length - 3} more tasks in Week {nextIncompleteWeek.week}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Congratulations! You've completed all tasks in your roadmap.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Weekly Progress Tab */}
        {activeTab === "weekly" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Weekly Progress Breakdown</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Detailed view of your progress through each week
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Sort weeks by week number for consistent display */}
              {[...roadmapContent]
                .sort((a, b) => a.week - b.week)
                .map((weekData: Task) => (
                  <div key={weekData.week} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex items-center">
                        {weekData.completed ? (
                          <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-3" />
                        )}
                        <div>
                          <h4 className={`font-semibold text-lg ${
                            weekData.completed 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : "text-gray-800 dark:text-gray-200"
                          }`}>
                            Week {weekData.week}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">{weekData.goal}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          weekData.completed 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                          {weekData.completed ? "Completed" : "In Progress"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {weekData.tasks.length} tasks
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {weekData.tasks.map((task, taskIndex) => (
                          <div 
                            key={taskIndex}
                            className={`p-3 rounded-md border ${
                              weekData.completed 
                                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30" 
                                : "border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800"
                            }`}
                          >
                            <div className="flex items-start">
                              {weekData.completed ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                              )}
                              <p className={`text-sm ${
                                weekData.completed 
                                  ? "text-emerald-800 dark:text-emerald-200" 
                                  : "text-gray-700 dark:text-gray-300"
                              }`}>
                                {task}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Achievements</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Milestones you've reached in your learning journey
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* First Week Complete */}
                <div className={`rounded-xl p-6 border-2 ${
                  metrics.completedWeeks >= 1
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/30"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                }`}>
                  <div className="flex justify-center mb-4">
                    <div className={`rounded-full p-3 ${
                      metrics.completedWeeks >= 1
                        ? "bg-emerald-100 dark:bg-emerald-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      <Award className={`h-8 w-8 ${
                        metrics.completedWeeks >= 1
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`} />
                    </div>
                  </div>
                  <h4 className={`text-center font-bold ${
                    metrics.completedWeeks >= 1
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>First Week Complete</h4>
                  <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                    You've completed your first week of learning!
                  </p>
                </div>
                
                {/* 25% Complete */}
                <div className={`rounded-xl p-6 border-2 ${
                  metrics.completionPercentage >= 25
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/30"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                }`}>
                  <div className="flex justify-center mb-4">
                    <div className={`rounded-full p-3 ${
                      metrics.completionPercentage >= 25
                        ? "bg-emerald-100 dark:bg-emerald-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      <ChartPie className={`h-8 w-8 ${
                        metrics.completionPercentage >= 25
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`} />
                    </div>
                  </div>
                  <h4 className={`text-center font-bold ${
                    metrics.completionPercentage >= 25
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>25% Milestone</h4>
                  <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                    You're a quarter of the way through your roadmap!
                  </p>
                </div>
                
                {/* 50% Complete */}
                <div className={`rounded-xl p-6 border-2 ${
                  metrics.completionPercentage >= 50
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/30"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                }`}>
                  <div className="flex justify-center mb-4">
                    <div className={`rounded-full p-3 ${
                      metrics.completionPercentage >= 50
                        ? "bg-emerald-100 dark:bg-emerald-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      <Target className={`h-8 w-8 ${
                        metrics.completionPercentage >= 50
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`} />
                    </div>
                  </div>
                  <h4 className={`text-center font-bold ${
                    metrics.completionPercentage >= 50
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>Halfway There!</h4>
                  <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                    You've completed 50% of your learning roadmap!
                  </p>
                </div>
                
                {/* 7-Day Streak */}
                <div className={`rounded-xl p-6 border-2 ${
                  metrics.streakDays >= 7
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/30"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                }`}>
                  <div className="flex justify-center mb-4">
                    <div className={`rounded-full p-3 ${
                      metrics.streakDays >= 7
                        ? "bg-emerald-100 dark:bg-emerald-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      <Zap className={`h-8 w-8 ${
                        metrics.streakDays >= 7
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`} />
                    </div>
                  </div>
                  <h4 className={`text-center font-bold ${
                    metrics.streakDays >= 7
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>7-Day Streak</h4>
                  <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                    You've maintained a 7-day streak of learning!
                  </p>
                </div>
                  
                  {/* 100% Complete */}
                <div className={`rounded-xl p-6 border-2 ${
                  metrics.completionPercentage >= 100
                    ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/30"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60"
                }`}>
                  <div className="flex justify-center mb-4">
                    <div className={`rounded-full p-3 ${
                      metrics.completionPercentage >= 100
                        ? "bg-emerald-100 dark:bg-emerald-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      <CheckCircle className={`h-8 w-8 ${
                        metrics.completionPercentage >= 100
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`} />
                    </div>
                  </div>
                  <h4 className={`text-center font-bold ${
                    metrics.completionPercentage >= 100
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>Roadmap Complete!</h4>
                  <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
                    Congratulations! You've completed your entire roadmap!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
