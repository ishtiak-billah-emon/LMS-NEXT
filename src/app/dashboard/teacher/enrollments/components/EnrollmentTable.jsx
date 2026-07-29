"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CreateEnrollmentDialog from "./CreateEnrollmentDialog";
import EditEnrollmentDialog from "./EditEnrollmentDialog";
import DeleteEnrollmentDialog from "./DeleteEnrollmentDialog";

export default function EnrollmentTable({ enrollments = [] }) {
  // console.log("TABLE:", enrollments);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((item) =>
      item.studentEmail?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, enrollments]);

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student email..."
            className="pl-9"
          />
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Enrollment
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-background mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Course ID</TableHead>
              <TableHead>Enrollment ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEnrollments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-28 text-center text-muted-foreground"
                >
                  No enrollments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnrollments.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">
                    {item.studentEmail}
                  </TableCell>

                  <TableCell>{item.courseSlug}</TableCell>

                  <TableCell>{item.courseId}</TableCell>

                  <TableCell>{item._id}</TableCell>

                  <TableCell>৳{item.totalAmount}</TableCell>

                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedEnrollment(item);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelectedEnrollment(item);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateEnrollmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleRefresh}
      />

      <EditEnrollmentDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        enrollment={selectedEnrollment}
        onSuccess={handleRefresh}
      />

      <DeleteEnrollmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        enrollment={selectedEnrollment}
        onSuccess={handleRefresh}
      />
    </>
  );
}
