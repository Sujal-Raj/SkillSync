"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setuser] = useState<String>("Guest");

    useEffect(() => {
        fetch("/api/me")
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                if (data.user) {
                    setuser(data.user.name);
                } else {
                    setuser("Guest");
                }
            })
            .catch((err) => console.log(err));
    },[user])

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-6 capitalize">👋 Welcome back, {user}</h1>
      <p className=" mb-8 max-w-md">
        Create personalized learning roadmaps to achieve your career goals.
      </p>
      <Link href="/dashboard/roadmapform">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center transition-all cursor-pointer">
        <span className="mr-2">Generate Roadmap</span>
        <ChevronRight className="w-5 h-5" />
      </button>
        </Link>
    </div>
  );
}