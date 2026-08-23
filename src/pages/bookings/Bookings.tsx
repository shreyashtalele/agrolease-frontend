import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

type BookingStatus =
  "pending" | "confirmed" | "active" | "completed" | "cancelled";

export const Bookings = () => {
  const { user } = useAuthStore();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const tabs: { id: BookingStatus | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsApi.list({
        type: user?.role === "provider" ? "owner" : "renter",
      });
      setBookings(response.data.data || []);
    } catch (err) {
      toastError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getFilteredBookings = () => {
    if (activeTab === "all") return bookings;
    return bookings.filter((b) => b.status === activeTab);
  };

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
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "refunded":
        return <Badge variant="default">Refunded</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "border-l-4 border-success-500";
      case "pending":
        return "border-l-4 border-warning-500";
      case "active":
        return "border-l-4 border-info-500";
      case "completed":
        return "border-l-4 border-neutral-300";
      case "cancelled":
        return "border-l-4 border-error-500";
      default:
        return "";
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setIsActionLoading(true);
    try {
      await bookingsApi.cancel(selectedBooking._id, {
        reason: "Cancelled by user",
      });
      success("Booking cancelled successfully");
      setShowCancelModal(false);
      setSelectedBooking(null);
      loadBookings();
    } catch (err) {
      toastError("Failed to cancel booking");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;
    setIsActionLoading(true);
    try {
      await bookingsApi.confirm(selectedBooking._id);
      success("Booking confirmed successfully");
      setShowConfirmModal(false);
      setSelectedBooking(null);
      loadBookings();
    } catch (err) {
      toastError("Failed to confirm booking");
    } finally {
      setIsActionLoading(false);
    }
  };

  const filteredBookings = getFilteredBookings();
  const isProvider = user?.role === "provider";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            My Bookings
          </h1>
          <p className="text-sm text-neutral-500">
            Manage all your equipment bookings
          </p>
        </div>
        <Link to="/equipment">
          <Button variant="primary">Browse More Equipment</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-white rounded-lg border border-neutral-200 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all
              ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span
              className={`
                ml-2 px-2 py-0.5 text-xs rounded-full
                ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }
              `}
            >
              {tab.id === "all"
                ? bookings.length
                : bookings.filter((b) => b.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-2">
            No bookings found
          </h3>
          <p className="text-neutral-500">
            You don't have any {activeTab !== "all" ? activeTab : ""} bookings.
          </p>
          <Link to="/equipment">
            <Button variant="primary" className="mt-4">
              Browse Equipment
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card
              key={booking._id}
              className={`p-4 md:p-6 hover:shadow-md transition-shadow ${getStatusColor(booking.status)}`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left: Equipment Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    🚜
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800">
                      {booking.equipmentId?.title || "Equipment"}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      📍 {booking.equipmentId?.location?.city || "N/A"},{" "}
                      {booking.equipmentId?.location?.state || "N/A"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {getStatusBadge(booking.status)}
                      {getPaymentStatusBadge(
                        booking.paymentStatus || "pending",
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Details & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                  <div className="text-right">
                    <div className="text-sm text-neutral-500">
                      {formatDateRange(
                        booking.bookingDateStart,
                        booking.bookingDateEnd,
                      )}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {formatCurrency(booking.totalPrice)}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      Booked on {formatDate(booking.createdAt)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[100px]">
                    {booking.status === "pending" && isProvider && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowConfirmModal(true);
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === "pending" && !isProvider && (
                      <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    {booking.status === "confirmed" && (
                      <>
                        <Button variant="outline" size="sm" fullWidth>
                          View Details
                        </Button>
                        {!isProvider && (
                          <Button
                            variant="danger"
                            size="sm"
                            fullWidth
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                    {(booking.status === "active" ||
                      booking.status === "completed") && (
                      <Button variant="outline" size="sm" fullWidth>
                        View Details
                      </Button>
                    )}
                    {booking.status === "cancelled" && (
                      <Button variant="secondary" size="sm" fullWidth disabled>
                        Cancelled
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner/Renter Info */}
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3 text-sm">
                  <Avatar
                    size="sm"
                    fallback={
                      isProvider
                        ? booking.renterId?.firstName?.[0] || "U"
                        : booking.ownerId?.firstName?.[0] || "U"
                    }
                  />
                  <div>
                    <p className="font-medium text-neutral-700">
                      {isProvider
                        ? `${booking.renterId?.firstName || "User"} ${booking.renterId?.lastName || ""}`
                        : `${booking.ownerId?.firstName || "Owner"} ${booking.ownerId?.lastName || ""}`}
                    </p>
                    <p className="text-neutral-500 text-xs">
                      {isProvider ? "Renter" : "Owner"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Contact
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedBooking(null);
        }}
        title="Cancel Booking"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowCancelModal(false);
                setSelectedBooking(null);
              }}
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              fullWidth
              loading={isActionLoading}
              onClick={handleCancelBooking}
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
              {selectedBooking?.equipmentId?.title}
            </p>
            <p className="text-xs text-error-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedBooking(null);
        }}
        title="Confirm Booking"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowConfirmModal(false);
                setSelectedBooking(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={isActionLoading}
              onClick={handleConfirmBooking}
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
              {selectedBooking?.equipmentId?.title}
            </p>
            <p className="text-xs text-success-600 mt-2">
              This will confirm the booking for the renter.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
