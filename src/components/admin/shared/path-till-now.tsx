"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

interface PathTillNowProps {
  replace?: {
    this: string;
    with: string;
  };
}

const PathTillNow = ({ replace }: PathTillNowProps) => {
  const path = usePathname();
  const segments = path.split("/").slice(1);
  if (replace) segments.splice(segments.indexOf(replace.this), 1, replace.with);

  return (
    <div className="flex items-center gap-1.5">
      {segments.map((segment, index) => (
        <span key={index} className="font-medium text-sm capitalize">
          {segment}{" "}
          {index !== segments.length - 1 && (
            <ChevronRight className="inline size-3.5" />
          )}
        </span>
      ))}
    </div>
  );
};

export default PathTillNow;
