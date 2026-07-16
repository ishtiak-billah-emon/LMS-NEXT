"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";

import BlogCard from "@/components/blogs/BlogCard";

const WISHLIST_UPDATED_EVENT = "blog-wishlist-updated";
const EMPTY_WISHLIST = [];
let cachedWishlist = EMPTY_WISHLIST;
let cachedWishlistValue = null;

function getWishlist() {
  try {
    const wishlistValue = localStorage.getItem("blogWishlist") || "[]";

    if (wishlistValue === cachedWishlistValue) return cachedWishlist;

    const wishlist = JSON.parse(wishlistValue);
    cachedWishlist = Array.isArray(wishlist) ? wishlist : EMPTY_WISHLIST;
    cachedWishlistValue = wishlistValue;

    return cachedWishlist;
  } catch {
    return EMPTY_WISHLIST;
  }
}

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(WISHLIST_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(WISHLIST_UPDATED_EVENT, callback);
  };
}

export default function WishlistPage() {
  const blogs = useSyncExternalStore(subscribe, getWishlist, () => EMPTY_WISHLIST);

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
            <Heart size={22} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Wishlist</h1>
            <p className="mt-1 text-slate-600">
              Blogs you saved to read later.
            </p>
          </div>
        </div>
      </div>

      {blogs.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Heart className="mx-auto h-10 w-10 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            Your wishlist is empty
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Save blogs to quickly find them here later.
          </p>
          <Link
            href="/blogs"
            className="mt-6 inline-flex min-h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Browse blogs
          </Link>
        </div>
      )}
    </div>
  );
}
