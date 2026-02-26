"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const categories = ["All", "bike", "car", "luxury"];

export default function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("type") || "All";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") params.delete("type");
    else params.set("type", category);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 overflow-x-auto no-scrollbar md:px-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={cn(
            "px-6 py-2.5 rounded-full text-[13px] font-bold transition-all whitespace-nowrap border capitalize",
            active === category
              ? "bg-primary text-accent-foreground shadow-md"
              : "bg-accent-foreground text-accent border-border/40 hover:bg-muted/50",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
