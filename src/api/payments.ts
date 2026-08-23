import apiClient from "./client";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  Payment,
} from "@/types";

export const paymentsApi = {
  createOrder: (data: CreateOrderRequest) =>
    apiClient.post<CreateOrderResponse>("/payments/create-order", data),

  verifyPayment: (data: VerifyPaymentRequest) =>
    apiClient.post<void>("/payments/verify", data),

  getHistory: () => apiClient.get<Payment[]>("/payments/history"),

  getByOrderId: (orderId: string) =>
    apiClient.get<Payment>(`/payments/order/${orderId}`),

  getByBookingId: (bookingId: string) =>
    apiClient.get<Payment>(`/payments/booking/${bookingId}`),
};
