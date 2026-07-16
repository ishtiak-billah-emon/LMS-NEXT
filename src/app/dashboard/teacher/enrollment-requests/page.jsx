import { getEnrollmentRequests } from "./actions";
import EnrollmentRequestTable from "./EnrollmentRequestTable";

export default async function EnrollmentRequestsPage() {
  const requests = await getEnrollmentRequests();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Enrollment Requests</h1>
        <p className="text-muted-foreground">
          Review payment requests and update their status.
        </p>
      </div>

      <EnrollmentRequestTable requests={requests} />
    </div>
  );
}
