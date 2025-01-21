"use strict";

import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/product.model"; // Import the Product model

// GET handler to fetch all products
export async function GET(req) {
  // Connect to the database
  await connectDB();

  try {
    // Fetch all products from the database
    const products = await ProductModel.find();

    // If no products found, return a message
    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    // Return the fetched products
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    // Catch any error and return it
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
