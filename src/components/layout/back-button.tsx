"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={router.back}
      className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted"
    >
      <ChevronLeft className="h-6 w-6 text-foreground" />
    </button>
  );
}
