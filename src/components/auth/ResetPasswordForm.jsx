"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.services";
import BackButton from "@/components/shared/BackButton";
import PasswordInput from "@/components/settings/PasswordInput";

const MIN_PASSWORD_LENGTH = 8;

const PASSWORD_RULES =
  "Must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.";

const EMPTY_FORM = {
  newPassword: "",
  confirmPassword: "",
};

export default function ResetPasswordForm({ token }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setStatus({ type: "", message: "" });
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (
      form.newPassword.length < MIN_PASSWORD_LENGTH ||
      !/[A-Z]/.test(form.newPassword) ||
      !/[a-z]/.test(form.newPassword) ||
      !/[0-9]/.test(form.newPassword) ||
      !/[^A-Za-z0-9]/.test(form.newPassword)
    ) {
      nextErrors.newPassword = PASSWORD_RULES;
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password";
    } else if (form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const data = await authService.resetPassword(
        token,
        form.newPassword
      );
      setForm(EMPTY_FORM);
      setStatus({
        type: "success",
        message:
          data?.message ||
          "Password has been reset successfully. You can now log in with your new password.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 md:mb-8">
        <BackButton />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reset password</h1>
        <p className="mt-2 text-gray-500">Choose a new password for your account.</p>
      </div>

      {status.type === "success" ? (
        <div className="space-y-6">
          <div
            role="alert"
            className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {status.message}
          </div>
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-secondary-800 hover:shadow-lg"
          >
            <CheckCircle2 size={18} />
            Continue to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <PasswordInput
            id="newPassword"
            label="New Password"
            value={form.newPassword}
            onChange={handleChange("newPassword")}
            placeholder="Enter new password"
            autoComplete="new-password"
            error={errors.newPassword}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          {status.message && (
            <div
              role="alert"
              className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-secondary-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Resetting...
              </span>
            ) : (
              "Reset password"
            )}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
