import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  return (
    <div className="min-h-scree flex items-center justify-center p-8">
      <ResetPasswordForm token={token} />
    </div>
  );
}
