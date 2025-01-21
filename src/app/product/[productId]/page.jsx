"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ProductPage({ params: rawParams }) {
  const [params, setParams] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [user, setUser] = useState(null); // User state initialization

  // Extract route parameters
  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await rawParams;
      setParams(resolvedParams);
    }
    unwrapParams();
  }, [rawParams]);

  // Fetch user data to ensure authentication
  const fetchUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setUser(false);
      toast.warn("You are not authorized. Please log in first.");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(`/api/user/get/${userId}`);
      if (response.status === 200) {
        setUser(true); // User is authenticated
      } else {
        setUser(false);
        toast.warn("You are not authorized. Please log in first.");
        router.push("/login");
      }
    } catch (error) {
      setUser(false);
      toast.warn("You are not authorized. Please log in first.");
      router.push("/login");
      console.error(error);
    }
  };

  // Add product to cart
  const addToCart = async () => {
    if (!user) {
      toast.error("Please log in to add products to the cart.");
      router.push("/login");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`/api/cart/add/${userId}`, {
        productId: product._id,
      });

      if (response.status === 200) {
        toast.success("Product added to cart successfully!");
      }
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  // Fetch product data once route parameters are available
  useEffect(() => {
    if (!params?.productId) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/get/${params.productId}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (err) {
        setError("Failed to load product. Please try again.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  useEffect(() => {
    fetchUser(); // Ensure user is validated before anything else
  }, []); // Run only once on component mount

  // Render loading states or error messages
  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-page bg-gray-100 py-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <ToastContainer />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="flex justify-center items-center">
            <img
              src={product?.imageUrl}
              alt={product?.name}
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">{product?.name}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {product?.description}
            </p>
            <div className="flex items-center space-x-6">
              <p className="text-2xl font-semibold text-green-600">
                ₹{product?.price}
              </p>
              <button
                onClick={addToCart}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Buy Now
              </button>
            </div>
            <div className="flex flex-col space-y-3 text-gray-600">
              <h3 className="text-lg font-semibold">Product Details:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>High-quality material</li>
                <li>Eco-friendly design</li>
                <li>Durable and long-lasting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
