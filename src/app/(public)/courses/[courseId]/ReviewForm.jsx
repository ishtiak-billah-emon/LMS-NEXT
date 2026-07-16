"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";

import { submitReview } from "./reviewActions";
import { Button } from "@/components/ui/button";

export default function ReviewForm({ courseId, isEnrolled }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isEnrolled) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    startTransition(async () => {
      try {
        await submitReview(courseId, rating, comment);
        setRating(0);
        setComment("");
        setSuccess("Review submitted successfully");
      } catch (err) {
        setError(err.message || "Failed to submit review");
      }
    });
  };

  return (
    <div className="rounded-[24px] border border-border bg-card p-6">
      <h3 className="mb-4 text-xl font-bold text-text-primary">
        Write a Review
      </h3>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            Your Review
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course..."
            rows={4}
            className="min-h-[120px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-2xl bg-primary px-6 font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}
