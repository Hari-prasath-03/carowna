import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface ExpandableButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  icon: React.ReactNode;
  label: React.ReactNode;
  expandedWidth?: string;
}

const ExpandableButton = React.forwardRef<
  HTMLButtonElement,
  ExpandableButtonProps
>(
  (
    {
      className,
      variant,
      size = "sm",
      icon,
      label,
      expandedWidth = "w-[125px]",
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "group relative h-8 p-0 rounded-lg overflow-hidden transition-all duration-300 ease-in-out",
          "w-8",
          expandedWidth,
          className,
        )}
        {...props}
      >
        <div className="flex items-center w-full h-full">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            {icon}
          </div>

          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs font-semibold pr-3">
            {label}
          </span>
        </div>
      </Button>
    );
  },
);
ExpandableButton.displayName = "ExpandableButton";

export { ExpandableButton };
