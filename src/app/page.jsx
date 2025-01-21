"use client";

import FetcherLoad from "@/components/FetcherLoad";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Initialized as null for better state management
  const router = useRouter();

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/get/all");
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      setError("Failed to load products. Please try again.");
      setLoading(false);
    }
  };

  // Fetch user info and validate login status
  const fetchUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warn("You are not authorized. Please log in first.");
      router.push("/login"); // Redirect to login if no userId in localStorage
      return;
    }

    try {
      const response = await axios.get(`/api/user/get/${userId}`);
      if (response.status === 200) {
        setUser(true); // User is authenticated
      } else {
        throw new Error("Unauthorized");
      }
    } catch {
      toast.warn("You are not authorized. Please log in first.");
      router.push("/login"); // Redirect to login if authentication fails
    }
  };

  // Fetch products only after confirming user authentication
  useEffect(() => {
    fetchUser(); // Check user status when component mounts
  }, []);

  useEffect(() => {
    if (user === null) return; // Wait for user to be checked
    if (user === true) {
      fetchProducts(); // Fetch products if user is authenticated
    }
  }, [user]);

  // Add product to the cart
  const addToCart = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`/api/cart/add/${userId}`, {
        productId: product._id,
      });

      if (response.status === 200) {
        toast.success(response.data.message); // Show success message
      }
    } catch (error) {
      toast.error("Failed to add product to cart."); // Show error if the request fails
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="max-w-screen-xl mx-auto p-6">
        {loading ? (
          <FetcherLoad /> // Display loading component while fetching
        ) : error ? (
          <h2 className="text-center text-red-600">{error}</h2> // Display error message if fetch fails
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
