type PageHeaderProps = {
  title: string;
  description?: string;
  /** Right-aligned area, e.g. a "Add book" button in the admin phase. */
  actions?: React.ReactNode;
};

/** Consistent page title block across dashboard, catalog, history and admin. */
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
