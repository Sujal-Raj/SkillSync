"use client";

import { useState, useEffect } from "react";
import { Menu, ChevronLeft, Brain, Map, BarChart2, FileText, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the NavItem type
type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Navigation items
  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <Brain className="w-5 h-5" /> },
    { label: "My Roadmaps", href: "/dashboard/roadmaps", icon: <Map className="w-5 h-5" /> },
    { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart2 className="w-5 h-5" /> },
    { label: "Resume Assist", href: "/dashboard/resume-assist", icon: <FileText className="w-5 h-5" /> },
    // { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> }
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear the token cookie
    window.location.href = "/"; // Redirect to login page
  };

  // Close sidebar on mobile when navigating to a new page
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // Effect to handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button 
        className={`md:hidden fixed top-4 left-4 bg-emerald-600 dark:bg-emerald-500 text-white p-3 rounded-full shadow-lg z-20 hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors ${isSidebarOpen ? "hidden" : "block"}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar/Navbar */}
      <div 
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 h-full transition-transform duration-300 ease-in-out shadow-md w-64 md:translate-x-0 z-10`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded flex items-center justify-center mr-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" className="text-emerald-600 dark:text-emerald-400" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" className="text-emerald-600 dark:text-emerald-400" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" className="text-emerald-600 dark:text-emerald-400" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">SkillSync</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    pathname === item.href 
                      ? "bg-emerald-50 text-emerald-600 font-medium dark:bg-emerald-900/30 dark:text-emerald-400" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
          <button onClick={handleLogout} className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-3 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <LogOut
            className="w-5 h-5 mr-3 cursor-pointer" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}