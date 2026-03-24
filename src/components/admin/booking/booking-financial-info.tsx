interface FinancialInfoProps {
  initialAmount: number;
  totalAmount: number;
  paymentMethod?: string | null;
}

export default function BookingFinancialInfo({
  initialAmount,
  totalAmount,
}: FinancialInfoProps) {
  return (
    <div className="bg-card w-full border rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
      <h2 className="text-xl font-black tracking-tight text-foreground">
        Financial Info
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: "INITIAL AMOUNT",
            value: initialAmount,
            colors: "bg-muted/50 text-foreground",
          },
          {
            title: "TOTAL AMOUNT",
            value: totalAmount,
            colors: "bg-foreground/95 text-background",
          },
        ].map((item) => (
          <div
            key={item.title}
            className={`${item.colors} rounded-xl p-6 flex flex-col justify-center`}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-2">
              {item.title}
            </p>
            <h3 className="text-3xl font-black">
              ₹{item.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
