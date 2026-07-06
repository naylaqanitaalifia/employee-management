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
}

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/employees`);
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
