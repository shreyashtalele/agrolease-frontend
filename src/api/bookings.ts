import apiClient from "./client";
import type {
  Booking,
  CreateBookingRequest,
  PaginatedResponse,
  BookingFilters,
} from "@/types";

export const bookingsApi = {
  list: (filters?: BookingFilters) =>
    apiClient.get<PaginatedResponse<Booking>>("/bookings", { params: filters }),

  getById: (id: string) => apiClient.get<Booking>(`/bookings/${id}`),

  create: (data: CreateBookingRequest) =>
    apiClient.post<Booking>("/bookings", data),

  confirm: (id: string) => apiClient.put<Booking>(`/bookings/${id}/confirm`),

  complete: (id: string) => apiClient.put<Booking>(`/bookings/${id}/complete`),

  cancel: (id: string, data: { reason: string }) =>
    apiClient.put<Booking>(`/bookings/${id}/cancel`, data),
};
