"use client";

import { useSyncExternalStore } from "react";

const WISHLIST_UPDATED_EVENT = "blog-wishlist-updated";

function getWishlistCount() {
  try {
    return JSON.parse(localStorage.getItem("blogWishlist") || "[]").length;
  } catch {
    return 0;
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

export default function WishlistCount() {
  const count = useSyncExternalStore(subscribe, getWishlistCount, () => 0);

  return count;
}
