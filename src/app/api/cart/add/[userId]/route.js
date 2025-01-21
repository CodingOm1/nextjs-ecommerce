import { connectDB } from "@/config/db";
import UserModel from "@/models/user.model";
import ProductModel from "@/models/product.model";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB(); // Ensure the database connection is established

  try {
    const { productId } = await req.json();
    const { userId } = await params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({
        message: "User does not exist!",
        error: true,
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json({
        message: "Product is not valid!",
        error: true,
      });
    }

    // Log the cart data to inspect it
    console.log("User Cart:", user.cart);

    const cartItem = user.cart.find(
      (item) => item.product && item.product.toString() === productId
    );

    if (cartItem) {
      // If product is already in cart, increase the quantity
      cartItem.quantity += 1;
    } else {
      // If product is not in cart, add it with quantity 1
      user.cart.push({ product: productId, quantity: 1 });
    }

    // Save the updated cart to the user
    await user.save();

    return NextResponse.json({
      message: "Product Added to Cart!",
      success: true,
      status: 200,
      cart: user.cart, // Return the entire updated cart
    }, {status:200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Something went wrong, try again later!",
        error: true,
        status: 500,
      },
      { status: 500 }
    );
  }
}
