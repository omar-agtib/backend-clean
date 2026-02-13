import { useQuery } from "@tanstack/react-query";
import { searchApi } from "../api/search.api";

export function useSearch(q: string) {
  return useQuery({
    queryKey: ["search", q],
    queryFn: () => searchApi(q, 8),
    enabled: q.trim().length >= 2,
    staleTime: 10_000,
  });
}
