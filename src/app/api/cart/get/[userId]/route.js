import { connectDB } from "@/config/db";
import UserModel from "@/models/user.model";
import ProductModel from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB(); // Ensure the database connection is established

  try {
    const { userId } = await params; // Directly destructure userId from params

    // Find the user by ID, including populated cart details
    const user = await UserModel.findById(userId).populate({
      path: 'cart.product', // Populate the 'product' field in the cart array
      model: ProductModel,  // Use ProductModel to fetch product details
    });

    if (!user) {
      return NextResponse.json({
        message: "User not found",
        error: true,
      }, { status: 404 });
    }

    // Check if the user has items in the cart
    if (!user.cart || user.cart.length === 0) {
      return NextResponse.json({
        message: "Cart is empty",
        success: true,
        cart: [], // Empty cart array
      });
    }

    // Map through the user's cart to include product details along with quantity
    const cartItemsWithDetails = user.cart.map((item) => {
      if (!item.product) {
        // Skip or log the item if the product is undefined
        console.log(`Missing product for cart item with ID: ${item._id}`);
        return null;
      }

      return {
        productId: item.product._id,
        name: item.product.name || "No name available",
        price: item.product.price || "No price available",
        description: item.product.description || "No description available",
        image: item.product.imageUrl || "No image available",
        quantity: item.quantity,
      };
    }).filter(item => item !== null); // Remove any null entries due to missing products

    return NextResponse.json({
      message: "Cart fetched successfully",
      success: true,
      cart: cartItemsWithDetails, // Return the cart with product details and quantity
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: true,
      status: 500
    }, { status: 500 });
  }
}
