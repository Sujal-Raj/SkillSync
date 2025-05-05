import User from "@/models/usermodel";
import dbConnect from "@/db/dbConfig";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import { create } from "domain";


export async function POST(request: NextRequest) {
    await dbConnect();
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email});
    if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        roadmaps: [], 
        createdAt: new Date(),
    });
    await newUser.save();
    // Return a success response
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

}
