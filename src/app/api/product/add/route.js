"use strict";

import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/product.model"; // Import your updated Product model

// POST handler to create a new product
export async function POST(req) {
  // Connect to the database
  await connectDB();

  try {
    // Parse incoming request body
    const { name, description, price, imageUrl } = await req.json();

    // Validate required fields
    if (!name || !description || !price || !imageUrl) {
      return NextResponse.json(
        { message: "Missing required fields: name, description, price, imageUrl" },
        { status: 400 }
      );
    }

    // Create a new product instance based on the schema
    const newProduct = new ProductModel({
      name,
      description,
      price,
      imageUrl, // imageUrl as per the updated schema
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Return success response with the saved product data
    return NextResponse.json(
      { message: "Product created successfully", product: savedProduct },
      { status: 201 }
    );
  } catch (error) {
    // Catch any error during the process and send a response
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
