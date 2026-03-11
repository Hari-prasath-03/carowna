import { Separator } from "@/components/ui/separator";
import { Info, CreditCard } from "lucide-react";

interface CostSummary {
  days: number;
  rentalFee: number;
  driverCharge: number;
  taxes: number;
  totalAmount: number;
  initialDeposit: number;
}

interface BookingCostSummaryProps {
  summary: CostSummary;
  includeDriver: boolean;
}

export default function BookingCostSummary({
  summary,
  includeDriver,
}: BookingCostSummaryProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] px-1">
        Cost Summary
      </h3>
      <div className="bg-card rounded-[2.5rem] p-8 border border-border shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[13px]">
            <p className="font-medium text-muted-foreground tracking-tight">
              Rental Fee ({summary.days} {summary.days === 1 ? "day" : "days"})
            </p>
            <p className="font-bold text-foreground">
              ₹{summary.rentalFee.toFixed(2)}
            </p>
          </div>
          {includeDriver && (
            <div className="flex items-center justify-between text-[13px]">
              <p className="font-medium text-muted-foreground tracking-tight">
                Driver Charge
              </p>
              <p className="font-bold text-foreground">
                ₹{summary.driverCharge.toFixed(2)}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between text-[13px]">
            <p className="font-medium text-muted-foreground tracking-tight">
              Insurance & Taxes
            </p>
            <p className="font-bold text-foreground">
              ₹{summary.taxes.toFixed(2)}
            </p>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-foreground uppercase tracking-tight">
            Total Amount
          </p>
          <p className="text-2xl font-bold tracking-tighter tabular-nums text-primary">
            ₹{summary.totalAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <p className="text-sm font-bold text-primary uppercase tracking-tight">
              Initial pay
            </p>
          </div>
          <p className="text-xl font-bold text-primary tabular-nums">
            ₹{summary.initialDeposit.toFixed(2)}
          </p>
        </div>

        <div className="flex gap-2 items-start justify-center px-4">
          <Info className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
            Remaining balance to be paid at the counter.
          </p>
        </div>
      </div>

      <input type="hidden" name="total_amount" value={summary.totalAmount} />
      <input
        type="hidden"
        name="initial_amount"
        value={summary.initialDeposit}
      />
    </section>
  );
}
