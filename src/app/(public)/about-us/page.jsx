import {
  GraduationCap,
  BookOpen,
  PlayCircle,
  Target,
  Eye,
  Users,
} from "lucide-react";

export const metadata = {
  title: "About Us | Tutor Time",
};

export default function AboutPage() {
  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              About Tutor Time
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight text-text-primary md:text-6xl">
              Learn Smarter.
              <br />
              <span className="text-primary">Grow Faster.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-text-secondary">
              Tutor Time is a modern online learning platform that helps
              students learn through structured video lessons, organized course
              materials, and an engaging learning experience. Our goal is to
              make quality education accessible, practical, and enjoyable for
              every learner.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-black text-text-primary">
            Why Choose Tutor Time?
          </h2>

          <p className="mt-4 text-lg text-text-secondary">
            Everything students need to learn effectively in one place.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Structured Courses"
            description="Well-organized lessons designed to help students learn step by step."
          />

          <FeatureCard
            icon={<PlayCircle className="h-8 w-8" />}
            title="Video Learning"
            description="High-quality video lectures that simplify difficult concepts."
          />

          <FeatureCard
            icon={<GraduationCap className="h-8 w-8" />}
            title="Track Progress"
            description="Monitor completed lessons and stay motivated throughout your learning journey."
          />

          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Student Focused"
            description="A clean, responsive, and distraction-free learning experience."
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-card py-20">
        <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-background p-10">
            <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
              <Target className="h-8 w-8" />
            </div>

            <h3 className="mb-4 text-3xl font-bold text-text-primary">
              Our Mission
            </h3>

            <p className="leading-8 text-text-secondary">
              Our mission is to make learning simple, engaging, and accessible
              through modern technology. We strive to provide students with a
              platform where they can build knowledge, improve confidence, and
              achieve their academic goals at their own pace.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background p-10">
            <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
              <Eye className="h-8 w-8" />
            </div>

            <h3 className="mb-4 text-3xl font-bold text-text-primary">
              Our Vision
            </h3>

            <p className="leading-8 text-text-secondary">
              We envision a future where quality education is available to
              everyone. Tutor Time aims to become a trusted learning platform
              that empowers students to continuously develop their skills and
              unlock new opportunities through lifelong learning.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-bold text-text-primary">{title}</h3>

      <p className="leading-7 text-text-secondary">{description}</p>
    </div>
  );
}
