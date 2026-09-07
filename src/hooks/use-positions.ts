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

export function usePositions() {
  return useQuery<Position[]>({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/positions`);

      return data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
