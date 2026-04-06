import { VendorBookingDetails } from "@/types";
import { cn } from "@/lib/utils";
import { IndianRupee } from "lucide-react";
import VendorCard from "../shared/vendor-card";
import MilestoneCard from "./milestone-card";
import {
  PAYMENT_STATUS_STYLES,
  APPROVAL_STATUS_STYLES,
} from "@/constants/shared-styles";

interface Props {
  booking: VendorBookingDetails;
}

export default function PaymentSettlementCard({ booking }: Props) {
  const successfulPayments = (booking.payments || []).filter(
    (p) => p.status === "SUCCESS",
  );
  const initialPayment = successfulPayments[0];
  const finalPayment = successfulPayments.find((_, i) => i > 0);

  const totalPaid = successfulPayments.reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );
  const remainingAmount =
    Number(booking.total_amount) - Number(booking.initial_amount);
  const isFullyPaid = totalPaid >= Number(booking.total_amount);

  const statusStyles = isFullyPaid
    ? PAYMENT_STATUS_STYLES.SUCCESS
    : APPROVAL_STATUS_STYLES.PENDING;

  return (
    <VendorCard title="PAYMENT SETTLEMENT" icon={IndianRupee}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MilestoneCard
              milestone={1}
              title="Commitment Deposit"
              amount={Number(booking.initial_amount)}
              payment={initialPayment}
            />

            <MilestoneCard
              milestone={2}
              title="Remaining Balance"
              amount={remainingAmount}
              payment={finalPayment}
            />
          </div>
        </div>

        <div className="lg:col-span-4 bg-muted/20 rounded-2xl p-8 flex flex-col justify-between border border-border/20">
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                TOTAL BILLING
              </span>
              <span className="text-3xl font-black text-foreground tracking-tighter">
                ₹{Number(booking.total_amount).toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { title: "inital deposit", amount: initialPayment?.amount },
                { title: "remaining balance", amount: remainingAmount },
                { title: "total collected", amount: totalPaid },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs font-bold text-muted-foreground/80"
                >
                  <span className="uppercase">{item.title}</span>
                  <span className="text-foreground">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <div
              className={cn(
                "p-4 rounded-xl flex items-center justify-center gap-3 border shadow-sm",
                statusStyles,
              )}
            >
              <IndianRupee className="size-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isFullyPaid
                  ? "Fully Settled Account"
                  : "Pending Vendor Settlement"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </VendorCard>
  );
}
