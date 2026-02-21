"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface FormInputProps extends ComponentProps<"input"> {
  label: string;
  name: string;
  error?: string | string[];
  containerClassName?: string;
}

export default function FormInput({
  label,
  name,
  error,
  containerClassName,
  className,
  id,
  type,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const isPassword = type === "password";

  return (
    <div className={cn("grid gap-2", containerClassName)}>
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <Input
          id={inputId}
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(className, isPassword && "pr-10")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive font-medium">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
