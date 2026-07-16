"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { deleteEnrollment } from "../actions";

export default function DeleteEnrollmentDialog({
  open,
  onOpenChange,
  enrollment,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!enrollment) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteEnrollment(enrollment._id);

      onOpenChange(false);

      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete enrollment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Enrollment</DialogTitle>

          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-md border bg-muted/40 p-4">
          <div>
            <span className="font-medium">Student:</span>{" "}
            {enrollment.studentEmail}
          </div>

          <div>
            <span className="font-medium">Course:</span>{" "}
            {enrollment.courseTitle}
          </div>

          <div>
            <span className="font-medium">Amount:</span> ৳
            {enrollment.totalAmount}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
