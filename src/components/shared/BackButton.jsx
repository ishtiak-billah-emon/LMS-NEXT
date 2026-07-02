"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{
        x: -5,
        scale: 1.03,
        backgroundColor: "#6366F1",
        color: "#ffffff",
      }}
      whileTap={{
        scale: 0.95,
      }}
      onClick={() => router.back()}
      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm transition hover:shadow-md"
    >
      <ArrowLeft size={18} />
      <span>Back</span>
    </motion.button>
  );
}
