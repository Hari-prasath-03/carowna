import FormInput from "@/components/forms/form-input";

interface BookingPeriodProps {
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}

export function BookingPeriod({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: BookingPeriodProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-- select date --";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <section className="space-y-3">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em] px-1">
        Rental Period
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative group">
          <FormInput
            label="Start Date"
            name="start_date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            containerClassName="bg-card p-5 rounded-3xl border border-border shadow-sm space-y-3 transition-colors hover:border-muted-foreground/30 group"
            labelClassName="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block"
            className="absolute inset-x-0 bottom-5 opacity-0 cursor-pointer h-6 z-10"
          />
          <div className="absolute bottom-5 left-5 pointer-events-none">
            <p className="text-sm font-bold text-foreground">
              {formatDate(startDate)}
            </p>
          </div>
        </div>

        <div className="relative group">
          <FormInput
            label="End Date"
            name="end_date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            containerClassName="bg-card p-5 rounded-3xl border border-border shadow-sm space-y-3 transition-colors hover:border-muted-foreground/30 group"
            labelClassName="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block"
            className="absolute inset-x-0 bottom-5 opacity-0 cursor-pointer h-6 z-10"
          />
          <div className="absolute bottom-5 left-5 pointer-events-none">
            <p className="text-sm font-bold text-foreground">
              {formatDate(endDate)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
