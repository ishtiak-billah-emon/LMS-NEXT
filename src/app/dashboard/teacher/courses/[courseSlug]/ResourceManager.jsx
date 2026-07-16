"use client";

import { useState, useTransition } from "react";
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createResource,
  deleteResource,
  updateResource,
} from "../actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResourceManager({
  courseId,
  sectionId,
  lessonId,
  courseSlug,
  lessonTitle,
  resources: initialResources,
  onClose,
}) {
  const router = useRouter();
  const [resources, setResources] = useState(initialResources || []);
  const [creating, setCreating] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString().trim();
    const fileUrl = formData.get("fileUrl")?.toString().trim();

    if (!title || !fileUrl) {
      alert("Title and File URL are required.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createResource(courseId, sectionId, lessonId, courseSlug, {
          title,
          fileUrl,
        });

        setResources((prev) => [...prev, result.data]);
        form.reset();
        setCreating(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to create resource.");
      }
    });
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString().trim();
    const fileUrl = formData.get("fileUrl")?.toString().trim();

    if (!title || !fileUrl) {
      alert("Title and File URL are required.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateResource(
          courseId,
          sectionId,
          lessonId,
          editTarget._id,
          courseSlug,
          { title, fileUrl },
        );

        setResources((prev) =>
          prev.map((resource) =>
            resource._id === editTarget._id ? result.data : resource,
          ),
        );
        setEditTarget(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to update resource.");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteResource(
          courseId,
          sectionId,
          lessonId,
          deleteTarget._id,
          courseSlug,
        );

        setResources((prev) =>
          prev.filter((resource) => resource._id !== deleteTarget._id),
        );
        setDeleteTarget(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to delete resource.");
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Lesson Resources</DialogTitle>
        <DialogDescription>
          Manage downloadable resources for &quot;{lessonTitle}&quot;.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        {resources.length ? (
          <ul className="space-y-2">
            {resources.map((resource) => (
              <li
                key={resource._id}
                className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{resource.title}</p>
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 truncate text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {resource.fileUrl}
                  </a>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditTarget(resource)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteTarget(resource)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
            No resources added to this lesson yet.
          </p>
        )}

        {!creating && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCreating(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        )}
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="space-y-4 border-t pt-4">
          <div className="space-y-2">
            <Label htmlFor="resource-title">Title</Label>
            <Input
              id="resource-title"
              name="title"
              placeholder="e.g. Lecture Slides"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-fileUrl">File URL</Label>
            <Input
              id="resource-fileUrl"
              name="fileUrl"
              placeholder="https://drive.google.com/..."
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreating(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Resource"}
            </Button>
          </DialogFooter>
        </form>
      )}

      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Resource</DialogTitle>
            <DialogDescription>Edit resource details.</DialogDescription>
          </DialogHeader>

          {editTarget ? (
            <form
              key={editTarget._id}
              onSubmit={handleUpdate}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-resource-title">Title</Label>
                <Input
                  id="edit-resource-title"
                  name="title"
                  defaultValue={editTarget.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-resource-fileUrl">File URL</Label>
                <Input
                  id="edit-resource-fileUrl"
                  name="fileUrl"
                  defaultValue={editTarget.fileUrl}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTarget(null)}
                  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {deleteTarget ? (
            <div className="rounded-md border bg-muted/40 p-4">
              <p className="font-medium">{deleteTarget.title}</p>
              <p className="text-sm text-muted-foreground">
                {deleteTarget.fileUrl}
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
