"use strict";

import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/models/product.model"; // Import the Product model

// DELETE handler to delete a product by its ID
export async function DELETE(req, { params }) {
  // Connect to the database
  await connectDB();

  try {
    // Get the product ID from the URL parameters
    const { productId } = params; // Product productId from URL

    // Find the product by its productId and delete it
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    // Check if the product exists and was deleted
    if (!deletedProduct) {
      return NextResponse.json(
        { message: `Product with productId ${productId} not found` },
        { status: 404 }
      );
    }

    // Return a success message
    return NextResponse.json(
      { message: "Product deleted successfully", product: deletedProduct },
      { status: 200 }
    );
  } catch (error) {
    // Catch any error and return it
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
