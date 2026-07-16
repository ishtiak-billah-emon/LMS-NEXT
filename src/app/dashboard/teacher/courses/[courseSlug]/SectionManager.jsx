"use client";

import { useState, useTransition } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createLesson,
  createSection,
  deleteLesson,
  deleteSection,
  updateLesson,
  updateSection,
} from "../actions";
import { Button } from "@/components/ui/button";
import ResourceManager from "./ResourceManager";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SectionManager({ course }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createLessonSection, setCreateLessonSection] = useState(null);
  const [editLessonTarget, setEditLessonTarget] = useState(null);
  const [deleteLessonTarget, setDeleteLessonTarget] = useState(null);
  const [resourceLesson, setResourceLesson] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      try {
        await createSection(course._id, course.slug, {
          title: formData.get("title"),
        });

        form.reset();
        setCreateOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to create section.");
      }
    });
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await updateSection(course._id, editSection._id, course.slug, {
          title: formData.get("title"),
        });

        setEditSection(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to update section.");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteSection(course._id, deleteTarget._id, course.slug);

        setDeleteTarget(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to delete section.");
      }
    });
  };

  const getLessonData = (form) => {
    const formData = new FormData(form);

    return {
      title: formData.get("title"),
      videoUrl: formData.get("videoUrl"),
      duration: Number(formData.get("duration")),
      preview: formData.get("preview") === "on",
    };
  };

  const handleCreateLesson = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = getLessonData(form);

    startTransition(async () => {
      try {
        await createLesson(
          course._id,
          createLessonSection._id,
          course.slug,
          data,
        );

        form.reset();
        setCreateLessonSection(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to create lesson.");
      }
    });
  };

  const handleUpdateLesson = (event) => {
    event.preventDefault();
    const data = getLessonData(event.currentTarget);

    startTransition(async () => {
      try {
        await updateLesson(
          course._id,
          editLessonTarget.section._id,
          editLessonTarget.lesson._id,
          course.slug,
          data,
        );

        setEditLessonTarget(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to update lesson.");
      }
    });
  };

  const handleDeleteLesson = () => {
    startTransition(async () => {
      try {
        await deleteLesson(
          course._id,
          deleteLessonTarget.section._id,
          deleteLessonTarget.lesson._id,
          course.slug,
        );

        setDeleteLessonTarget(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to delete lesson.");
      }
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sections</h2>
          <p className="text-muted-foreground">
            Manage section titles and review lessons.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <div className="space-y-4">
        {course.sections?.length ? (
          course.sections.map((section) => (
            <div key={section._id} className="rounded-lg border bg-background">
              <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {section.order}. {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Section ID: {section._id}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCreateLessonSection(section)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lesson
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditSection(section)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(section)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson</TableHead>
                    <TableHead>Lesson ID</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {section.lessons?.length ? (
                    section.lessons.map((lesson) => (
                      <TableRow key={lesson._id}>
                        <TableCell className="font-medium">
                          {lesson.order}. {lesson.title}
                        </TableCell>
                        <TableCell>{lesson._id}</TableCell>
                        <TableCell>{lesson.slug}</TableCell>
                        <TableCell>{lesson.duration}</TableCell>
                        <TableCell>{lesson.preview ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setResourceLesson({ section, lesson })
                              }
                              title="Manage resources"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                setEditLessonTarget({ section, lesson })
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                setDeleteLessonTarget({ section, lesson })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-20 text-center text-muted-foreground"
                      >
                        No lessons found in this section.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ))
        ) : (
          <div className="rounded-lg border bg-background p-8 text-center text-muted-foreground">
            No sections found.
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Section</DialogTitle>
            <DialogDescription>Add a new section to this course.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="create-section-title">Title</Label>
              <Input
                id="create-section-title"
                name="title"
                placeholder="Section title"
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Section"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editSection} onOpenChange={(open) => !open && setEditSection(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Section</DialogTitle>
            <DialogDescription>Change the section title.</DialogDescription>
          </DialogHeader>

          {editSection ? (
            <form key={editSection._id} onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="edit-section-title">Title</Label>
                <Input
                  id="edit-section-title"
                  name="title"
                  defaultValue={editSection.title}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditSection(null)}
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
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {deleteTarget ? (
            <div className="rounded-md border bg-muted/40 p-4">
              <p className="font-medium">{deleteTarget.title}</p>
              <p className="text-sm text-muted-foreground">
                Section ID: {deleteTarget._id}
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
              {isPending ? "Deleting..." : "Delete Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!createLessonSection}
        onOpenChange={(open) => !open && setCreateLessonSection(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Lesson</DialogTitle>
            <DialogDescription>
              Add a lesson to {createLessonSection?.title}.
            </DialogDescription>
          </DialogHeader>

          {createLessonSection ? (
            <LessonForm
              submitLabel="Create Lesson"
              pendingLabel="Creating..."
              isPending={isPending}
              onSubmit={handleCreateLesson}
              onCancel={() => setCreateLessonSection(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editLessonTarget}
        onOpenChange={(open) => !open && setEditLessonTarget(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Lesson</DialogTitle>
            <DialogDescription>Change lesson information.</DialogDescription>
          </DialogHeader>

          {editLessonTarget ? (
            <LessonForm
              key={editLessonTarget.lesson._id}
              lesson={editLessonTarget.lesson}
              submitLabel="Save Changes"
              pendingLabel="Saving..."
              isPending={isPending}
              onSubmit={handleUpdateLesson}
              onCancel={() => setEditLessonTarget(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteLessonTarget}
        onOpenChange={(open) => !open && setDeleteLessonTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {deleteLessonTarget ? (
            <div className="rounded-md border bg-muted/40 p-4">
              <p className="font-medium">{deleteLessonTarget.lesson.title}</p>
              <p className="text-sm text-muted-foreground">
                Lesson ID: {deleteLessonTarget.lesson._id}
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteLessonTarget(null)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteLesson}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!resourceLesson}
        onOpenChange={(open) => !open && setResourceLesson(null)}
      >
        {resourceLesson ? (
          <ResourceManager
            courseId={course._id}
            sectionId={resourceLesson.section._id}
            lessonId={resourceLesson.lesson._id}
            courseSlug={course.slug}
            lessonTitle={resourceLesson.lesson.title}
            resources={resourceLesson.lesson.resources}
            onClose={() => setResourceLesson(null)}
          />
        ) : null}
      </Dialog>
    </section>
  );
}

function LessonForm({
  lesson,
  submitLabel,
  pendingLabel,
  isPending,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="lesson-title">Title</Label>
        <Input
          id="lesson-title"
          name="title"
          defaultValue={lesson?.title || ""}
          placeholder="Lesson title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-video-url">Video URL</Label>
        <Input
          id="lesson-video-url"
          name="videoUrl"
          defaultValue={lesson?.videoUrl || ""}
          placeholder="https://youtu.be/..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lesson-duration">Duration</Label>
        <Input
          id="lesson-duration"
          name="duration"
          type="number"
          min="0"
          defaultValue={lesson?.duration || ""}
          placeholder="Duration"
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          name="preview"
          type="checkbox"
          defaultChecked={lesson?.preview || false}
          className="h-4 w-4 rounded border-input"
        />
        Preview lesson
      </label>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
