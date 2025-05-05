import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConfig";
import User from "@/models/usermodel";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url); // Get search parameters from the URL
    const userId = searchParams.get("userId"); // Get 'userId' from the query

    // console.log(userId); 

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId);
    // console.log("hello");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const roadmap = user.roadmaps;

    if (!roadmap) {
      return NextResponse.json({ message: "Roadmap not found"   }, { status: 404 });
    }

    return NextResponse.json({ roadmap }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
