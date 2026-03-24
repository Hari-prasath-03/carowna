"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface GenericTableProps<T> {
  header?: {
    title: string;
    subtitle?: string;
    renderRightSection?: () => React.ReactNode;
  };
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T) => string;
  footer?: () => React.ReactNode;
  emptyMessage?: string;
  pagination?: PaginationProps;
}

export default function GenericTable<T>({
  header,
  data,
  columns,
  getRowKey,
  footer,
  emptyMessage = "No records found",
  pagination,
}: GenericTableProps<T>) {
  return (
    <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
      <div className="px-8 py-6 flex justify-between items-center border-b border-border/10 bg-muted/5">
        <div>
          <h2 className="text-xl font-black tracking-tighter text-foreground">
            {header?.title}
          </h2>
          {header?.subtitle && (
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">
              {header?.subtitle}
            </p>
          )}
        </div>
        {header?.renderRightSection && header.renderRightSection()}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 border-b border-border/20 hover:bg-muted/30">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn(
                  "px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] h-auto border-none",
                  col.headerClassName,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/5">
          {data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="px-8 py-16 text-center border-none"
              >
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Inbox className="w-10 h-10 opacity-30" />
                  <p className="text-sm font-semibold opacity-60">
                    {emptyMessage}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={getRowKey(item)}
                className="hover:bg-muted/10 transition-colors group cursor-default border-border/5"
              >
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    className={cn("px-8 py-5 border-none", col.className)}
                  >
                    {col.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && <TablePagination {...pagination} />}
      {footer && footer()}
    </div>
  );
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  label?: string;
  extraParams?: Record<string, string>;
}

function TablePagination({
  currentPage,
  totalPages,
  total,
  label = "records",
  extraParams = {},
}: PaginationProps) {
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const sp = new URLSearchParams({ ...extraParams, page: String(page) });
    return `${pathname}?${sp.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 border-t border-border/10 bg-muted/5 rounded-b-2xl">
      <p className="text-[11px] font-semibold text-muted-foreground">
        Page {currentPage} of {totalPages} - {total} {label}
      </p>
      <div className="flex items-center gap-1.5">
        <Link
          href={buildHref(currentPage - 1)}
          aria-disabled={currentPage <= 1}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:bg-muted/50 transition-colors",
            currentPage <= 1 && "pointer-events-none opacity-30",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg border text-xs font-bold transition-colors",
              p === currentPage
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/40 text-muted-foreground hover:bg-muted/50",
            )}
          >
            {p}
          </Link>
        ))}

        <Link
          href={buildHref(currentPage + 1)}
          aria-disabled={currentPage >= totalPages}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg border border-border/40 text-muted-foreground hover:bg-muted/50 transition-colors",
            currentPage >= totalPages && "pointer-events-none opacity-30",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
