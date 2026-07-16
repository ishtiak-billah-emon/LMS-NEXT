"use client";

import { useState, useEffect } from "react";
import { Heart, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlogActions({ blog }) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("blogWishlist") || "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsWishlisted(wishlist.some((item) => item._id === blog._id));
  }, [blog._id]);

  const toggleWishlist = () => {
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

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleWishlist}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 transition ${
          isWishlisted
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-white text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Heart
          className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
        />
        {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
      </button>

      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-600 transition hover:bg-gray-50"
      >
        Back
      </button>
    </div>
  );
}
