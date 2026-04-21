"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface PathTillNowProps {
  replace?: {
    this: string;
    with: string;
  };
}

const PathTillNow = ({ replace }: PathTillNowProps) => {
  const router = useRouter();
  const path = usePathname();
  const segments = path.split("/").slice(1);
  const ogPath = [...segments];
  if (replace) segments.splice(segments.indexOf(replace.this), 1, replace.with);

  return (
    <div className="flex items-center gap-1.5">
      {segments.map((segment, i) => {
        const notLast = i !== segments.length - 1;

        return (
          <span
            key={i}
            className={cn(
              "font-medium text-sm capitalize",
              notLast && "hover:underline cursor-pointer",
            )}
            onClick={() =>
              notLast && router.push(`/${ogPath.slice(0, i + 1).join("/")}`)
            }
          >
            {segment}
            {notLast && <ChevronRight className="inline size-3.5" />}
          </span>
        );
      })}
    </div>
  );
};

export default PathTillNow;
