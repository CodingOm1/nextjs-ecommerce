import { connectDB } from "@/config/db";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Don't forget to import mongoose to use ObjectId validation

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { userId } = await params; // No need to await here, params is already available

    // Check if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({
        message: "Invalid userId format!",
        error: true,
        status: 400,
      });
    }

    // Find the user by userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({
        message: "User not found!",
        error: true,
        status: 404,
      });
    }

    // Return the user data (excluding sensitive information like password)
    return NextResponse.json({
      message: "User fetched successfully!",
      user: user,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error({
      message: "Internal Server Error",
      error: true,
      status: 500,
    });
  }
}
