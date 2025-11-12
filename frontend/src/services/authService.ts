import api from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post("/users/login", credentials, {
      params: credentials,
    });
    return response.data;
  },

  async register(userData: RegisterData): Promise<User> {
    const response = await api.post("/users/register", userData, {
      params: userData,
    });
    return response.data;
  },
  async getCurrentUser(): Promise<User> {
    const response = await api.get("/users/me");
    return response.data;
  },
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
