import QueryProvider from "@/providers/query-provider";

export default function Provider({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
