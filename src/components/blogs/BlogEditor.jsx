"use client";

import { useState, useRef, useCallback } from "react";
import { ImageIcon, Plus, Trash2, GripVertical, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function generateId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function serializeBlocks(blocks) {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  return blocks
    .map((block) => {
      if (block.type === "image") {
        const src = block.content || "";
        return src ? `<img src="${escapeHtml(src)}" alt="Blog image" />` : "";
      }
      const text = block.content || "";
      return text ? `<p>${escapeHtml(text).replace(/\n/g, "<br />")}</p>` : "";
    })
    .join("\n");
}

function parseHtmlToBlocks(html) {
  if (!html || !html.trim()) return [];

  const blocks = [];
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const pRegex = /<p[^>]*>(.*?)<\/p>/gs;
  const hRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gs;

  let lastIndex = 0;
  const parts = [];

  const imgMatches = [...html.matchAll(imgRegex)];
  const pMatches = [...html.matchAll(pRegex)];
  const hMatches = [...html.matchAll(hRegex)];

  const allMatches = [
    ...imgMatches.map((m) => ({ index: m.index, match: m[0], type: "image", content: m[1], tag: "" })),
    ...pMatches.map((m) => ({ index: m.index, match: m[0], type: "paragraph", content: m[1], tag: "" })),
    ...hMatches.map((m) => ({ index: m.index, match: m[0], type: "paragraph", content: m[2], tag: m[1] })),
  ];

  allMatches.sort((a, b) => a.index - b.index);

  for (const m of allMatches) {
    if (m.index > lastIndex) {
      const between = html.slice(lastIndex, m.index).replace(/<[^>]+>/g, "").trim();
      if (between) {
        parts.push({ type: "paragraph", content: between });
      }
    }
    parts.push({ type: m.type, content: m.content });
    lastIndex = m.index + m.match.length;
  }

  if (lastIndex < html.length) {
    const remaining = html.slice(lastIndex).replace(/<[^>]+>/g, "").trim();
    if (remaining) {
      parts.push({ type: "paragraph", content: remaining });
    }
  }

  if (parts.length === 0) {
    const plain = html.replace(/<[^>]+>/g, "").trim();
    if (plain) {
      parts.push({ type: "paragraph", content: plain });
    }
  }

  return parts.map((p) => ({ id: generateId(), type: p.type, content: p.content }));
}

function ParagraphBlock({ block, onChange, onDelete }) {
  return (
    <div className="group relative rounded-lg border border-border bg-card transition-colors hover:border-input">
      <div className="absolute -left-8 top-3 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          title="Delete block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="pl-2">
        <div className="mb-1 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Paragraph</span>
        </div>
        <Textarea
          value={block.content}
          onChange={(e) => onChange(block.id, e.target.value)}
          placeholder="Write your paragraph here..."
          rows={3}
          className="resize-y"
        />
      </div>
    </div>
  );
}

function ImageBlock({ block, onChange, onDelete, onImageUpload }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    setUploading(true);
    setUploadError("");
    try {
      const imageUrl = await onImageUpload(file);
      onChange(block.id, imageUrl);
    } catch (error) {
      setUploadError(error?.message || "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="group relative rounded-lg border border-border bg-card transition-colors hover:border-input">
      <div className="absolute -left-8 top-3 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onDelete}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          title="Delete block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="pl-2">
        <div className="mb-2 flex items-center gap-2">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Image</span>
        </div>
        {block.content && (
          <div className="relative mb-3 h-48 w-full overflow-hidden rounded-lg border border-border">
            <img
              src={block.content}
              alt="Block preview"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id={`blog-image-${block.id}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading || !onImageUpload}
            />
            <label
              htmlFor={`blog-image-${block.id}`}
              className={`inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground ${uploading || !onImageUpload ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
            >
              {uploading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
              )}
              {uploading ? "Uploading..." : "Upload to Cloudinary"}
            </label>
            {block.content && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(block.id, "")}
                className="text-muted-foreground"
              >
                Remove
              </Button>
            )}
          </div>
          {uploadError && <p role="alert" className="text-sm text-destructive">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}

export default function BlogEditor({ blocks, onChange, preview, onImageUpload }) {
  const addParagraph = useCallback(() => {
    const newBlock = { id: generateId(), type: "paragraph", content: "" };
    onChange([...blocks, newBlock]);
  }, [blocks, onChange]);

  const addImage = useCallback(() => {
    const newBlock = { id: generateId(), type: "image", content: "" };
    onChange([...blocks, newBlock]);
  }, [blocks, onChange]);

  const updateBlock = useCallback((id, content) => {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, content } : b))
    );
  }, [blocks, onChange]);

  const deleteBlock = useCallback((id) => {
    onChange(blocks.filter((b) => b.id !== id));
  }, [blocks, onChange]);

  const moveBlock = useCallback((id, direction) => {
    const index = blocks.findIndex((b) => b.id === id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  }, [blocks, onChange]);

  if (preview) {
    return (
      <Card>
        <CardContent className="p-8">
          {blocks.length === 0 ? (
            <p className="text-center text-muted-foreground">No content yet. Add paragraphs and images to preview your blog.</p>
          ) : (
            <div className="space-y-6">
              {blocks.map((block) => {
                if (block.type === "image") {
                  return block.content ? (
                    <div key={block.id} className="relative rounded-xl overflow-hidden border border-border">
                      <img src={block.content} alt="Blog image" className="w-full object-cover max-h-[500px]" />
                    </div>
                  ) : null;
                }
                return block.content ? (
                  <p key={block.id} className="whitespace-pre-wrap leading-8 text-base">{block.content}</p>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addParagraph}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Paragraph
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addImage}>
          <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
          Add Image
        </Button>
        {blocks.length > 0 && (
          <>
            <Separator orientation="vertical" className="mx-1 h-5" />
            <span className="text-xs text-muted-foreground">
              {blocks.length} block{blocks.length !== 1 ? "s" : ""}
            </span>
          </>
        )}
      </div>

      {blocks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No content yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">Use the add controls above to start building your blog.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div key={block.id} className="relative">
              <div className="absolute -left-1 top-2 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, -1)}
                  disabled={index === 0}
                  className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/50 hover:text-foreground disabled:opacity-30"
                  title="Move up"
                >
                  <GripVertical className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, 1)}
                  disabled={index === blocks.length - 1}
                  className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/50 hover:text-foreground disabled:opacity-30"
                  title="Move down"
                >
                  <GripVertical className="h-3 w-3 rotate-180" />
                </button>
              </div>
              {block.type === "paragraph" ? (
                <ParagraphBlock
                  block={block}
                  onChange={updateBlock}
                  onDelete={() => deleteBlock(block.id)}
                />
              ) : (
                <ImageBlock
                  block={block}
                  onChange={updateBlock}
                  onDelete={() => deleteBlock(block.id)}
                  onImageUpload={onImageUpload}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { serializeBlocks, parseHtmlToBlocks };
