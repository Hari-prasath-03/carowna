"use client";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  count?: number;
}

export default function OtpInput({
  value,
  onChange,
  disabled,
  className,
  count = 6,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value.every((v) => v === "")) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return;

    const newValue = [...value];
    newValue[index] = char.slice(-1);
    onChange(newValue);

    if (char && index < count - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, count);

    if (pasted.length > 0) {
      const digits = pasted.split("");
      const newValue = [...value];
      digits.forEach((d, i) => {
        if (i < count) newValue[i] = d;
      });
      onChange(newValue);
      inputRefs.current[Math.min(digits.length, count - 1)]?.focus();
    }
  };

  return (
    <div
      className={cn("flex justify-center gap-2", className)}
      onPaste={handlePaste}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className="w-10 h-12 text-center text-lg font-bold px-0 focus-visible:ring-1"
        />
      ))}
    </div>
  );
}
