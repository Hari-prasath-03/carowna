"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Store, Pencil, Trash2 } from "lucide-react";
import BackButton from "@/components/layout/back-button";
import PathTillNow from "../shared/path-till-now";
import { VendorProfile } from "@/types";
import deleteVendorAction from "@/actions/vendors/delete-vendor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomAlert from "@/components/forms/custom-alert";
import Link from "next/link";

interface VendorProfileHeaderProps {
  vendor: VendorProfile;
}

function formatJoinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function VendorProfileHeader({
  vendor,
}: VendorProfileHeaderProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteVendorAction(vendor.id);
    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/vendors");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <PathTillNow
          replace={{
            with: vendor.id,
            this: vendor.name,
          }}
        />
      </div>

      <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-8 flex flex-col md:flex-row gap-6 items-start justify-between relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border/30 flex items-center justify-center shrink-0">
            {vendor.profile_url ? (
              <Image
                src={vendor.profile_url}
                alt={vendor.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <Store className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-3xl font-bold tracking-tighter text-foreground">
                {vendor.name}
              </h1>
              <CustomAlert
                title="Delete Vendor"
                description={`Are you sure you want to delete ${vendor.name}? This action cannot be undone and will remove all associated data.`}
                onConfirm={handleDelete}
                confirmText="Delete"
                requireInputToConfirm={vendor.name}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 md:hidden absolute top-4 right-4"
                  title="Delete Vendor"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CustomAlert>
            </div>

            <p className="text-sm text-muted-foreground font-medium">
              Member since {formatJoinDate(vendor.created_at)}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              {vendor.native_location && (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground tracking-wider">
                  <MapPin className="h-3.5 w-3.5" />
                  {vendor.native_location}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground tracking-wider">
                <Mail className="h-3.5 w-3.5" />
                {vendor.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full justify-between md:justify-end md:w-auto mt-4 md:mt-0">
          <Button
            variant="outline"
            className="rounded-xl font-bold px-6 py-5"
            asChild
          >
            <Link href={`/dashboard/vendors/${vendor.id}/edit`}>
              <Pencil className="size-3.5" /> Edit Profile
            </Link>
          </Button>
          <CustomAlert
            title="Delete Vendor"
            description={`Are you sure you want to delete ${vendor.name}? This action cannot be undone and will remove all associated data.`}
            onConfirm={handleDelete}
            confirmText="Delete"
            requireInputToConfirm={vendor.name}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive hidden md:flex"
              title="Delete Vendor"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CustomAlert>
        </div>
      </div>
    </div>
  );
}
