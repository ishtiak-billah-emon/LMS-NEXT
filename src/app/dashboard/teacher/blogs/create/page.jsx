"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, ImageIcon, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogEditor from "@/components/blogs/BlogEditor";
import { serializeBlocks } from "@/components/blogs/BlogEditor";
import { blogService } from "@/services/blog.services";

export default function CreateBlogPage() {
  const router = useRouter();
  const thumbnailInputRef = useRef(null);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFormData((current) => ({
      ...current,
      thumbnail: file,
      thumbnailPreview: URL.createObjectURL(file),
    }));
  };

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append("image", file);
    const response = await blogService.uploadBlogImage(data);
    const imageUrl = response?.url;
    if (!imageUrl) throw new Error("The image upload did not return a URL.");
    return imageUrl;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = serializeBlocks(blocks);
    if (!content) {
      setError("Add at least one paragraph or image before saving.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("content", content);
      data.append("excerpt", formData.excerpt.trim());
      data.append("tags", JSON.stringify(formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)));
      data.append("status", formData.status);
      if (formData.thumbnail instanceof File) {
        data.append("thumbnail", formData.thumbnail);
      }

      await blogService.createBlog(data);
      router.push("/dashboard/teacher/blogs");
    } catch (err) {
      setError(err?.message || "Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Blog</h1>
          <p className="text-muted-foreground">Build your post with paragraphs and Cloudinary-hosted images.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setPreview((current) => !current)}>
          <Eye className="mr-2 h-4 w-4" />
          {preview ? "Edit" : "Preview"}
        </Button>
      </div>

      {error && <div role="alert" className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Blog details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Blog title"
              required
            />
            <Textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Short summary (optional)"
              rows={3}
            />
            <Input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Tags, separated by commas"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="draft">Save as draft</option>
              <option value="published">Publish now</option>
            </select>
            <div className="space-y-2">
              <p className="text-sm font-medium">Thumbnail (optional)</p>
              {formData.thumbnailPreview && (
                <img
                  src={formData.thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-44 w-full rounded-md object-cover"
                />
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => thumbnailInputRef.current?.click()}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Choose thumbnail
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogEditor
              blocks={blocks}
              onChange={setBlocks}
              preview={preview}
              onImageUpload={handleImageUpload}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || preview}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : formData.status === "published" ? "Publish blog" : "Save draft"}
          </Button>
        </div>
      </form>
    </div>
  );
}
