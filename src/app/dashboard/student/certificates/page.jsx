import { Construction, Wrench } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Construction className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Feature Coming Soon
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          This feature is currently under development and isn't available yet.
        </p>

        <p className="mt-2 text-muted-foreground">
          We're working hard to bring it to you in a future update. Thank you
          for your patience and support.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border bg-muted px-5 py-3 text-sm font-medium">
          <Wrench className="h-4 w-4" />
          Under Maintenance
        </div>
      </div>
    </div>
  );
}
