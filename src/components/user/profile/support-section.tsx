import {
  LucideIcon,
  HelpCircle,
  FileText,
  Shield,
  ChevronRight,
} from "lucide-react";

interface SupportItemProps {
  label: string;
  icon: LucideIcon;
  href: string;
}

function SupportItem({ label, icon: Icon, href }: SupportItemProps) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-4 bg-primary-foreground border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
    >
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
    </a>
  );
}

export default function SupportSection() {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-foreground px-1">
        Support & Legal
      </h3>
      <div className="rounded-2xl overflow-hidden border border-border shadow-sm bg-primary-foreground">
        <SupportItem label="Help Center" icon={HelpCircle} href="#" />
        <SupportItem label="Terms of Service" icon={FileText} href="#" />
        <SupportItem label="Privacy Policy" icon={Shield} href="#" />
      </div>
    </section>
  );
}
