import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/server/auth";
import { getDashboardPath } from "@/lib/server/dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  redirect(getDashboardPath(user));
}
