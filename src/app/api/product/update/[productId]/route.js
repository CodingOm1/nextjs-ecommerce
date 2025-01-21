"use strict";

import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/product.model"; // Import the Product model

// PUT handler to update an existing product by its ID
export async function PUT(req, { params }) {
  // Connect to the database
  await connectDB();

  try {
    // Get the product ID from the URL (params) and request body data
    const { productId } = params; // Product ID from URL
    const { name, description, price, imageUrl } = await req.json();

    // Validate required fields
    // Find the product by its ID
    const product = await ProductModel.findById(productId);

    // Check if the product exists
    if (!product) {
      return NextResponse.json(
        { message: `Product with ID ${productId} not found` },
        { status: 404 }
      );
    }

    // Update the product fields
    if (product) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    // Return the updated product data as a response
    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    // Catch any error and return it
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
