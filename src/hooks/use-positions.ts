import { apiConfig } from "@/config/api.config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Position {
  id: string;
  name: string;
  department: {
    id: string;
    name: string;
  };
}

export function usePositions() {
  return useQuery<Position[]>({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/positions`);

      return data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
