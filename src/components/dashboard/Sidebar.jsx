"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { authService } from "@/services/auth.services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const icons = {
  Award,
  BookOpen,
  ClipboardList,
  FileText,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  Wallet,
};

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

function SidebarContent({ items, user, onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = user?.role?.toLowerCase() || "student";
  const fullName = user?.fullName || "Student";
  const email = user?.email || "No email added";

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <Link href="/" className="flex items-center gap-3" onClick={onNavigate}>
          <span className="flex size-11 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap size={24} />
          </span>
          <span>
            <span className="block text-base font-bold text-slate-950">
              Tutor Time
            </span>
            <span className="block text-sm capitalize text-slate-500">
              {role} portal
            </span>
          </span>
        </Link>
      </div>

      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-12" size="lg">
            <AvatarImage src={user?.avatar || ""} alt={fullName} />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">{fullName}</p>
            <p className="truncate text-sm text-slate-500">{email}</p>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = icons[item.icon] || LayoutDashboard;
            const isDashboard = item.href === `/dashboard/${role}`;
            const active = isDashboard
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <Icon
                    size={19}
                    className={active ? "text-indigo-700" : "text-slate-500"}
                  />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <Link
          href="/courses"
          onClick={onNavigate}
          className="mb-2 flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse Courses
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ items = [], user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
          aria-label="Open dashboard menu"
        >
          <Menu size={21} />
        </button>
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <GraduationCap size={22} className="text-indigo-600" />
          Tutor Time
        </Link>
        <div className="size-10" />
      </div>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 lg:block">
        <SidebarContent items={items} user={user} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/35"
            aria-label="Close dashboard menu"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-[min(20rem,86vw)] shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm"
              aria-label="Close dashboard menu"
            >
              <X size={20} />
            </button>
            <SidebarContent
              items={items}
              user={user}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
