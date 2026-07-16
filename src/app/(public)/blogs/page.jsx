"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs`);
        const data = await res.json();
        setBlogs(data?.data?.blogs || data?.blogs || []);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-text-primary md:text-5xl">
            Our <span className="text-primary">Blogs</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary">
            Insights, theories, and learning materials from our teachers.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">No blogs published yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
