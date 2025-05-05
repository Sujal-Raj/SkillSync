"use client";

import Sidebar from "@/Components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          {children}
        </main>
      </div>
    </div>
  );
}