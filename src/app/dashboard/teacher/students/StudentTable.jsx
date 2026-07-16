"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentsTable({ users }) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      // Issue: a missing email made searching throw before a row could be opened.
      // Fix: normalize optional API values before filtering them.
      (user.email ?? "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  const openStudent = (studentId) => {
    router.push(`/dashboard/teacher/students/${encodeURIComponent(studentId)}`);
  };

  return (
    <main className="space-y-8 space-x-8 mx-5 mt-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Students</h1>
          <p className="mt-1 text-text-secondary">
            Manage and view all registered students.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 outline-none transition focus:border-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Institution
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-text-secondary"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    // Issue: separate links inside cells left the table-cell padding
                    // unclickable, so clicking a student row did not always navigate.
                    // Fix: make the valid table row the single keyboard-accessible
                    // navigation target, so every point in the row opens its details.
                    role="link"
                    tabIndex={0}
                    onClick={() => openStudent(user._id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openStudent(user._id);
                      }
                    }}
                    className="cursor-pointer border-t border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  >
                    {/* Student */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.avatar ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(user.fullName)
                          }
                          alt={user.fullName}
                          className="h-11 w-11 rounded-full border object-cover"
                        />

                        <div>
                          <p className="font-semibold text-text-primary">
                            {user.fullName}
                          </p>

                          <p className="text-sm text-text-secondary">
                            @{user.userName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">{user.email}</td>

                    {/* Phone */}
                    <td className="px-6 py-4">{user.phone || "-"}</td>

                    {/* Institution */}
                    <td className="px-6 py-4">{user.institutionName || "-"}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-text-secondary">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
