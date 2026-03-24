"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

interface CustomAlertProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  requireInputToConfirm?: string;
}

export default function CustomAlert({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Continue",
  cancelText = "Cancel",
  variant = "destructive",
  requireInputToConfirm,
}: CustomAlertProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const isConfirmDisabled =
    loading ||
    (requireInputToConfirm !== undefined &&
      inputValue !== requireInputToConfirm);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <p>{description}</p>
              {requireInputToConfirm && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Please type{" "}
                    <strong className="font-bold">
                      {requireInputToConfirm}
                    </strong>{" "}
                    to confirm.
                  </p>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full"
                    placeholder={requireInputToConfirm}
                    autoComplete="off"
                  />
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
