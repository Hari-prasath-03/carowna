"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="relative h-full w-full group">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {images.map((img, i) => (
          <div key={i} className="min-w-full h-full snap-center relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${name} - Image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full z-10">
          {images.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "bg-white w-4" : "bg-white/40 w-1.5",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
