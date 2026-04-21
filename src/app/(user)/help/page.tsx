import Link from "next/link";
import Header from "@/components/admin/shared/header";
import { ChevronRight } from "lucide-react";

const helpTopics = [
  {
    title: "Privacy Policy",
    description: "Guidelines on data collection and protection",
    href: "/help/privacy-policy",
  },
  {
    title: "Terms & Conditions",
    description: "Standard agreements for using our platform",
    href: "/help/terms-and-conditions",
  },
  {
    title: "Cancellation & Refund",
    description: "Details on booking changes and refund processing",
    href: "/help/cancellation-and-refund",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-10 md:px-10 lg:px-14">
      <Header title="HELP CENTER" disc="Customer Support & Platform Policies" />

      <div className="flex flex-col divide-y divide-border/20">
        {helpTopics.map((topic) => (
          <Link
            key={topic.title}
            href={topic.href}
            className="flex items-center justify-between py-8 first:pt-0 last:pb-0 group transition-all"
          >
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                {topic.description}
              </p>
            </div>
            <div className="flex items-center justify-center size-10 rounded-full border border-border group-hover:bg-foreground group-hover:text-background transition-all">
              <ChevronRight className="size-5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-10 border-t border-border/10 flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          Contact Support
        </p>
        <a
          href="mailto:carownarental@gmail.com"
          className="text-sm font-bold text-foreground hover:underline decoration-primary underline-offset-4"
        >
          carownarental@gmail.com
        </a>
      </div>
    </div>
  );
}
