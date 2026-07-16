"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PasswordInput from "@/components/settings/PasswordInput";

const MIN_PASSWORD_LENGTH = 6;

const EMPTY_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordSection() {
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

    if (!form.oldPassword) {
      nextErrors.oldPassword = "Current password is required";
    }

    if (!form.newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
      nextErrors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    } else if (form.newPassword === form.oldPassword) {
      nextErrors.newPassword = "New password must be different from your current password";
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
      await authService.changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      setForm(EMPTY_FORM);
      setErrors({});
      setStatus({
        type: "success",
        message: "Your password has been changed successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "Failed to change password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Use a strong password you don&apos;t use anywhere else.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <PasswordInput
            id="oldPassword"
            label="Current Password"
            value={form.oldPassword}
            onChange={handleChange("oldPassword")}
            placeholder="Enter current password"
            autoComplete="current-password"
            error={errors.oldPassword}
          />

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
              className={`rounded-lg border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
