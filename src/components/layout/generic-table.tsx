"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

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
    viewAllHref?: string;
  };
  data: T[];
  columns: Column<T>[];
  getRowKey: (item: T) => string;
}

export default function GenericTable<T>({
  header,
  data,
  columns,
  getRowKey,
}: GenericTableProps<T>) {
  return (
    <div className="bg-card rounded-2xl border border-border/40 shadow-sm overflow-hidden">
      <div className="p-8 flex justify-between items-center border-b border-border/10 bg-muted/5">
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
        {header?.viewAllHref && (
          <Link
            href={header.viewAllHref}
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors group"
          >
            View All{" "}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
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
          {data.map((item) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
