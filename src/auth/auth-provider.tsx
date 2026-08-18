import { apiConfig } from "@/config/api.config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/auth/auth-context";
import { useNavigate } from "react-router";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
      });

      localStorage.setItem("token", data.token);

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
    localStorage.removeItem("token");
    setUser(null);

    toast.success("Logged out successfully");
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading: loginMutation.isPending,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
