import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold">404</h1>

      <p className="mt-4 text-xl">Page Not Found</p>

      <p className="mt-2 text-muted-foreground">
        The page you are looking for doesn't exist.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-md bg-primary px-6 py-3 text-primary-foreground"
      >
        Go Home
      </Link>
    </div>
  );
}
