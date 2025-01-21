import { connectDB } from "@/config/db";
import ProductModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  connectDB();

  try {
    // Get the data from the request body
    const { productId } = await req.json();  // Parse the body for productId
    const { userId } = params;  // Get the userId from the params

    // Find the user and populate the cart with product details
    const user = await UserModel.findById(userId).populate({
      path: "cart.product", // Populate the 'product' field in the cart array
      model: ProductModel,   // Use ProductModel to fetch product details
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find the product in the user's cart
    const cartItemIndex = user.cart.findIndex(item => item.product._id.toString() === productId);

    if (cartItemIndex === -1) {
      return NextResponse.json({ message: "Product not found in cart" }, { status: 404 });
    }

    // Remove the product from the cart array
    user.cart.splice(cartItemIndex, 1);

    // Save the updated user document with the modified cart
    await user.save();

    // Return success response
    return NextResponse.json({ message: "Product removed from cart", status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Internal Server Error",
    }, { status: 500 });
  }
}
