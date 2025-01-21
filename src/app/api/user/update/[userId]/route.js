"use strict";

import UserModel from "@/models/user.model";
import { connectDB } from "@/config/db";
import bcryptjs from "bcryptjs"; // Import bcryptjs for password hashing
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await connectDB();

  try {
    // Extract updated user data from the request body
    const { userId } = await params; // Extracting userId from the query parameters
    const { fullname, password } = await req.json();

    // Find the user by userId
    const user = await UserModel.findById(userId);

    // If user does not exist, return an error response
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found!",
          error: true,
        },
        { status: 404 }
      );
    }

    // If new password is provided, hash it
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update the user's first name and last name
    if (fullname) {
      if (fullname.firstname) {
        user.fullname.firstname = fullname.firstname;
      }
      if (fullname.lastname) {
        user.fullname.lastname = fullname.lastname;
      }
    }

    const validFields = ["fullname", "email", "password"];

    // Loop through the received data and check for invalid properties
    const invalidFields = Object.keys(req.body).filter(
      (field) => !validFields.includes(field)
    );

    // Save the updated user information
    await user.save();

    // Return a success response with the updated user data
    return NextResponse.json(
      {
        message: "User updated successfully!",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        message: "Server error",
        error: true,
      },
      { status: 500 }
    );
  }
}
