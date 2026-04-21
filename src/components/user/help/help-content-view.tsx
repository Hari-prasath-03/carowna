import Header from "@/components/admin/shared/header";
import BackButton from "@/components/layout/back-button";
import { AppContent } from "@/constants/app-content";

interface HelpContentViewProps {
  data: AppContent;
  footerLabel?: string;
}

export default function HelpContentView({ data, footerLabel = "Carvona Legal Department" }: HelpContentViewProps) {
  return (
    <div className="flex flex-col gap-8 px-6 py-10 md:px-10 lg:px-14">
      <div className="flex items-center gap-4">
        <BackButton />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Go Back
        </span>
      </div>

      <Header title={data.title} disc={data.disc} />

      <div className="text-base font-medium leading-loose text-foreground/80 whitespace-pre-wrap font-serif">
        {data.content
          .trim()
          .split(".")
          .filter(item => item.trim() !== "")
          .map((item, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {item.trim()}.
            </p>
          ))}
      </div>

      <div className="pt-10 border-t border-border/10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          {footerLabel}
        </p>
      </div>
    </div>
  );
}
