import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { bookingsApi } from "@/api/bookings";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Modal } from "@/components/common/Modal";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import {
  formatCurrency,
  formatDate,
  formatDateRange,
} from "@/utils/formatters";
import { BackButton } from "@/components/shared/BackButton";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking(id);
    }
  }, [id]);

  const loadBooking = async (bookingId: string) => {
    setLoading(true);
    try {
      const response = await bookingsApi.getById(bookingId);
      const bookingData = (response.data as any)?.data || response.data;
      setBooking(bookingData);
    } catch (err) {
      toastError("Failed to load booking details");
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!booking) return;
    setIsActionLoading(true);
    try {
      await bookingsApi.confirm(booking._id);
      success("Booking confirmed successfully");
      setShowConfirmModal(false);
      loadBooking(booking._id);
    } catch (err) {
      toastError("Failed to confirm booking");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!booking) return;
    setIsActionLoading(true);
    try {
      await bookingsApi.complete(booking._id);
      success("Booking completed successfully");
      setShowCompleteModal(false);
      loadBooking(booking._id);
    } catch (err) {
      toastError("Failed to complete booking");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setIsActionLoading(true);
    try {
      await bookingsApi.cancel(booking._id, {
        reason: "Cancelled by user",
      });
      success("Booking cancelled successfully");
      setShowCancelModal(false);
      loadBooking(booking._id);
    } catch (err) {
      toastError("Failed to cancel booking");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Booking not found</p>
        <Link to="/bookings">
          <Button className="mt-4">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const equipment = booking.equipment;
  const renter = booking.renter;
  const owner = booking.owner;
  const isProvider = user?.role === "provider";
  const isOwner = owner?._id === user?.id;
  const isRenter = renter?._id === user?.id;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="success" withDot>
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" withDot>
            Pending
          </Badge>
        );
      case "active":
        return (
          <Badge variant="info" withDot>
            Active
          </Badge>
        );
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return (
          <Badge variant="error" withDot>
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Paid</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "refunded":
        return <Badge variant="default">Refunded</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const canConfirm = booking.status === "pending" && isOwner;
  const canComplete = booking.status === "active" && isOwner;
  const canCancel =
    (booking.status === "pending" || booking.status === "confirmed") &&
    (isRenter || isOwner);

  return (
    <div className="space-y-6">
      {/* Navigation: Breadcrumbs + Back Button */}
      <div className="flex items-center justify-between">
        <Breadcrumbs />
        <BackButton label="Back to Bookings" fallbackPath="/bookings" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
              Booking Details
            </h1>
            {getStatusBadge(booking.status)}
          </div>
          <p className="text-sm text-neutral-500">
            Booking ID: {booking._id.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equipment Card */}
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-neutral-800">Equipment</h3>
            </Card.Header>
            <Card.Body>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-neutral-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  🚜
                </div>
                <div>
                  <Link
                    to={`/equipment/${equipment?._id}`}
                    className="font-semibold text-neutral-800 hover:text-primary-500 transition-colors"
                  >
                    {equipment?.title || "Equipment"}
                  </Link>
                  <p className="text-sm text-neutral-500">
                    📍 {equipment?.location?.city || "N/A"},{" "}
                    {equipment?.location?.state || "N/A"}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Category: {equipment?.category || "N/A"}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Booking Details Card */}
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-neutral-800">
                Booking Details
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Start Date
                  </p>
                  <p className="font-medium text-neutral-800">
                    {formatDate(booking.bookingDateStart)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    End Date
                  </p>
                  <p className="font-medium text-neutral-800">
                    {formatDate(booking.bookingDateEnd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Total Days
                  </p>
                  <p className="font-medium text-neutral-800">
                    {Math.ceil(
                      (new Date(booking.bookingDateEnd).getTime() -
                        new Date(booking.bookingDateStart).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Delivery Type
                  </p>
                  <p className="font-medium text-neutral-800 capitalize">
                    {booking.delivery?.type || "Pickup"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Total Price
                  </p>
                  <p className="text-xl font-bold text-primary-600">
                    {formatCurrency(booking.totalPrice || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Security Deposit
                  </p>
                  <p className="font-medium text-neutral-800">
                    {formatCurrency(booking.securityDeposit || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Payment Status
                  </p>
                  <div>
                    {getPaymentStatusBadge(
                      booking.payment?.status || "pending",
                    )}
                  </div>
                </div>
                {booking.notes && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                      Notes
                    </p>
                    <p className="text-sm text-neutral-600">{booking.notes}</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* People Card */}
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-neutral-800">
                {isProvider ? "Renter Details" : "Owner Details"}
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="flex items-start gap-4">
                <Avatar
                  size="lg"
                  fallback={
                    isProvider
                      ? renter?.firstName?.[0] || "U"
                      : owner?.firstName?.[0] || "U"
                  }
                />
                <div>
                  <p className="font-semibold text-neutral-800">
                    {isProvider
                      ? `${renter?.firstName || "User"} ${renter?.lastName || ""}`
                      : `${owner?.firstName || "Owner"} ${owner?.lastName || ""}`}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {isProvider ? "Renter" : "Owner"}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {isProvider ? renter?.email : owner?.email}
                  </p>
                  <p className="text-sm text-neutral-500">
                    📞{" "}
                    {isProvider
                      ? renter?.phoneNumber || "N/A"
                      : owner?.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          <Card className="p-4 md:p-6 sticky top-24">
            <h3 className="font-semibold text-neutral-800 mb-4">Actions</h3>

            {canConfirm && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowConfirmModal(true)}
                className="mb-3"
              >
                Confirm Booking
              </Button>
            )}

            {canComplete && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowCompleteModal(true)}
                className="mb-3"
              >
                Complete Booking
              </Button>
            )}

            {canCancel && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Booking
              </Button>
            )}

            {!canConfirm && !canComplete && !canCancel && (
              <p className="text-sm text-neutral-500 text-center">
                No actions available for this booking
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Booking"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={isActionLoading}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            ✅
          </div>
          <div>
            <p className="font-medium text-neutral-800">
              Confirm this booking?
            </p>
            <p className="text-sm text-neutral-500">
              {booking?.equipment?.title}
            </p>
            <p className="text-xs text-success-600 mt-2">
              This will confirm the booking for the renter.
            </p>
          </div>
        </div>
      </Modal>

      {/* Complete Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Booking"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowCompleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={isActionLoading}
              onClick={handleComplete}
            >
              Complete
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-info-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            📋
          </div>
          <div>
            <p className="font-medium text-neutral-800">
              Complete this booking?
            </p>
            <p className="text-sm text-neutral-500">
              {booking?.equipment?.title}
            </p>
            <p className="text-xs text-info-600 mt-2">
              This will mark the booking as completed.
            </p>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowCancelModal(false)}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              fullWidth
              loading={isActionLoading}
              onClick={handleCancel}
            >
              Yes, Cancel
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-error-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            ⚠️
          </div>
          <div>
            <p className="font-medium text-neutral-800">Cancel this booking?</p>
            <p className="text-sm text-neutral-500">
              {booking?.equipment?.title}
            </p>
            <p className="text-xs text-error-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetails;
