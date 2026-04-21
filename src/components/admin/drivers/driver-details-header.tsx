"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface Props {
  name: string;
  id: string;
}

export default function DriverDetailsHeader({ name, id }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
        {name}
      </h1>

      <Link href={`/dashboard/drivers/${id}/edit`}>
        <Button className="h-11 rounded-xl px-5 font-black text-xs uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl active:scale-95 shrink-0">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </Link>
    </div>
  );
}
