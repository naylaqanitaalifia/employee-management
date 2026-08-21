import { apiConfig } from "@/config/api.config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Department {
  id: string;
  name: string;
}

const baseUrl = apiConfig.API_URL;

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/departments`, {
        params: {
          page: 1,
          limit: 100,
          with_deleted: false,
          order_field: "created_at",
          order_direction: "DESC",
          filter: "",
        },
      });

      return data.data.list;
    },
    staleTime: 1000 * 60 * 5,
  });
}
