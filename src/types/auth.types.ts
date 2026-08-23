export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "farmer" | "provider" | "admin";
  phoneNumber: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "farmer" | "provider";
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
