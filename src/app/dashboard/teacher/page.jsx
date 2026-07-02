"use client";
import { useAuth } from "@/hooks/useAuth";

export default function StudentDashboard() {
  const { user, logout, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>স্বাগতম Teacher, {user?.fullName}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
