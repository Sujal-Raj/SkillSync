import dbConnect from "@/db/dbConfig";
import User from "@/models/usermodel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    await dbConnect();
    const { email, password } = await request.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate a JWT token (optional, if you want to use it for authentication)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h", // Token expiration time   
    });
    // Set the token in a cookie (optional)
    const { password: _, ...userData } = user.toObject();
    const response = NextResponse.json({ message: "Login successful", user: userData }, { status: 200 });
    response.cookies.set("token", token, { httpOnly: true, maxAge: 3600 });
    return response;

    // Return a success response with user data (excluding password)
    // return NextResponse.json({ message: "Login successful", user: userData }, { status: 200 });
}
