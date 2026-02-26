"use client";

import { Drawer } from "vaul";
import { Moon, Sun, Monitor, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface SettingsDrawerProps {
  children: React.ReactNode;
}

export function SettingsDrawer({ children }: SettingsDrawerProps) {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-100" />
        <Drawer.Content className="max-w-lg mx-auto bg-background flex flex-col rounded-t-4xl h-87.5 fixed bottom-0 left-0 right-0 z-101 outline-none border-t border-border">
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-muted my-6" />
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <Drawer.Title className="text-xl font-black text-foreground uppercase tracking-tight">
                Settings
              </Drawer.Title>
              <Drawer.Close asChild>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </Drawer.Close>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60 ml-2">
                  Appearance
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border-2 transition-all duration-500 group",
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                            : "bg-muted/10 text-muted-foreground border-border/20 hover:border-border/60 hover:bg-muted/20",
                        )}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
