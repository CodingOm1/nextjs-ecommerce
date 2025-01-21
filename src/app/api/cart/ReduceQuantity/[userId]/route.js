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
    const cartItem = user.cart.find(item => item.product._id.toString() === productId);

    if (!cartItem) {
      return NextResponse.json({ message: "Product not found in cart" }, { status: 404 });
    }

    // Decrease the quantity of the product by 1, ensuring it's at least 1
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      return NextResponse.json({ message: "Quantity cannot be less than 1" }, { status: 400 });
    }

    // Save the updated user document with the modified cart
    await user.save();

    // Return success response
    return NextResponse.json({ message: "Product quantity decreased", status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Internal Server Error",
    }, { status: 500 });
  }
}
