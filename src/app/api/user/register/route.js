"use strict"


import { connectDB } from "@/config/db"; // Import your database connection
import UserModel from "@/models/user.model"; // Import the User model
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

// Named export for POST method
export async function POST(req) {
  // Connect to the database
  await connectDB();

  try {
    // Extract user data from the request body
    const { fullname, email, password } = await req.json(); // Using req.json() in Next.js 13+

    // Validate the data
    if (!fullname || !fullname.firstname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered!" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user
    const user = await UserModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // Return the created user (excluding sensitive data)
    return NextResponse.json(
      {
        message: "User created successfully!",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Server error!" },
      { status: 500 }
    );
  }
}
