import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import EmptyState, { EmptyIcon } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Overdue — Admin",
};

export default function AdminOverduePage() {
  return (
    <>
      <PageHeader
        title="Overdue books"
        description="Records past their due date, with borrowers and contact info."
      />
      <EmptyState
        icon={<EmptyIcon kind="alert" />}
        title="No overdue tracking yet"
        description="Overdue detection activates once borrowing records and due dates exist in the database."
      />
    </>
  );
}
