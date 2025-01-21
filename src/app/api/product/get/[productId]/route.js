"use strict";

import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/product.model"; // Import the Product model

// GET handler to fetch all products
export async function GET(req, { params }) {
  // Connect to the database
  await connectDB();

  try {
    const { productId } = params;
    // Fetch all products from the database
    const product = await ProductModel.findById(productId);

    // If no products found, return a message
    if (!product) {
      return NextResponse.json(
        { message: "No product found" },
        { status: 404 }
      );
    }

    // Return the fetched products
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    // Catch any error and return it
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
