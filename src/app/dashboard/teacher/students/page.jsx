import { getUsers } from "@/lib/server/user";
import StudentsTable from "./StudentTable";

export default async function StudentsPage() {
  const users = await getUsers();

  return <StudentsTable users={users} />;
}
