import { connectDB } from "@/config/db";
import UserModel from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    // Extract email and password from the request body
    const { email, password } = await req.json();

    // Validate if both email and password are provided
    if (!email || !password) {
      return NextResponse.json({
        message: "Email and password are required!",
        error: true,
        status: 400,
      });
    }

    // Check if the user exists in the database
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({
        message: "Invalid credentials! User not found.",
        error: true,
        status: 401,
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        message: "Invalid credentials! Incorrect password.",
        error: true,
        status: 401,
      });
    }

    // Return a success response with user data (excluding sensitive info like password)
    return NextResponse.json({
      message: "Login successful!",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: true,
      status: 500,
    });
  }
}
