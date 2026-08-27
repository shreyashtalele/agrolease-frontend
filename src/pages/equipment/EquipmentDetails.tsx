import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { equipmentApi } from "@/api/equipment";
import { bookingsApi } from "@/api/bookings";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/utils/formatters";
import { useRazorpay } from "@/hooks/useRazorpay";

export const EquipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { error: toastError } = useToast();
  const { initializePayment } = useRazorpay();

  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("description");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    startDate: "",
    endDate: "",
    deliveryType: "pickup" as "pickup" | "delivery",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      loadEquipment(id);
    }
  }, [id]);

  const loadEquipment = async (equipmentId: string) => {
    setLoading(true);
    try {
      const response = await equipmentApi.getById(equipmentId);
      const equipmentData = (response.data as any)?.data || response.data;
      setEquipment(equipmentData);
    } catch (err) {
      toastError("Failed to load equipment details");
      navigate("/equipment");
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate number of days between two dates
  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate total days and amount dynamically
  const totalDays = calculateDays(bookingDates.startDate, bookingDates.endDate);
  const totalAmount =
    totalDays > 0
      ? (equipment?.rentalPricePerDay || 0) * totalDays +
        (equipment?.securityDeposit || 0)
      : (equipment?.rentalPricePerDay || 0) * 2 +
        (equipment?.securityDeposit || 0);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!bookingDates.startDate || !bookingDates.endDate) {
      toastError("Please select booking dates");
      return;
    }

    // ✅ Validate: end date must be after start date
    const days = calculateDays(bookingDates.startDate, bookingDates.endDate);
    if (days === 0) {
      toastError("End date must be after start date");
      return;
    }

    // ✅ CHECK: Prevent provider from booking their own equipment
    if (equipment?.owner?._id === user?.id) {
      toastError("You cannot book your own equipment");
      return;
    }

    setIsBooking(true);
    try {
      const response = await bookingsApi.create({
        equipmentId: id!,
        bookingDateStart: bookingDates.startDate,
        bookingDateEnd: bookingDates.endDate,
        deliveryType: bookingDates.deliveryType,
        notes: bookingDates.notes,
      });

      const booking = (response.data as any)?.data || response.data;

      if (!booking || !booking._id) {
        toastError("Failed to get booking ID");
        setIsBooking(false);
        return;
      }

      setShowBookingModal(false);

      // ✅ Use the calculated total amount
      await initializePayment({
        orderId: booking._id,
        amount: totalAmount,
        currency: "INR",
        bookingId: booking._id,
      });
    } catch (err) {
      console.error("Booking error:", err);
      toastError("Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">Equipment not found</p>
        <Link to="/equipment">
          <Button className="mt-4">Back to Browse</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "availability", label: "Availability" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="success" withDot>
            Available
          </Badge>
        );
      case "booked":
        return (
          <Badge variant="error" withDot>
            Booked
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" withDot>
            Pending
          </Badge>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "description":
        return (
          <div className="space-y-4">
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
              {equipment?.description || "No description available."}
            </p>
            <div className="flex flex-wrap gap-2">
              {equipment?.isVerified && (
                <Badge variant="success" withDot>
                  Verified Equipment
                </Badge>
              )}
              <Badge variant="info">Insurance Included</Badge>
            </div>
          </div>
        );
      case "specifications":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(equipment?.specifications || {}).map(
              ([key, value]) => (
                <div key={key} className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                    {key}
                  </p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5">
                    {String(value) || "N/A"}
                  </p>
                </div>
              ),
            )}
          </div>
        );
      case "availability":
        return (
          <div className="space-y-4">
            <div className="bg-success-50 rounded-lg p-4 border border-success-200">
              <p className="text-sm text-success-700 font-medium">
                ✅ Available for booking
              </p>
              <p className="text-sm text-success-600 mt-1">
                Contact owner for specific dates
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 rounded-lg p-3 text-center">
                <p className="text-xs text-neutral-400">Min. Days</p>
                <p className="text-lg font-semibold text-neutral-800">2</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3 text-center">
                <p className="text-xs text-neutral-400">Max. Days</p>
                <p className="text-lg font-semibold text-neutral-800">30</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Check if current user is the owner
  const isOwner = equipment?.owner?._id === user?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <Link
          to="/equipment"
          className="hover:text-primary-500 transition-colors"
        >
          Equipment
        </Link>
        <span>›</span>
        <span className="text-neutral-700 font-medium">{equipment?.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={
                  equipment?.images?.[0] ||
                  "https://via.placeholder.com/800x400/2D5A27/FFFFFF?text=No+Image"
                }
                alt={equipment?.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute top-4 left-4">
                {getStatusBadge(equipment?.status)}
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="primary">{equipment?.category}</Badge>
              </div>
            </div>
          </Card>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
                  {equipment?.title}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-neutral-500">
                    📍 {equipment?.location?.city}, {equipment?.location?.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-600">
                  {formatCurrency(equipment?.rentalPricePerDay || 0)}
                </span>
                <span className="text-sm text-neutral-500">/ day</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-neutral-600">
                <span>
                  🔒 {formatCurrency(equipment?.securityDeposit || 0)} security
                  deposit
                </span>
                <span>🕒 Minimum 2 days</span>
              </div>
            </div>
          </div>

          <Card>
            <div className="border-b border-neutral-200">
              <div className="flex gap-1 px-4 pt-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`
                      px-4 py-2 text-sm font-medium transition-all duration-200
                      border-b-2
                      ${
                        selectedTab === tab.id
                          ? "text-primary-600 border-primary-500"
                          : "text-neutral-500 hover:text-neutral-700 border-transparent hover:border-neutral-300"
                      }
                    `}
                    onClick={() => setSelectedTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 md:p-6">{renderTabContent()}</div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="elevated" className="p-4 md:p-6 sticky top-24">
            <h3 className="font-semibold text-neutral-800 mb-4">
              {isOwner ? "Your Equipment" : "Book This Equipment"}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Price per day</span>
                <span className="font-medium text-neutral-800">
                  {formatCurrency(equipment?.rentalPricePerDay || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Security deposit</span>
                <span className="font-medium text-neutral-800">
                  {formatCurrency(equipment?.securityDeposit || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Min. days</span>
                <span className="font-medium text-neutral-800">2</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 mt-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-800">
                    Total ({totalDays || 2} days)
                  </span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              disabled={equipment?.status !== "available" || isOwner}
              className="mt-4"
              onClick={() => setShowBookingModal(true)}
            >
              {isOwner
                ? "Your Equipment"
                : equipment?.status === "available"
                  ? "Book Now"
                  : "Not Available"}
            </Button>

            {isOwner && (
              <p className="text-xs text-neutral-400 text-center mt-3">
                You cannot book your own equipment
              </p>
            )}
            {!isOwner && (
              <p className="text-xs text-neutral-400 text-center mt-3">
                You won't be charged yet
              </p>
            )}
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-neutral-800 mb-3">Owner</h4>
            <div className="flex items-start gap-3">
              <Avatar
                size="md"
                fallback={`${equipment?.owner?.firstName?.[0] || ""}${equipment?.owner?.lastName?.[0] || ""}`}
              />
              <div>
                <p className="font-medium text-neutral-800">
                  {equipment?.owner?.firstName} {equipment?.owner?.lastName}
                </p>
                <p className="text-sm text-neutral-500">
                  {equipment?.location?.city}, {equipment?.location?.state}
                </p>
                <p className="text-xs text-success-600 mt-1">
                  ⚡ Responds within 1 hour
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" fullWidth className="mt-3">
              Contact Owner
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Booking"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={isBooking}
              onClick={handleBooking}
            >
              Proceed to Payment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
              🚜
            </div>
            <div>
              <p className="font-medium text-neutral-800">{equipment?.title}</p>
              <p className="text-sm text-neutral-500">
                {equipment?.location?.city}, {equipment?.location?.state}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={bookingDates.startDate}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, startDate: e.target.value })
              }
              required
            />
            <Input
              label="End Date"
              type="date"
              value={bookingDates.endDate}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, endDate: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Delivery Type
            </label>
            <select
              value={bookingDates.deliveryType}
              onChange={(e) =>
                setBookingDates({
                  ...bookingDates,
                  deliveryType: e.target.value as "pickup" | "delivery",
                })
              }
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-md bg-white text-neutral-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <Input
            label="Notes (Optional)"
            placeholder="Any special requests..."
            value={bookingDates.notes}
            onChange={(e) =>
              setBookingDates({ ...bookingDates, notes: e.target.value })
            }
          />

          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">
                {totalDays > 0 ? `${totalDays} days × ` : ""}
                {formatCurrency(equipment?.rentalPricePerDay || 0)}/day
                {equipment?.securityDeposit > 0 && ` + deposit`}
              </span>
              <span className="font-bold text-primary-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            {totalDays === 0 && (
              <p className="text-xs text-warning-600">
                ⚠️ Please select start and end dates to see the total
              </p>
            )}
            <p className="text-xs text-neutral-400">
              You'll be redirected to Razorpay for secure payment
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default EquipmentDetails;
