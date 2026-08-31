import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { paymentsApi } from "@/api/payments";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { BackButton } from "@/components/shared/BackButton";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const PaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadPayment(id);
    }
  }, [id]);

  const loadPayment = async (paymentId: string) => {
    setLoading(true);
    try {
      // Try to get payment by order ID (razorpayOrderId)
      // If that fails, try by payment ID
      let response;
      try {
        response = await paymentsApi.getByOrderId(paymentId);
      } catch (err) {
        // If getByOrderId fails, try getByBookingId
        response = await paymentsApi.getByBookingId(paymentId);
      }
      const paymentData = (response.data as any)?.data || response.data;
      setPayment(paymentData);
    } catch (err) {
      toastError("Failed to load payment details");
      navigate("/payments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
      case "completed":
        return (
          <Badge variant="success" withDot>
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" withDot>
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="error" withDot>
            Failed
          </Badge>
        );
      case "refunded":
        return <Badge variant="default">Refunded</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Payment not found</p>
        <Link to="/payments">
          <Button className="mt-4">Back to Payments</Button>
        </Link>
      </div>
    );
  }

  const booking = payment.booking || payment.bookingId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs />
        <BackButton label="Back to Payments" fallbackPath="/payments" />
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
          Payment Details
        </h1>
        <p className="text-sm text-neutral-500">
          Payment ID: {payment._id?.slice(-8).toUpperCase() || "N/A"}
        </p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-neutral-500 mb-2">
              Payment Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-neutral-400">Amount</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatCurrency(payment.amount || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">Status</p>
                {getStatusBadge(payment.status)}
              </div>
              <div>
                <p className="text-xs text-neutral-400">Date</p>
                <p className="text-sm text-neutral-700">
                  {formatDateTime(payment.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-500 mb-2">
              Order Details
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-neutral-400">Order ID</p>
                <p className="text-sm text-neutral-700 font-mono">
                  {payment.razorpayOrderId || payment.orderId || "N/A"}
                </p>
              </div>
              {payment.razorpayPaymentId && (
                <div>
                  <p className="text-xs text-neutral-400">Payment ID</p>
                  <p className="text-sm text-neutral-700 font-mono">
                    {payment.razorpayPaymentId}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-neutral-400">Currency</p>
                <p className="text-sm text-neutral-700">
                  {payment.currency || "INR"}
                </p>
              </div>
            </div>
          </div>

          {booking && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-neutral-500 mb-2">
                Booking Information
              </h3>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Booking ID:</span>{" "}
                  {typeof booking === "object"
                    ? booking._id || "N/A"
                    : booking || "N/A"}
                </p>
                <p className="text-sm text-neutral-700 mt-1">
                  <span className="font-medium">Status:</span>{" "}
                  {typeof booking === "object"
                    ? booking.status || "N/A"
                    : "N/A"}
                </p>
                <p className="text-sm text-neutral-700 mt-1">
                  <span className="font-medium">Total Price:</span>{" "}
                  {formatCurrency(
                    typeof booking === "object" ? booking.totalPrice || 0 : 0,
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentDetails;
