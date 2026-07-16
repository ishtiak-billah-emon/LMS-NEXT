import Image from "next/image";
import { Star, Trash2 } from "lucide-react";

import { getCourseReviews } from "@/lib/server/reviews";
import ReviewForm from "./ReviewForm";
import DeleteReviewButton from "./DeleteReviewButton";
import { getOptionalCurrentUser } from "@/lib/server/auth";

export default async function ReviewSection({ courseId, isEnrolled }) {
  const user = await getOptionalCurrentUser();
  const { reviews, pagination } = await getCourseReviews(courseId);

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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <p className="mb-3 text-lg font-semibold text-primary">
            Student Reviews
          </p>
          <h2 className="text-4xl font-black text-text-primary">
            What Our Students Say
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ReviewForm courseId={courseId} isEnrolled={isEnrolled} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="rounded-[24px] border border-border bg-card p-8 text-center">
                <p className="text-text-secondary">
                  No reviews yet. Be the first to review this course!
                </p>
              </div>
            ) : (
              reviews.map((review) => {
                const isTeacher = user && review.course?.teacher?._id === user._id;
                const isReviewOwner = user && review.student?._id === user._id;

                return (
                  <div
                    key={review._id}
                    className="rounded-[24px] border border-border bg-card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                          {review.student?.avatar ? (
                            <Image
                              src={review.student.avatar}
                              alt={review.student.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-bold text-primary">
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

                      {(isTeacher || isReviewOwner) && (
                        <DeleteReviewButton reviewId={review._id} isTeacher={!!isTeacher} />
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                      {review.comment}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
