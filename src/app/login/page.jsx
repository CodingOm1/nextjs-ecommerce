"use client";

import { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { MdPassword } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FetcherLoad from "@/components/FetcherLoad"; // Assuming you already have this component

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const errors = { email: "", password: "" };

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "A valid email is required.";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFetching(true);
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setFetching(false);
      return; // Stop submission if validation fails
    }

    const data = {
      email: email.trim(),
      password,
    };

    try {
      const response = await axios.post("/api/user/login", data);

      if (response.data.status === 200) {
        setSuccess("Login successful!");
        // Redirect the user to their dashboard or home page
        localStorage.setItem("userId", response.data.user._id);
        router.push("/"); // Replace with your desired route
      } else {
        setError("Invalid email or password.");
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      // Handle different error scenarios
      if (err.response) {
         if (err.response.data && err.response.data.message) {
          const errorMessage = err.response.data.message;

          setTimeout(() => {
            setError(errorMessage); // Set the error message
            setTimeout(() => {
              setError("");
            }, 5000);
          }, [error]); // First timeout to show the error message
          toast.error(errorMessage);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setFetching(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="form_auth w-full h-full pt-5 px-4 flex flex-col items-center justify-start gap-5"
      >
        <ToastContainer />
        {fetching && <FetcherLoad />}

        {/* Success Message */}
        {success && (
          <div className="w-full bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <label className="w-full">
          <div className="relative w-full">
            <input
              className={`peer w-full px-12 py-2 border-2 rounded-lg outline-none focus:border-green-300 ease-in-out transition-all text-[17px] ${
                formErrors.email ? "border-red-500" : ""
              }`}
              type="email"
              placeholder="joen@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="absolute top-3.5 left-4 text-xl text-gray-600 peer-focus:text-green-500 transition-colors">
              <IoMdMail />
            </span>
            {formErrors.email && (
              <div className="text-red-500 text-xs mt-1">
                {formErrors.email}
              </div>
            )}
          </div>
        </label>

        <label className="w-full">
          <div className="relative w-full">
            <input
              className={`peer w-full px-12 py-2 border-2 rounded-lg outline-none focus:border-green-300 ease-in-out transition-all text-[17px] ${
                formErrors.password ? "border-red-500" : ""
              }`}
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute top-3.5 left-4 text-xl text-gray-600 peer-focus:text-green-500 transition-colors">
              <MdPassword />
            </span>
            {formErrors.password && (
              <div className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </div>
            )}
          </div>
        </label>

        <input
          type="submit"
          value={fetching ? "Loading..." : "Login"}
          className="w-full py-2 rounded-lg bg-green-500 outline-none border-none font-[Poppins] font-semibold text-white cursor-pointer hover:bg-green-600 transition-all ease-in-out"
          disabled={fetching}
        />
      </form>

      <p className="w-full py-2 flex items-center justify-center mt-3 font-[Poppins] text-[14px]">
        Don't have an account?
        <Link href="/register">
          <span className="ml-[1px] font-semibold text-green-500 cursor-pointer">
            Create New
          </span>
        </Link>
      </p>
    </>
  );
};

export default Login;
