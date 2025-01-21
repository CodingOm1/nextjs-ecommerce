import UserModel from "@/models/user.model";
import { connectDB } from "@/config/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const { userId } = await params;

    // Check if the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({
        message: "Invalid userId format!",
        error: true,
        status: 400,
      });
    }

    // Find and delete the user by userId
    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json({
        message: "User not found!",
        error: true,
        status: 404,
      });
    }

    // Return success response
    return NextResponse.json({
      message: "User deleted successfully!",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({
      message: "Server error",
      error: true,
      status: 500,
    });
  }
}
