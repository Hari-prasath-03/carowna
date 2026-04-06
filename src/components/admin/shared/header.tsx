interface HeaderProps {
  title: string;
  disc: string;
  actionRender?: () => React.ReactNode;
}

export default function Header({ title, disc, actionRender }: HeaderProps) {
  return (
    <div className="ml-2 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10">
      <div className="space-y-1.5">
        <h1 className="text-4xl font-black tracking-tighter text-foreground">
          {title}
        </h1>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-80">
          {disc}
        </p>
      </div>
      {actionRender && actionRender()}
    </div>
  );
}
