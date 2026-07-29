"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Eye, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogEditor, serializeBlocks } from "@/components/blogs/BlogEditor";
import { blogService } from "@/services/blog.services";

export default function CreateBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    thumbnail: null,
    thumbnailPreview: "",
    tags: "",
    status: "draft",
  });
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const content = serializeBlocks(blocks);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", content);
      data.append("excerpt", formData.excerpt);
      data.append("tags", JSON.stringify(formData.tags.split(",").map((t) => t.trim()).filter(Boolean)));
      data.append("status", formData.status);

      if (formData.thumbnail instanceof File) {
        data.append("thumbnail", formData.thumbnail);
      }

      await blogService.createBlog(data);
      router.push("/dashboard/teacher/blogs");
    } catch (err) {
      setError(err.message || "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Blog</h1>
          <p className="text-muted-foreground">
            Share your knowledge and insights with students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setPreview(!preview)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {preview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}
