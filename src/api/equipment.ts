import apiClient from "./client";
import type {
  Equipment,
  EquipmentFilters,
  PaginatedResponse,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  AvailabilityResponse,
} from "@/types";

export const equipmentApi = {
  list: (filters?: EquipmentFilters) =>
    apiClient.get<PaginatedResponse<Equipment>>("/equipment", {
      params: filters,
    }),

  getById: (id: string) => apiClient.get<Equipment>(`/equipment/${id}`),

  create: (data: CreateEquipmentRequest) =>
    apiClient.post<Equipment>("/equipment", data),

  update: (id: string, data: UpdateEquipmentRequest) =>
    apiClient.put<Equipment>(`/equipment/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/equipment/${id}`),

  checkAvailability: (id: string, startDate: string, endDate: string) =>
    apiClient.get<AvailabilityResponse>(`/equipment/${id}/availability`, {
      params: { startDate, endDate },
    }),

  getCategories: () => apiClient.get<string[]>("/equipment/categories"),

  getMyListings: () =>
    apiClient.get<PaginatedResponse<Equipment>>("/equipment/my/listings"),
};
