import apiClient from "./client";
import type {
  DashboardStats,
  PaginatedResponse,
  AdminUser,
  UserFilters,
  UpdateUserStatusRequest,
  Equipment,
  Booking,
  AuditLog,
  RejectEquipmentRequest,
} from "@/types";

export const adminApi = {
  getDashboardStats: () =>
    apiClient.get<DashboardStats>("/admin/dashboard/stats"),

  listUsers: (filters?: UserFilters) =>
    apiClient.get<PaginatedResponse<AdminUser>>("/admin/users", {
      params: filters,
    }),

  updateUserStatus: (id: string, data: UpdateUserStatusRequest) =>
    apiClient.put<void>(`/admin/users/${id}/status`, data),

  listEquipment: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    apiClient.get<PaginatedResponse<Equipment>>("/admin/equipment", { params }),

  verifyEquipment: (id: string) =>
    apiClient.put<void>(`/admin/equipment/${id}/verify`),

  rejectEquipment: (id: string, data: RejectEquipmentRequest) =>
    apiClient.put<void>(`/admin/equipment/${id}/reject`, data),

  listBookings: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<PaginatedResponse<Booking>>("/admin/bookings", { params }),

  getAuditLogs: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<AuditLog>>("/admin/audit-logs", { params }),
};
