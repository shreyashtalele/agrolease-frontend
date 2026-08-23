import apiClient from "./client";
import type {
  Notification,
  PaginatedResponse,
  NotificationFilters,
} from "@/types";

export const notificationsApi = {
  list: (filters?: NotificationFilters) =>
    apiClient.get<PaginatedResponse<Notification>>("/notifications", {
      params: filters,
    }),

  getUnreadCount: () =>
    apiClient.get<{ count: number }>("/notifications/unread-count"),

  markAsRead: (id: string) => apiClient.put<void>(`/notifications/${id}/read`),

  markAllAsRead: () => apiClient.put<void>("/notifications/read-all"),

  delete: (id: string) => apiClient.delete<void>(`/notifications/${id}`),
};
