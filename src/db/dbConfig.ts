import mongoose from "mongoose";

export default function dbConnect() { mongoose.connect(process.env.MONGODB_URI! ,{
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
})};
