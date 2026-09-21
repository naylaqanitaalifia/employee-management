import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";

export interface Leave {
  id: string;
  type: string;
  employee: {
    id: string;
    name: string;
  };
  days: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  approved_by: string;
  approved_at: string;
  created_at: string;
  updated_at: string;
}

const baseUrl = apiConfig.API_URL;

export function useLeaves(debouncedSearch?: string) {
  return useQuery<Leave[]>({
    queryKey: ["leaves", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/leaves`, {
        params: {
          page: 1,
          limit: 100,
          with_deleted: false,
          order_field: "created_at",
          order_direction: "DESC",
          filter: debouncedSearch
            ? JSON.stringify({ name: debouncedSearch })
            : "",
        },
      });
      return data.data.list;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}
