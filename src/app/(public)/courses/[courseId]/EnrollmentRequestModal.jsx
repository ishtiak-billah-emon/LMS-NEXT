"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Gift } from "lucide-react";

import { createEnrollmentRequest } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BKASH_NUMBER = "01310903819";

export default function EnrollmentRequestModal({ course }) {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState("purchase");
  const [isPending, startTransition] = useTransition();
  const hasDiscount =
    typeof course.discountPrice === "number" &&
    course.discountPrice > 0 &&
    course.discountPrice < course.price;
  const amount = hasDiscount ? course.discountPrice : course.price;

  const openModal = (type) => {
    setRequestType(type);
    setOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await createEnrollmentRequest({
          name: formData.get("name"),
          email: formData.get("email"),
          courseName: formData.get("courseName"),
          courseId: course._id,
          courseSlug: course.slug,
          amount: Number(formData.get("amount")),
          transactionId: formData.get("trxId"),
          note: formData.get("note"),
          type: requestType,
        });
        form.reset(); // ✅ Use saved reference
        // event.currentTarget.reset();
        setOpen(false);
        alert("Enrollment request sent successfully.");
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to send enrollment request.");
      }
    });
  };

  return (
    <>
      <div className="mb-8 space-y-4">
        <Button
          className="h-14 w-full rounded-2xl bg-primary text-base font-bold hover:bg-primary-hover"
          onClick={() => openModal("purchase")}
        >
          Purchase Course
        </Button>

        <Button
          variant="outline"
          className="h-14 w-full rounded-2xl border-border text-base"
          onClick={() => openModal("gift")}
        >
          <Gift className="mr-2 h-5 w-5" />
          Gift This Course
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {requestType === "gift" ? "Gift Course" : "Purchase Course"}
            </DialogTitle>
            <DialogDescription>
              Send money first, then fill up the form with your payment
              information.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 rounded-lg border bg-muted/40 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/BKash-Icon-Logo.wine.svg"
                alt="bKash"
                width={96}
                height={64}
                className="h-14 w-20 object-contain"
              />
              <div>
                <p className="text-sm text-muted-foreground">bKash Number</p>
                <p className="text-xl font-bold">{BKASH_NUMBER}</p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-xl font-bold">৳{amount}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="enrollment-name">Name</Label>
                <Input id="enrollment-name" name="name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment-email">Email</Label>
                <Input
                  id="enrollment-email"
                  name="email"
                  type="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment-course-name">Course Name</Label>
                <Input
                  id="enrollment-course-name"
                  name="courseName"
                  defaultValue={course.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment-amount">Amount</Label>
                <Input
                  id="enrollment-amount"
                  name="amount"
                  type="number"
                  min="0"
                  defaultValue={amount}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="enrollment-trx-id">TrxID</Label>
                <Input id="enrollment-trx-id" name="trxId" required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="enrollment-note">Note</Label>
                <textarea
                  id="enrollment-note"
                  name="note"
                  placeholder="Optional note"
                  className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
