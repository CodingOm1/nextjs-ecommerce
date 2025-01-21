"use client";

import { IoMdMail } from "react-icons/io";
import { MdPassword } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import FetcherLoad from "@/components/FetcherLoad";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const Data = {
    fullname: {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
    },
    email: email.trim(),
    password: password,
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { firstname: "", email: "", password: "" };

    if (!firstname.trim()) {
      errors.firstname = "First name is required.";
      isValid = false;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "A valid email is required.";
      isValid = false;
    }
    if (!password.trim() || password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
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

    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/user/register`, Data);

      if (response.status === 200 || response.status === 201) {
        setSuccess("Registration successful! ");
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        localStorage.setItem("userId", response.data.user._id);
        router.push("/");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        const errorMessage = err.response.data.message;

        setTimeout(() => {
          setError(errorMessage); // Set the error message
          setTimeout(() => {
            setError("");
          }, 5000);
        }, [error]); // First timeout to show the error message
        toast.error(errorMessage);
      } else {
        toast.error(err.message);
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

        <label className="w-full flex flex-col gap-5">
          <div className="relative w-full">
            <input
              className={`peer w-full px-12 py-2 border-2 rounded-lg outline-none focus:border-green-300 ease-in-out transition-all text-[17px] ${
                formErrors.firstname ? "border-red-500" : ""
              }`}
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <span className="absolute top-3.5 left-4 text-xl text-gray-600 peer-focus:text-green-500 transition-colors">
              <FaUserEdit />
            </span>
            {formErrors.firstname && (
              <div className="text-red-500 text-xs mt-1">
                {formErrors.firstname}
              </div>
            )}
          </div>
          <div className="relative w-full">
            <input
              className={`peer w-full px-4 py-2 border-2 rounded-lg outline-none focus:border-green-300 ease-in-out transition-all text-[17px] ${
                formErrors.lastname ? "border-red-500" : ""
              }`}
              type="text"
              placeholder="Surname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            {formErrors.lastname && (
              <div className="text-red-500 text-xs mt-1">
                {formErrors.lastname}
              </div>
            )}
          </div>
        </label>

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
          value={fetching ? "Loading..." : "Sign Up"}
          className="w-full py-2 rounded-lg bg-green-500 outline-none border-none font-[Poppins] font-semibold text-white cursor-pointer hover:bg-green-600 transition-all ease-in-out"
          disabled={fetching}
        />
      </form>

      <p className="w-full py-2 flex items-center justify-center mt-3 font-[Poppins] text-[14px]">
        Already have an account?
        <Link href="/login">
          <span className="ml-[1px] font-semibold text-green-500 cursor-pointer">
            Login
          </span>
        </Link>
      </p>
    </>
  );
};

export default Register;
