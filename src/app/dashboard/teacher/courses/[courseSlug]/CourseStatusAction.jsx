"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { changeCourseStatus } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CourseStatusAction({ course }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isPublished = course.status === "published";
  const actionLabel = isPublished ? "UNPUBLISH" : "PUBLISH";
  const nextStatus = isPublished ? "draft" : "published";

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await changeCourseStatus(course._id, course.slug, nextStatus);

        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to change course status.");
      }
    });
  };

  return (
    <>
      <Button
        variant={isPublished ? "outline" : "default"}
        onClick={() => setOpen(true)}
      >
        {actionLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionLabel} Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this course status to {nextStatus}?
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted/40 p-4">
            <p className="font-medium">{course.title}</p>
            <p className="text-sm text-muted-foreground">
              Current status: {course.status}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="button" onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Updating..." : actionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
