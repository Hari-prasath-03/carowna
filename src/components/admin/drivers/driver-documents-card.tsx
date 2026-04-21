import { FileText, ExternalLink } from "lucide-react";

interface Props {
  licenseUrl: string | null;
}

export default function DriverDocumentsCard({ licenseUrl }: Props) {
  return (
    <div className="bg-card border border-border/40 rounded-3xl p-2 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-border/5 group">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-background border border-border/40 flex items-center justify-center shrink-0 shadow-sm group-hover:border-primary/30 transition-colors">
            <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[11px] font-black text-foreground truncate max-w-lg uppercase tracking-tight">
              {licenseUrl ? "DRIVER_LICENSE.PDF" : "MISSING_LICENSE.PDF"}
            </span>
          </div>
        </div>
        {licenseUrl ? (
          <a
            href={licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg"
          >
            <ExternalLink className="size-4" />
          </a>
        ) : (
          <div className="text-[10px] font-black text-rose-500/40 uppercase tracking-widest px-2">
            None
          </div>
        )}
      </div>
    </div>
  );
}
