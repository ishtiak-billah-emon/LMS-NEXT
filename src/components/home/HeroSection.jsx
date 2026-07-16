import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-muted">
      {/* Decorative Top Right Curves */}
      <div className="absolute -right-20 top-0 opacity-40">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
          <circle cx="150" cy="150" r="120" stroke="#6366F1" strokeWidth="2" />
          <circle cx="220" cy="100" r="40" stroke="#6366F1" strokeWidth="2" />
        </svg>
      </div>

      {/* Bottom Left Curve */}
      <div className="absolute -bottom-20 -left-20 opacity-40">
        <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
          <path
            d="M20 180C20 80 120 80 120 180"
            stroke="#6366F1"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Floating Dots */}
      <div className="absolute left-20 top-40 h-6 w-6 rounded-full bg-secondary opacity-70" />

      <div className="absolute bottom-32 right-40 h-5 w-5 rounded-full bg-secondary opacity-70" />

      {/* Floating Plus */}
      <div className="absolute right-1/4 top-1/2 text-4xl font-light text-primary opacity-40">
        +
      </div>

      {/* Main Content */}
      <div className="container mx-auto grid min-h-[90vh] items-center gap-10 px-6 py-20 lg:grid-cols-2">
        {/* Left Content */}
        <div className="relative z-10">
          <p className="mb-4 text-lg font-semibold text-primary">
            Learn  Smartly
          </p>

          <h1 className="mb-6 max-w-xl text-5xl font-black leading-tight text-text-primary lg:text-7xl">
            Modern Learning
            <span className="text-primary"> For Students</span>
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-text-secondary">
            Interactive courses, blogs, live guidance, and
            structured learning from Sajan Sir.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary px-8 text-white hover:bg-primary-hover"
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-border px-8 text-text-primary hover:border-primary hover:text-primary"
            >
              <Link href="/about-us">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Right Content */}
        <div className="relative flex items-center justify-center">
          {/* Background Circle */}
          <div className="absolute h-[420px] w-[420px] rounded-full bg-primary/10" />

          {/* Decorative Ring */}
          <div className="absolute h-[500px] w-[500px] rounded-full border border-primary/20" />

          {/* Main Image */}
          <Image
            // src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&autoh=format&fit=crop"
            src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Student"
            width={350}
            height={450}
            priority
            className="relative z-10 h-[450px] w-[350px] rounded-[40px] object-cover shadow-2xl"
          />

          {/* Floating Cards */}
          <div className="absolute left-0 top-20 flex min-h-[5.5rem] min-w-[10rem] flex-col items-center justify-center rounded-3xl bg-primary p-5 text-white shadow-xl">
            <p className="text-sm font-semibold">🚀 Smart Learning</p>
          </div>

          <div className="absolute bottom-16 right-0 flex min-h-[5.5rem] min-w-[10rem] flex-col items-center justify-center rounded-3xl bg-white p-5 shadow-xl">
            <p className="text-sm font-bold text-text-primary">10K+ Students</p>
            <p className="text-xs text-text-secondary">Learning daily</p>
          </div>
        </div>
      </div>
    </section>
  );
}
