const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: [true, "First name is required!"],
        minlength: [2, "Please enter at least 2 letters for the first name!"],
      },
      lastname: {
        type: String,
        default: "",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address!",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password must be at least 6 characters long!"],
      select: false,
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    orders: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;
