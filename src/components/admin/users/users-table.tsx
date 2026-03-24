"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import GenericTable from "@/components/layout/generic-table";
import { User, Eye, Trash2 } from "lucide-react";
import { ExpandableButton } from "@/components/ui/expandable-button";
import { terminateUserAction } from "@/actions/users/delete-user";
import CustomAlert from "@/components/forms/custom-alert";
import { UserListItem } from "@/types";
import { formatDate, formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  users: UserListItem[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function UsersTable({
  users,
  currentPage,
  totalPages,
  total,
}: UsersTableProps) {
  const router = useRouter();
  const [terminatingIds, setTerminatingIds] = useState<Set<string>>(new Set());

  const handleTerminate = async (userId: string) => {
    setTerminatingIds((prev) => new Set(prev).add(userId));

    try {
      const res = await terminateUserAction(userId);
      if (res.success) toast.success(res.message);
      else toast.error(res.error);
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setTerminatingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <GenericTable
      header={{
        title: "Platform Users",
        subtitle: "Manage registered users",
      }}
      data={users}
      getRowKey={(u) => u.id}
      columns={[
        {
          header: "User",
          render: (u) => (
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border/30 flex items-center justify-center shrink-0">
                {u.profile_url ? (
                  <Image
                    src={u.profile_url}
                    alt={u.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  {u.name}
                </p>
              </div>
            </div>
          ),
        },
        {
          header: "Email",
          render: (u) => (
            <span className="text-sm font-medium text-muted-foreground">
              {u.email}
            </span>
          ),
        },
        {
          header: "Bookings",
          headerClassName: "text-center",
          className: "text-center",
          render: (u) => (
            <span className="text-sm font-black tracking-tight">
              {u.total_bookings}
            </span>
          ),
        },
        {
          header: "Signed up",
          headerClassName: "text-center",
          className: "text-center",
          render: (u) => (
            <span className="text-sm font-medium text-muted-foreground">
              {formatDate(u.created_at, "dd MMM yyyy")}
            </span>
          ),
        },
        {
          header: "Last Active",
          headerClassName: "text-center",
          className: "text-center text-sm font-medium",
          render: (u) =>
            u.last_active_at ? (
              <span className="text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider whitespace-nowrap">
                {formatDistanceToNow(new Date(u.last_active_at))}
              </span>
            ) : (
              <span className="text-muted-foreground/60 italic">Never</span>
            ),
        },
        {
          header: "Actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (u) => (
            <div className="flex items-center justify-end gap-2">
              <ExpandableButton
                variant="default"
                className="font-semibold"
                icon={<Eye className="h-4 w-4 shrink-0" />}
                label="View Details"
                expandedWidth="hover:w-[120px]"
                onClick={() => router.push(`/dashboard/users/${u.id}`)}
              />
              <CustomAlert
                title="Terminate User"
                description={`Are you sure you want to terminate ${u.name}? This action cannot be undone and will delete their account permanently.`}
                confirmText="Terminate"
                onConfirm={() => handleTerminate(u.id)}
              >
                <ExpandableButton
                  variant="outline"
                  className="font-semibold text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  icon={<Trash2 className="h-4 w-4 shrink-0" />}
                  label={
                    terminatingIds.has(u.id) ? "Terminating..." : "Terminate"
                  }
                  expandedWidth={"hover:w-[105px]"}
                  disabled={terminatingIds.has(u.id)}
                />
              </CustomAlert>
            </div>
          ),
        },
      ]}
      pagination={{
        currentPage,
        totalPages,
        total,
        label: "users",
      }}
    />
  );
}
