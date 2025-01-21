const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the UserModel
        required: true,
      },
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product", // Reference to a Product model (if you have one)
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true, // Price at the time of order
          },
        },
      ],
      totalAmount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
      },
      address: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
  );
  
  // Check if the model already exists before defining it
  const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
  
  module.exports = OrderModel;
  