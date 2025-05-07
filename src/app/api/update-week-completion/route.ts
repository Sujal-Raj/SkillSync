// File: /app/api/update-week-completion/route.js
import dbConnect from '@/db/dbConfig';
import User from '@/models/usermodel';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request:NextRequest) {
  try {
    await dbConnect();
    
    const { userId, roadmapId, week, completed } = await request.json();
    
    if (!userId || !roadmapId || week === undefined || completed === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the user and update the specific week's completion status
    const updatedUser = await User.findOneAndUpdate(
      { 
        _id: userId,
        "roadmaps._id": roadmapId
      },
      { 
        $set: { 
          "roadmaps.$[roadmap].content.$[weekEntry].completed": completed 
        } 
      },
      { 
        arrayFilters: [
          { "roadmap._id": roadmapId },
          { "weekEntry.week": week }
        ],
        new: true
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User or roadmap not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Week completion status updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating week completion status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update week completion status' },
      { status: 500 }
    );
  }
}