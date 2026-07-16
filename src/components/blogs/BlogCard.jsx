import Link from "next/link";
import Image from "next/image";
import { Heart, BookOpen, Calendar } from "lucide-react";
import { useState } from "react";

export default function BlogCard({ blog }) {
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === "undefined") return false;

    const wishlist = JSON.parse(localStorage.getItem("blogWishlist") || "[]");
    return wishlist.some((item) => item._id === blog._id);
  });

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("blogWishlist") || "[]");
    const exists = wishlist.some((item) => item._id === blog._id);

    if (exists) {
      const updated = wishlist.filter((item) => item._id !== blog._id);
      localStorage.setItem("blogWishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("blog-wishlist-updated"));
      setIsWishlisted(false);
    } else {
      wishlist.push({
        _id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt,
        thumbnail: blog.thumbnail,
        slug: blog.slug,
        author: blog.author,
        createdAt: blog.createdAt,
      });
      localStorage.setItem("blogWishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("blog-wishlist-updated"));
      setIsWishlisted(true);
    }
  };

  const date = blog.publishedAt || blog.createdAt;

  return (
    <Link href={`/blogs/${blog.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <button
            onClick={toggleWishlist}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2 text-xs text-text-secondary">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {date ? new Date(date).toLocaleDateString() : "—"}
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight text-text-primary transition group-hover:text-primary">
            {blog.title}
          </h3>

          <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">
            {blog.excerpt || blog.content?.replace(/<[^>]*>/g, "").slice(0, 150) || "No description"}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-primary">
              Read more
            </span>

            <span className="text-sm text-text-secondary">
              {blog.author?.fullName || "Admin"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
