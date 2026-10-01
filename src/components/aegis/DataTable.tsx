import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchPlaceholder,
  searchFields,
  onRowClick,
  loading,
  emptyLabel = "No records match the current filters.",
  toolbar,
}: {
  rows: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFields?: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyLabel?: string;
  toolbar?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFields) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => searchFields(r).toLowerCase().includes(q));
  }, [rows, query, searchFields]);

  return (
    <div className="panel overflow-hidden">
      {(searchFields || toolbar) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          {searchFields && (
            <div className="relative min-w-56 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder ?? "Search…"}
                className="h-9 bg-background/60 pl-9"
              />
            </div>
          )}
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "label-caps px-4 py-3 text-left font-semibold whitespace-nowrap",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-border/60">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-4">
                      <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                    </td>
                  ))}
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyLabel}
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border/60 transition-colors last:border-0",
                    onRowClick && "cursor-pointer hover:bg-accent/40",
                  )}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3.5 align-middle", c.className)}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}