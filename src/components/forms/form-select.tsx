"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSelectProps extends React.ComponentProps<"select"> {
  label: string;
  name: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  error?: string | string[];
  containerClassName?: string;
  onValueChange?: (value: string) => void;
  icon?: React.ReactNode;
}

export default function FormSelect({
  label,
  name,
  placeholder,
  options,
  error,
  containerClassName,
  defaultValue,
  onValueChange,
  disabled,
  icon,
}: FormSelectProps) {
  return (
    <div className={cn("grid gap-2", containerClassName)}>
      {label && (
        <Label htmlFor={name} className="ml-1 font-semibold">
          {label}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <Select
          name={name}
          defaultValue={defaultValue as string}
          onValueChange={onValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            id={name}
            className={cn(
              "w-full h-12 md:h-11 rounded-xl transition-all duration-300",
              icon && "pl-10",
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-xl">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-lg"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p className="text-xs text-destructive font-semibold mt-0.5 ml-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
