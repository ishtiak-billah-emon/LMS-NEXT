"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "About Us", path: "/about-us" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      close();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Lock body scroll + close on Escape while mobile menu is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm sm:h-11 sm:w-11 sm:rounded-2xl">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              TUTOR TIME
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Learn Smartly
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`relative pb-2 text-sm font-medium transition-colors after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:rounded-full after:bg-indigo-600 after:transition-transform after:duration-300 ${
                isActive(link.path)
                  ? "text-indigo-600 after:scale-x-100"
                  : "text-slate-600 after:scale-x-0 hover:text-indigo-600 hover:after:scale-x-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden lg:flex">
          {!user ? (
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-5 py-2 text-white"
            >
              Login
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto rounded-2xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 max-w-[120px] text-left">
                    <p className="truncate text-sm font-semibold">
                      {user?.fullName}
                    </p>
                    <p className="truncate text-xs capitalize text-slate-500">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <p className="font-semibold">{user?.fullName}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {user?.role} Account
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${user?.role}`}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  {/* <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link> */}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile/tablet toggle */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 active:scale-95 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile/tablet menu */}
      <div
        ref={menuRef}
        className={`overflow-hidden border-t border-slate-200 bg-white transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-[80vh] overflow-y-auto" : "max-h-0 border-t-0"
        }`}
      >
        <div className="space-y-1 px-4 py-4 sm:px-6">
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user?.fullName}
                </p>
                <p className="truncate text-xs capitalize text-slate-500">
                  {user?.role} Account
                </p>
              </div>
            </div>
          )}

          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={close}
              className={`block rounded-lg px-2 py-2.5 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="space-y-2 pt-3">
            {!user ? (
              <Link
                href="/login"
                onClick={close}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-white"
              >
                Login
              </Link>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href={`/dashboard/${user?.role}`} onClick={close}>
                    Dashboard
                  </Link>
                </Button>
                {/* <Button asChild variant="outline" className="w-full rounded-xl">
                  <Link href="/profile" onClick={close}>
                    Profile
                  </Link>
                </Button> */}
                <Button
                  variant="destructive"
                  className="w-full rounded-xl"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
