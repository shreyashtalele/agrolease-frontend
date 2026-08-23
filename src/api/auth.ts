import apiClient from "./client";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
  User,
  ChangePasswordRequest,
} from "@/types";

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<RefreshTokenResponse>("/auth/refresh-token", {
      refreshToken,
    }),

  getProfile: () => apiClient.get<User>("/auth/me"),

  updateProfile: (data: Partial<User>) => apiClient.put<User>("/auth/me", data),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.put<void>("/auth/change-password", data),

  logout: () => apiClient.post<void>("/auth/logout"),
};
