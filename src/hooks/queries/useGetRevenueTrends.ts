import { getRevenueTrends } from "@/service/admin";
import { useQuery } from "@tanstack/react-query";

export default function useGetRevenueTrends() {
  return useQuery<{ name: string; value: number }[]>({
    queryKey: ["revenue-trends"],
    queryFn: () => getRevenueTrends(),
  });
}
