"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export default function Dashboard() {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error(err));
  }, [setUser]);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 capitalize">
        👋 Welcome Back, {user?.name ?? "Guest"}
      </h1>
      <p className="mb-6 sm:mb-8 max-w-md text-gray-700 dark:text-gray-300">
        Create personalized learning roadmaps to achieve your career goals.
      </p>
      <Link href="/dashboard/roadmapform">
        <button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg flex items-center transition-all">
          <span className="mr-2">Generate Roadmap</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
}