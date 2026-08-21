import { apiConfig } from "@/config/api.config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/auth/auth-context";
import { useNavigate } from "react-router";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const storedUser = localStorage.getItem("user");

    if (!access_token || !refresh_token || !storedUser) {
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await axios.post(`${apiConfig.API_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    },

    onSuccess: (response) => {
      const { data } = response;

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar,
        employee_id: data.user.employee_id,
      };

      setUser(userData);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", data?.token?.access_token);
      localStorage.setItem("refresh_token", data?.token?.refresh_token);

      toast.success("Logged in successfully");
      navigate("/");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Login failed. Please try again.";

        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);

    toast.success("Logged out successfully");
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
