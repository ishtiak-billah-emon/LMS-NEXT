import Image from "next/image";
import { Star, Trash2 } from "lucide-react";

import { getCourseReviews } from "@/lib/server/reviews";
import DeleteReviewButton from "@/app/(public)/courses/[courseId]/DeleteReviewButton";

export default async function TeacherReviewsSection({ courseId, teacherId }) {
  const { reviews } = await getCourseReviews(courseId);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Student Reviews</h2>

      {reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-lg border bg-background p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    {review.student?.avatar ? (
                      <Image
                        src={review.student.avatar}
                        alt={review.student.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-bold text-primary">
                        {review.student?.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-primary">
                      {review.student?.fullName}
                    </h4>
                    {renderStars(review.rating)}
                    <p className="mt-1 text-xs text-text-secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <DeleteReviewButton reviewId={review._id} isTeacher={true} />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
