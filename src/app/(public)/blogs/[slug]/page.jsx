import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { getBlogBySlug } from "@/lib/server/blog";
import BlogActions from "./BlogActions";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || !blog._id) {
    notFound();
  }

  const date = blog.publishedAt || blog.createdAt;

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
      </section>

      <article className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{blog.author?.fullName || "Admin"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {date ? new Date(date).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>

            <BlogActions blog={blog} />
          </div>

          {blog.thumbnail && (
            <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-2xl">
              <Image
                src={blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="mb-8 text-4xl font-black leading-tight text-text-primary md:text-5xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mb-8 text-xl leading-relaxed text-text-secondary">
              {blog.excerpt}
            </p>
          )}

          <div className="prose prose-lg max-w-none">
            <div
              className="blog-content leading-8 text-text-secondary"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </article>
    </main>
  );
}
