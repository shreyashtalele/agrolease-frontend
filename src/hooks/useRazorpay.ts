import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { paymentsApi } from "@/api/payments";
import { useToast } from "@/hooks/useToast";

interface RazorpayOptions {
  orderId: string;
  amount: number;
  currency: string;
  bookingId: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const initializePayment = useCallback(
    async ({ bookingId }: RazorpayOptions) => {
      try {
        const response = await paymentsApi.createOrder({ bookingId });
        const orderData = (response.data as any)?.data || response.data;

        if (!orderData || !orderData.orderId) {
          throw new Error("Invalid order response");
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "AgroLease",
          description: `Booking #${bookingId}`,
          order_id: orderData.orderId,
          prefill: {
            contact: "",
            email: "",
          },
          theme: {
            color: "#2D5A27",
          },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled");
            },
          },
          handler: async (response: any) => {
            try {
              await paymentsApi.verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });
              toast.success("Payment successful! Booking confirmed.");
              navigate("/bookings");
            } catch (error) {
              toast.error(
                "Payment verification failed. Please contact support.",
              );
            }
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Failed to initiate payment. Please try again.");
      }
    },
    [navigate, toast],
  );

  return { initializePayment };
};
