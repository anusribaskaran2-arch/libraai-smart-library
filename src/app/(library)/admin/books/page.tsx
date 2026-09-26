import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import EmptyState, { EmptyIcon } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "Books — Admin",
};

export default function AdminBooksPage() {
  return (
    <>
      <PageHeader
        title="Book management"
        description="Add, edit and remove catalog entries."
        actions={
          <button
            type="button"
            disabled
            title="Available in the admin phase"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white opacity-50"
          >
            + Add book
          </button>
        }
      />
      <EmptyState
        icon={<EmptyIcon kind="book" />}
        title="No books listed yet"
        description="This page becomes the full CRUD interface once the database and admin phases are complete."
      />
    </>
  );
}
