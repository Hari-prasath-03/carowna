export const BOOKING_STATUS_STYLES: Record<string, string> = {
  REQUESTED:
    "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20",
  COMPLETED:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20",
  CANCELLED:
    "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/20",
  PENDING_PAYMENT:
    "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20",
};

export const BOOKING_STATUS_BADGE_STYLES =
  "text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md";

export const APPROVAL_STATUS_STYLES: Record<string, string> = {
  PENDING:
    "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20",
  APPROVED:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20",
  REJECTED:
    "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/20",
};

export const VEHICLE_TYPE_STYLES: Record<string, string> = {
  bike: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  car: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  luxury: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export const VEHICLE_TYPE_STYLES_ALT: Record<string, string> = {
  bike: "bg-orange-500/10 text-orange-600 border-orange-500/30 hover:bg-orange-500/10",
  car: "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/10",
  luxury:
    "bg-purple-500/10 text-purple-600 border-purple-500/30 hover:bg-purple-500/10",
};

export const VEHICLE_AVAILABILITY_STYLES: Record<string, string> = {
  available:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10",
  rented:
    "bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/10",
};
