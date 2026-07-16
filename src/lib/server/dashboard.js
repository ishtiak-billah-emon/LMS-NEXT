import { redirect } from "next/navigation";

import { getCurrentUser } from "./auth";

function getRole(user) {
  return user?.role?.toLowerCase() || "";
}

export function getDashboardPath(user) {
  const role = getRole(user);

  if (role === "teacher") return "/dashboard/teacher";
  if (role === "student") return "/dashboard/student";

  return "/";
}

export async function requireDashboardRole(requiredRole) {
  const user = await getCurrentUser();

  if (getRole(user) !== requiredRole) {
    redirect(getDashboardPath(user));
  }

  return user;
}
