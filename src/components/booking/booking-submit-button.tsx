import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingSubmitButtonProps {
  disabled?: boolean;
  label?: string;
}

export function BookingSubmitButton({
  disabled,
  label = "Confirm & Pay",
}: BookingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <div className="fixed md:bottom-0 bottom-12 left-0 right-0 p-6 bg-linear-to-t from-background via-background to-transparent z-40">
      <div className="max-w-md mx-auto">
        <Button
          type="submit"
          disabled={pending || disabled}
          className="w-full h-12 md:h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-2xl relative group overflow-hidden border border-white/5 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {pending ? (
              <>
                Confirming...
                <Loader2 className="h-5 w-5 animate-spin" />
              </>
            ) : (
              <>
                {label}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </div>
    </div>
  );
}
