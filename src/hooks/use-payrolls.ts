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

export function usePayrolls(search?: string) {
  return useQuery<Payroll[]>({
    queryKey: ["payrolls", search],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/payrolls`, {
        params: {
          search,
        },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
