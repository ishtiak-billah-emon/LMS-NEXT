"use client";

import { useState, useTransition } from "react";
import { createEnrollment } from "../actions";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateEnrollmentDialog({ open, onOpenChange }) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    studentEmail: "",
    courseSlug: "",
    courseId: "",
    totalAmount: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      studentEmail: "",
      courseSlug: "",
      courseId: "",
      totalAmount: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await createEnrollment({
          email: formData.studentEmail,
          courseId: formData.courseId,
          amount: Number(formData.totalAmount),
        });

        resetForm();
        onOpenChange(false);

        alert("Enrollment created successfully.");
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to create enrollment.");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Enrollment</DialogTitle>

          <DialogDescription>Enroll a student into a course.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="studentEmail">Student Email</Label>

            <Input
              id="studentEmail"
              name="studentEmail"
              placeholder="student@email.com"
              value={formData.studentEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseSlug">Course Slug</Label>

            <Input
              id="courseSlug"
              name="courseSlug"
              placeholder="complete-web-development"
              value={formData.courseSlug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Course ID</Label>

            <Input
              id="courseId"
              name="courseId"
              placeholder="Course ObjectId"
              value={formData.courseId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>

            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              min="0"
              placeholder="0"
              value={formData.totalAmount}
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Enrollment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
