const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required!"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters!"],
    },
    description: {
      type: String,
      required: [true, "Product description is required!"],
      maxlength: [1000, "Product description cannot exceed 1000 characters!"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required!"],
      min: [0, "Product price cannot be negative!"],
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Check if the model already exists before defining it
const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = ProductModel;
