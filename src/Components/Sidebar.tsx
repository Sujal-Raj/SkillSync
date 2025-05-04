"use client";

import { useState, useEffect } from "react";
import { Menu, User, ChevronLeft, Brain, Map, BarChart2, FileText, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the NavItem type
type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  // Navigation items
  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <Brain className="w-5 h-5" /> },
    { label: "My Roadmaps", href: "/dashboard/roadmaps", icon: <Map className="w-5 h-5" /> },
    { label: "Analytics", href: "/dashboard/analytics", icon: <BarChart2 className="w-5 h-5" /> },
    { label: "Resume Assist", href: "/dashboard/resume", icon: <FileText className="w-5 h-5" /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" /> }
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-20"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar/Navbar */}
      <div 
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative bg-white border-r border-gray-200 h-full transition-transform duration-300 ease-in-out shadow-md w-64 md:translate-x-0 z-10`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            {/* <User className="w-6 h-6 mr-2 text-blue-600" /> */}
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" />
                  <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" />
                  <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" />
                </svg>
              </div>
            <span className="font-bold text-lg">SkillSync</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden"
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
                  className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
                    pathname === item.href ? "bg-blue-50 text-blue-600 font-medium" : ""
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="flex items-center text-red-600 hover:text-red-800 p-3 w-full rounded-lg hover:bg-gray-100">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}