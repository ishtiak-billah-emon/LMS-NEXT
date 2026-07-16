"use client";

import { useMemo, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
import { updateEnrollmentRequestStatus } from "./actions";

const statuses = ["pending", "approved", "rejected"];
const requestsPerPage = 10;

const rowColors = {
  pending: "bg-yellow-50 hover:bg-yellow-100/70",
  approved: "bg-green-50 hover:bg-green-100/70",
  rejected: "bg-red-50 hover:bg-red-100/70",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function getDateTimestamp(value) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function EnrollmentRequestTable({ requests = [] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState({});
  const previousRequestsRef = useRef(requests);

  const displayRequests = useMemo(() => {
    return requests.map((request) => {
      const override = optimisticStatus[request._id];
      return override !== undefined ? { ...request, status: override } : request;
    });
  }, [requests, optimisticStatus]);

  const filteredRequests = useMemo(() => {
    const term = search.toLowerCase().trim();

    const matchingRequests = term
      ? displayRequests.filter((request) => {
          return [
            request.student?.email,
            request.email,
            request.course?.title,
            request.transactionId,
            request.note,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term));
        })
      : displayRequests;

    return [...matchingRequests].sort(
      (a, b) => getDateTimestamp(b.createdAt) - getDateTimestamp(a.createdAt),
    );
  }, [displayRequests, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequests.length / requestsPerPage),
  );

  const safePage = Math.min(currentPage, totalPages);

  const visibleRequests = filteredRequests.slice(
    (safePage - 1) * requestsPerPage,
    safePage * requestsPerPage,
  );

  const handleStatusChange = (request, status) => {
    setError("");
    setUpdatingId(request._id);

    previousRequestsRef.current = requests;
    setOptimisticStatus((prev) => ({ ...prev, [request._id]: status }));

    startTransition(async () => {
      try {
        await updateEnrollmentRequestStatus(request._id, status);
        router.refresh();
      } catch (err) {
        setError(err.message || "Could not update request status.");
        setOptimisticStatus((prev) => {
          const next = { ...prev };
          delete next[request._id];
          return next;
        });
      } finally {
        setUpdatingId(null);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search requests..."
          className="pl-9"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-28 text-center text-muted-foreground"
                >
                  No enrollment requests found.
                </TableCell>
              </TableRow>
            ) : (
              visibleRequests.map((request) => {
                const currentStatus = statuses.includes(request.status)
                  ? request.status
                  : "pending";

                const isUpdating = isPending && updatingId === request._id;

                return (
                  <TableRow
                    key={request._id}
                    className={rowColors[currentStatus]}
                  >
                    {/* Student */}
                    <TableCell>
                      <p className="font-medium">
                        {request.student?.email || "—"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {request.email || "—"}
                      </p>
                    </TableCell>

                    {/* Course */}
                    <TableCell>{request.course?.title || "—"}</TableCell>

                    {/* Amount */}
                    <TableCell>
                      {request.amount != null ? `৳${request.amount}` : "—"}
                    </TableCell>

                    {/* Transaction ID */}
                    <TableCell>{request.transactionId || "—"}</TableCell>

                    {/* Note */}
                    <TableCell>{request.note?.trim() || "—"}</TableCell>

                    {/* Date */}
                    <TableCell>{formatDate(request.createdAt)}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <select
                        value={currentStatus}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(request, e.target.value)
                        }
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm capitalize outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {isUpdating && status === currentStatus
                              ? "Updating..."
                              : status}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredRequests.length > 0 && (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {(safePage - 1) * requestsPerPage + 1}–
            {Math.min(safePage * requestsPerPage, filteredRequests.length)} of{" "}
            {filteredRequests.length} requests
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              Previous
            </Button>

            <span>
              Page {safePage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
