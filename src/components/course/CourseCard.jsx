import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star, Users } from "lucide-react";

export default function CourseCard({ course }) {
  <BookOpen className="h-4 w-4" />;
  {
    course.totalLessons;
  }

  return (
    <article className="group overflow-hidden rounded-[24px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          width={600}
          height={400}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" // newly added
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
          {course.classType}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <p className="mb-2 text-sm font-medium text-primary">
          {course.category}
        </p>

        {/* Title */}
        <h2 className="mb-3 line-clamp-2 text-2xl font-bold leading-snug text-text-primary">
          {course.title}
        </h2>

        {/* Description */}
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {course.description}
        </p>

        {/* Stats */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {course.rating?.toFixed(1) ?? "0.0"}
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {course.totalStudents.toLocaleString()} Students
          </div>

          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {/* {totalLessons} Lessons */}
            <span> Total lesson Will add later</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl font-black text-primary">
            ৳{course.discountPrice.toLocaleString()}
          </span>

          <span className="text-lg line-through text-text-secondary">
            ৳{course.price.toLocaleString()}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
        >
          View Course
        </Link>
      </div>
    </article>
  );
}
