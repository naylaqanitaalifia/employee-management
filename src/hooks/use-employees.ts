import { useQuery } from "@tanstack/react-query";
import type { Department } from "./use-departments";
import type { Position } from "./use-positions";
import axios from "axios";
import { apiConfig } from "@/config/api.config";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  position: Position;
  contract_type: string;
  start_date: string;
  status: string;
  account_number: string;
  address: string;
  created_at: string;
}

const baseUrl = apiConfig.API_URL;

export function useEmployees(debouncedSearch: string = "") {
  return useQuery<Employee[]>({
    queryKey: ["employees", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/employees`, {
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
