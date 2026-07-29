"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditEnrollmentDialog({
  open,
  onOpenChange,
  enrollment,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseSlug: "",
    courseId: "",
    totalAmount: "",
  });

  useEffect(() => {
    if (enrollment) {
      setFormData({
        courseSlug: enrollment.courseSlug,
        courseId: enrollment.courseId,
        totalAmount: enrollment.totalAmount,
      });
    }
  }, [enrollment]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // TODO:
      // await updateEnrollment(enrollment._id, formData);

      // console.log("Updating:", enrollment._id, formData);

      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!enrollment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Enrollment</DialogTitle>

          <DialogDescription>
            Update the enrollment information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Student Email</Label>

            <Input value={enrollment.studentEmail} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseSlug">Course Slug</Label>

            <Input
              id="courseSlug"
              name="courseSlug"
              value={formData.courseSlug}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Course ID</Label>

            <Input
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Amount</Label>

            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              min="0"
              value={formData.totalAmount}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
