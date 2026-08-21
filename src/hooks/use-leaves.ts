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

export function useLeaves(search?: string) {
  return useQuery<Leave[]>({
    queryKey: ["leaves", search],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/leaves`, {
        params: {
          search,
        },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
