"use server";

import { unstable_cache } from "next/cache";
import createAdminClient from "@/lib/supabase/clients/admin";
import { ADMIN_CACHE_TAGS, CACHE_TIME } from "@/constants/cache-tags";
import {
  ApprovalListItem,
  ApprovalStats,
  VehicleApprovalDetails,
} from "@/types";
import { ADMIN_PAGE_SIZE } from "@/constants";
import QueryBuilder from "@/lib/query-builder";

export const getApprovalStats = unstable_cache(
  async (): Promise<ApprovalStats> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const sb = createAdminClient();

    const [{ data: vehicles }, { data: drivers }] = await Promise.all([
      sb.from("vehicles").select("approval_status, updated_at"),
      sb.from("drivers").select("approval_status, updated_at"),
    ]);

    const all = [...(vehicles ?? []), ...(drivers ?? [])];

    return {
      totalPending: all.filter((r) => r.approval_status === "PENDING").length,
      approvedToday: all.filter(
        (r) =>
          r.approval_status === "APPROVED" &&
          new Date(r.updated_at) >= new Date(todayIso),
      ).length,
      rejectedToday: all.filter(
        (r) =>
          r.approval_status === "REJECTED" &&
          new Date(r.updated_at) >= new Date(todayIso),
      ).length,
    };
  },
  [ADMIN_CACHE_TAGS.APPROVALS_STATS],
  { tags: [ADMIN_CACHE_TAGS.APPROVALS_STATS], revalidate: CACHE_TIME.FREQUENT },
);

export const getPendingVehicles = unstable_cache(
  async (page = 1, statusFilter = "PENDING") => {
    const { data, count } = await new QueryBuilder(
      createAdminClient()
        .from("vehicles")
        .select(
          `id, name, vehicle_type, approval_status, created_at, vendor:users!vehicles_vendor_id_fkey(name, profile_url)`,
          { count: "exact" },
        ),
    )
      .filter(statusFilter !== "ALL", "approval_status", statusFilter)
      .sort("created_at", false)
      .paginate(page, ADMIN_PAGE_SIZE)
      .build();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: ApprovalListItem[] = data.map((v: any) => ({
      id: v.id,
      name: v.name,
      vehicle_type: v.vehicle_type,
      approval_status: v.approval_status,
      created_at: v.created_at,
      vendor_name: v.vendor?.name ?? "Unknown Vendor",
      vendor_profile_url: v.vendor?.profile_url ?? null,
    }));

    return {
      items,
      total: count,
      totalPages: Math.ceil(count / ADMIN_PAGE_SIZE),
    };
  },
  [ADMIN_CACHE_TAGS.APPROVALS_LIST, "vehicles"],
  { tags: [ADMIN_CACHE_TAGS.APPROVALS_LIST], revalidate: CACHE_TIME.FREQUENT },
);

export const getPendingDrivers = unstable_cache(
  async (page = 1, statusFilter = "PENDING") => {
    const { data, count } = await new QueryBuilder(
      createAdminClient()
        .from("drivers")
        .select(
          `id, name, approval_status, created_at, vendor:users!drivers_vendor_id_fkey(name, profile_url)`,
          { count: "exact" },
        ),
    )
      .filter(statusFilter !== "ALL", "approval_status", statusFilter)
      .sort("created_at", false)
      .paginate(page, ADMIN_PAGE_SIZE)
      .build();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: ApprovalListItem[] = data.map((d: any) => ({
      id: d.id,
      name: d.name,
      vehicle_type: null,
      approval_status: d.approval_status,
      created_at: d.created_at,
      vendor_name: d.vendor?.name ?? "Unknown Vendor",
      vendor_profile_url: d.vendor?.profile_url ?? null,
    }));

    return {
      items,
      total: count,
      totalPages: Math.ceil(count / ADMIN_PAGE_SIZE),
    };
  },
  [ADMIN_CACHE_TAGS.APPROVALS_LIST, "drivers"],
  { tags: [ADMIN_CACHE_TAGS.APPROVALS_LIST], revalidate: CACHE_TIME.FREQUENT },
);

export const getVehicleApprovalDetails = unstable_cache(
  async (vehicleId: string): Promise<VehicleApprovalDetails | null> => {
    const { data, error } = await createAdminClient()
      .from("vehicles")
      .select(
        `id, name, brand, vehicle_type, transmission, fuel_type, capacity, price_per_day, images, registration_number, approval_status, approval_remarks, created_at, rc_doc_url, insurance_doc_url, rto_verification_doc_url,
        vendor:users!vehicles_vendor_id_fkey(name)`,
      )
      .eq("id", vehicleId)
      .single();

    if (error || !data) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v: any = data;
    return {
      id: v.id,
      name: v.name,
      brand: v.brand ?? null,
      vehicle_type: v.vehicle_type ?? null,
      transmission: v.transmission ?? null,
      fuel_type: v.fuel_type ?? null,
      capacity: v.capacity ?? null,
      price_per_day: v.price_per_day ?? 0,
      images: v.images ?? null,
      registration_number: v.registration_number,
      approval_status: v.approval_status,
      created_at: v.created_at,
      rc_doc_url: v.rc_doc_url ?? null,
      rto_doc_url: v.rto_verification_doc_url ?? null,
      insurance_doc_url: v.insurance_doc_url ?? null,
      approval_remarks: v.approval_remarks ?? null,
      vendor: {
        name: v.vendor?.name ?? "Unknown Vendor",
      },
    };
  },
  [ADMIN_CACHE_TAGS.APPROVAL_DETAILS],
  { tags: [ADMIN_CACHE_TAGS.APPROVALS_LIST], revalidate: CACHE_TIME.FREQUENT },
);
