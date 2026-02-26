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
  labelClassName?: string;
  inputContainerClassName?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function FormInput({
  label,
  name,
  error,
  containerClassName,
  labelClassName,
  inputContainerClassName,
  className,
  id,
  type,
  icon,
  action,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const isPassword = type === "password";

  return (
    <div className={cn("grid gap-2", containerClassName)}>
      <Label htmlFor={inputId} className={labelClassName}>
        {label}
      </Label>
      <div className={cn("relative", inputContainerClassName)}>
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <Input
          id={inputId}
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            className,
            isPassword && "pr-10",
            icon && "pl-10",
            action && "pr-12",
          )}
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
        {action && !isPassword && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {action}
          </div>
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
