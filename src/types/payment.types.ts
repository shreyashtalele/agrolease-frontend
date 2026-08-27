export interface Payment {
  _id: string;
  bookingId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "refunded";
  method: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  bookingId: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    contact?: string;
    email?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal: {
    ondismiss: () => void;
  };
}
