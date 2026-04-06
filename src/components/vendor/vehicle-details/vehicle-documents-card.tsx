import { FileText, ExternalLink, ShieldCheck, Wrench } from "lucide-react";

interface Props {
  rcUrl: string | null;
  insuranceUrl: string | null;
  rtoUrl: string | null;
}

export default function VehicleDocumentsCard({
  rcUrl,
  insuranceUrl,
  rtoUrl,
}: Props) {
  const docs = [
    { label: "RC DOCUMENT", url: rcUrl, icon: FileText },
    { label: "INSURANCE POLICY", url: insuranceUrl, icon: ShieldCheck },
    { label: "RTO VERIFICATION", url: rtoUrl, icon: Wrench },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {docs.map((doc) => {
        const Icon = doc.icon;
        return (
          <div
            key={doc.label}
            className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm flex flex-col gap-4"
          >
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground opacity-60">
              {doc.label}
            </p>

            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-border/5 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-background border border-border/40 flex items-center justify-center shrink-0 shadow-sm group-hover:border-primary/30 transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[11px] font-black text-foreground truncate max-w-30 uppercase tracking-tight">
                    {doc.url
                      ? doc.label.replace(" ", "_") + ".PDF"
                      : "MISSING_DOC.PDF"}
                  </span>
                </div>
              </div>
              {doc.url ? (
                <a
                  href={doc.url}
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
      })}
    </div>
  );
}
