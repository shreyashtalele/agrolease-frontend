import { useState, useEffect } from "react";
import { paymentsApi } from "@/api/payments";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency, formatDateTime } from "@/utils/formatters";

export const PaymentHistory = () => {
  const { error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentsApi.getHistory();
      setPayments(response.data || []);
    } catch (err) {
      toastError("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
          Payment History
        </h1>
        <p className="text-sm text-neutral-500">
          View all your payment transactions
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            No payments found
          </h3>
          <p className="text-neutral-500">You haven't made any payments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card
              key={payment._id}
              className="p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="font-medium text-neutral-800">
                        Payment for Booking #
                        {payment.bookingId?.slice(-6) || "N/A"}
                      </p>
                      <p className="text-sm text-neutral-500">
                        Order ID: {payment.orderId}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {formatDateTime(payment.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default PaymentHistory;
