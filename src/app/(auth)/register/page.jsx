"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import BackButton from "@/components/shared/BackButton";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const Register = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const { register: registerUser, loading } = useAuth();

  const handleRegistration = async (data) => {
    setError("");

    try {
      const payload = {
        fullName: data.name.trim(),
        userName: data.userName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password,
      };

      const response = await registerUser(payload);

      // console.log("Registration Success:", response);

      reset();

      router.push("/login");
    } catch (error) {
      console.error("Registration Failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      if (message.includes("duplicate key") || message.includes("phone")) {
        setError("This phone number is already registered. Please use a different number or log in.");
      } else {
        setError(message);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 md:mb-8">
          <BackButton />
        </div>

        <h1 className="text-3xl font-bold text-text-primary">Create Account</h1>

        <p className="mt-2 text-text-secondary">
          Start your learning journey today.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleRegistration)}>
        <FieldGroup className="space-y-5">
          {/* Full Name */}
          <Field className="space-y-1">
            <FieldLabel>Full Name</FieldLabel>

            <Input
              placeholder="John Doe"
              type="text"
              autoComplete="name"
              className="p-4 border-border focus-visible:border-primary focus-visible:ring-primary/20"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s.'-]{2,50}$/,
                  message: "Only alphabets are allowed",
                },
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </Field>
          {/* Username */}
          <Field className="space-y-1">
            <FieldLabel>User Name</FieldLabel>

            <Input
              placeholder="Enter a Username"
              type="text"
              className="p-4 border-border focus-visible:border-primary focus-visible:ring-primary/20"
              {...register("userName", {
                required: "Username is required",
                minLength: {
                  value: 2,
                  message: "Username must be at least 2 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]{3,20}$/,
                  message:
                    "Username can contain letters, numbers and underscore only",
                },
              })}
            />

            {errors.userName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.userName.message}
              </p>
            )}
          </Field>
          {/* Email */}
          <Field className="space-y-1">
            <FieldLabel>Email</FieldLabel>

            <Input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className="p-4 border-border focus-visible:border-primary focus-visible:ring-primary/20"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </Field>
          {/* Phone */}
          <Field className="space-y-1">
            <FieldLabel>Phone Number</FieldLabel>

            <Input
              type="tel"
              autoComplete="tel"
              placeholder="Phone Number"
              className="p-4 border-border focus-visible:border-primary focus-visible:ring-primary/20"
              {...register("phone", {
                required: "Phone Number is required",
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message:
                    "Enter a valid Bangladeshi phone number. Phone number must start with 01.",
                },
              })}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}

            {error && (
              <p role="alert" className="mt-1 text-sm text-red-500">
                {error}
              </p>
            )}
          </Field>{" "}
          {/* Password */}
          <Field className="space-y-1">
            <FieldLabel>Password</FieldLabel>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter password"
                className="p-4 pr-12 border-border focus-visible:border-primary focus-visible:ring-primary/20"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password cannot exceed 20 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                    message:
                      "Password must contain uppercase, lowercase, number and special character",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition hover:text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </Field>
          {/* Confirm Password */}
          <Field className="space-y-1">
            <FieldLabel>Confirm Password</FieldLabel>

            <div className="relative">
              <Input
                type={showRePassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-Type your password"
                className="pr-12 border-border focus-visible:border-primary focus-visible:ring-primary/20"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />

              <button
                type="button"
                onClick={() => setShowRePassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition hover:text-primary"
              >
                {showRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </Field>
          {/* Buttons */}
          <Field orientation="horizontal w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="w-1/2 rounded-xl border-border px-6 py-5 transition-all duration-300 hover:border-primary hover:bg-muted"
            >
              Clear
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-1/2 rounded-xl px-6 py-5 text-white font-medium shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-primary hover:bg-primary-hover"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      {/* Sign Up Link */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
