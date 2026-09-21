import { apiConfig } from "@/config/api.config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Position {
  id: string;
  name: string;
  created_at: string;
  department: {
    id: string;
    name: string;
    created_at: string;
  };
}

const baseUrl = apiConfig.API_URL;

export function usePositions(debouncedSearch: string = "") {
  return useQuery<Position[]>({
    queryKey: ["positions", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/positions`, {
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
