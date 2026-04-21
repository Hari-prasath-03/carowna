"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Crown } from "lucide-react";
import { APPROVAL_STATUS_STYLES } from "@/constants/shared-styles";
import Link from "next/link";

interface Props {
  name: string;
  status: string;
  id: string;
  is_luxury?: boolean;
}

export default function VehicleDetailsHeader({ name, status, id, is_luxury }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex gap-5 items-center">
        <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
          {name}
        </h1>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md",
            APPROVAL_STATUS_STYLES[status],
          )}
        >
          {status}
        </Badge>
        {is_luxury && (
          <Badge
            variant="outline"
            className="text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1"
          >
            <Crown className="w-3 h-3 fill-amber-500" />
            LUXURY
          </Badge>
        )}
      </div>

      <Link href={`/vendor/vehicles/${id}/edit`}>
        <Button className="h-11 rounded-xl px-5 font-black text-xs uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl active:scale-95 shrink-0">
          <Pencil className="w-4 h-4" />
          Edit Vehicle
        </Button>
      </Link>
    </div>
  );
}
