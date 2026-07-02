"use client";

import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { ArrowUpRight, Star, Users, BookOpen } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeaturedCourses({ courses }) {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Blur */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

      {/* Decorative circles */}
      <div className="absolute left-10 top-20 opacity-30">
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
          <circle cx="140" cy="140" r="100" stroke="#6366F1" strokeWidth="1" />

          <circle cx="140" cy="140" r="60" stroke="#6366F1" strokeWidth="1" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left */}
          <div>
            <div className="mb-5 inline-flex rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
              Featured Courses
            </div>

            <h2 className="max-w-3xl text-4xl font-black leading-tight text-text-primary md:text-5xl">
              Learn Smarter With
              <span className="text-primary"> Premium Courses</span>
            </h2>
          </div>

          {/* Right */}
          <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
            Structured learning paths designed for SSC, HSC, and admission
            students with premium lesson experience and modern learning
            methodology.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          loop
          speed={1000}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          navigation
          pagination={{
            clickable: true,
          }}
          spaceBetween={30}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
            },
            768: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
            },
          }}
          className="!pb-16"
        >
          {courses.map((course) => (
            <SwiperSlide key={course.slug}>
              <Link
                href={`/courses/${course.slug}`}
                className="group block h-full"
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] border border-border bg-card shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-primary/10">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={700}
                      height={450}
                      className="h-[260px] w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Category */}
                    <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-primary shadow-lg backdrop-blur-xl">
                      {course.category}
                    </div>

                    {/* Arrow */}
                    <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="h-5 w-5 " />
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-5 right-5 rounded-2xl bg-white/90 px-4 py-2 shadow-lg backdrop-blur-xl">
                      <p className="text-xl font-black text-primary">
                        ৳{course.discountPrice}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Stats */}
                    <div className="mb-5 flex items-center gap-4">
                      <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                        <span>{course.rating}</span>
                      </div>

                      <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium text-text-secondary">
                        <Users className="h-4 w-4" />

                        <span>{course.totalStudents}+</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-4 line-clamp-2 text-2xl font-black leading-tight text-text-primary transition group-hover:text-primary">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 line-clamp-3 flex-1 leading-relaxed  text-black">
                      {course.description}
                    </p>

                    {/* Teacher */}
                    <p className="mb-6 flex-1 leading-relaxed text-text-secondary">
                      Instructor: {course.teacher.fullName}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                        {/* Lessons */}
                        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                          <BookOpen className="h-4 w-4 text-primary" />

                          <span>0{course.sections?.length} Sections</span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-2 font-semibold text-primary">
                        Explore
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
