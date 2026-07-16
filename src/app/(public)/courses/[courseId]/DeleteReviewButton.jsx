"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { removeReview } from "./deleteReviewAction";
import { Button } from "@/components/ui/button";

export default function DeleteReviewButton({ reviewId, isTeacher }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await removeReview(reviewId);
        setShowConfirm(false);
        router.refresh();
      } catch (err) {
        alert(err.message || "Failed to delete review");
      }
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="h-8 w-8 text-text-secondary hover:text-red-500"
        title={isTeacher ? "Delete as teacher" : "Delete review"}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-text-primary">
              Delete Review
            </h3>
            <p className="mb-6 text-sm text-text-secondary">
              {isTeacher
                ? "Are you sure you want to delete this review? This action cannot be undone."
                : "Are you sure you want to delete your review? This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
