import { User, UserCheck, ChevronRight, Loader2 } from "lucide-react";

interface ChoiceStepProps {
  onSelfDrive: () => void;
  onNeedDriver: () => void;
  loading: boolean;
}

export function ChoiceStep({
  onSelfDrive,
  onNeedDriver,
  loading,
}: ChoiceStepProps) {
  return (
    <div className="space-y-4 pt-4">
      <button
        onClick={onSelfDrive}
        disabled={loading}
        className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-card border border-border shadow-sm transition-all hover:bg-muted/50 active:scale-[0.98] group"
      >
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-3xl bg-primary flex items-center justify-center">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-left space-y-1">
            <p className="font-black text-lg uppercase tracking-tight">
              Self Drive
            </p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Drive it yourself
            </p>
          </div>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        )}
      </button>

      <button
        onClick={onNeedDriver}
        disabled={loading}
        className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-card border border-border shadow-sm transition-all hover:bg-muted/50 active:scale-[0.98] group"
      >
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-3xl bg-primary flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-left space-y-1">
            <p className="font-black text-lg uppercase tracking-tight">
              Need a Driver
            </p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Professional service
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
