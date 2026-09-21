import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";

export interface Payroll {
  id: string;
  type: string;
  employee: {
    id: string;
    name: string;
  };
  period_month: string;
  basic_salary: number;
  allowance: number;
  overtime_pay: number;
  deduction: number;
  net_salary: number;
  status: string;
  paid_at: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

const baseUrl = apiConfig.API_URL;

export function usePayrolls(debouncedSearch?: string) {
  return useQuery<Payroll[]>({
    queryKey: ["payrolls", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/payrolls`, {
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
