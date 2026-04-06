"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  images: string[] | null;
}

export default function VehicleGallery({ images }: Props) {
  const [activeImage, setActiveImage] = useState(images?.[0] || null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-muted flex items-center justify-center border border-border/20 shadow-sm">
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          No images available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-muted border border-border/20 shadow-lg">
        {activeImage && (
          <Image
            src={activeImage}
            alt="Vehicle"
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className={cn(
              "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all",
              activeImage === img
                ? "border-primary shadow-md"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={img}
              alt={`Vehicle ${i + 1}`}
              fill
              className="object-cover"
            />
            {i === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-sm font-black">
                  +{images.length - 4}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
