"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Eye, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogService } from "@/services/blog.services";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [blogId, setBlogId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    thumbnail: null,
    thumbnailPreview: "",
    tags: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  const fetchBlog = async (id) => {
    setLoading(true);
    setError("");

    try {
      const blog = await blogService.getBlogById(id);
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        thumbnail: null,
        thumbnailPreview: blog.thumbnail || "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
        status: blog.status || "draft",
      });
    } catch (err) {
      setError(err.message || "Failed to fetch blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const resolvedParams = params.then((p) => {
      setBlogId(p.blogId);
      return p.blogId;
    });

    resolvedParams.then((id) => {
      fetchBlog(id);
    });
  }, [params]);

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
    if (!blogId) return;

    setSaving(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("excerpt", formData.excerpt);
      data.append("tags", JSON.stringify(formData.tags.split(",").map((t) => t.trim()).filter(Boolean)));
      data.append("status", formData.status);

      if (formData.thumbnail instanceof File) {
        data.append("thumbnail", formData.thumbnail);
      }

      await blogService.updateBlog(blogId, data);
      router.push("/dashboard/teacher/blogs");
    } catch (err) {
      setError(err.message || "Failed to update blog.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Blog</h1>
          <p className="text-muted-foreground">
            Update your blog post.
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

      {preview ? (
        <Card>
          <CardContent className="p-8">
            {formData.thumbnailPreview && (
              <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-2xl">
                <Image
                  src={formData.thumbnailPreview}
                  alt={formData.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <h1 className="mb-4 text-3xl font-bold">{formData.title || "Untitled"}</h1>

            {formData.excerpt && (
              <p className="mb-6 text-lg text-text-secondary">{formData.excerpt}</p>
            )}

            <div
              className="prose prose-lg max-w-none leading-8"
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Excerpt
                </label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief description of the blog"
                  rows={2}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Content <span className="text-destructive">*</span>
                </label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog content here. You can use HTML tags."
                  rows={15}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  You can use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;img&gt;, &lt;a&gt; etc.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tags
                </label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="math, theory, fun (comma separated)"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  {formData.thumbnailPreview && (
                    <div className="relative h-20 w-32 overflow-hidden rounded-lg">
                      <Image
                        src={formData.thumbnailPreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {formData.thumbnailPreview ? "Change Image" : "Upload Image"}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Update Blog"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
