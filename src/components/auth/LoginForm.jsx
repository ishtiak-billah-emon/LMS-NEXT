"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import BackButton from "../shared/BackButton";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const user = await login(formData);
      const role = user.role;

      setMessage("Login successful!");
      setMessageType("success");

      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "teacher") router.push("/dashboard/teacher");
      else router.push("/dashboard/student");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      email: "",
      password: "",
    });

    setMessage("");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <BackButton />
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>

        <p className="mt-2 text-gray-500">Start your learning journey today.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>

          <input
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all duration-300 focus:border-black focus:ring-4 focus:ring-gray-200"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 outline-none transition-all duration-300 focus:border-black focus:ring-4 focus:ring-gray-200"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-black"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              messageType === "success"
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="w-1/2 rounded-xl border border-gray-300 py-3 font-medium transition-all duration-300 hover:border-black hover:bg-gray-100"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-1/2 rounded-xl bg-primary py-3 font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-secondary-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
