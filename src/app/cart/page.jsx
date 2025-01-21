"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No user ID found in localStorage");
          return;
        }


        const response = await axios.get(`${process.env.BASE_URL}/api/cart/get/${userId}`);
        setCartItems(response.data.cart);
      } catch (error) {
      }
    };

    fetchCart();

    // Set up polling (fetch every 5 seconds)
    const intervalId = setInterval(fetchCart, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const addToCart = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`${process.env.BASE_URL}/api/cart/add/${userId}`, {
        productId: product.productId,
      });

      if (response.data.status === 200) {
        toast.success("Product Quantity increased");
      }
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };
  const ReduceQ = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(`${process.env.BASE_URL}/api/cart/ReduceQuantity/${userId}`, {
        productId: product.productId,
      });

      if (response.data.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };
  const removeProduct = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.put(`${process.env.BASE_URL}/api/cart/remove/${userId}`, {
        productId: product.productId,
      });

      if (response.data.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="container mx-auto py-12 px-4">
        <ToastContainer />
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
          Your Cart
        </h1>
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-lg font-bold text-green-600">
                        ₹{item.price}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => ReduceQ(item)}
                          className="w-8 h-8 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity || 1}
                          readOnly
                          className="w-12 text-center border border-gray-300 rounded text-gray-800"
                        />
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button onClick={() => removeProduct(item)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-gray-800">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-bold text-gray-800">₹50.00</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-lg font-extrabold text-green-600">
                    ₹{(totalPrice + 50).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
