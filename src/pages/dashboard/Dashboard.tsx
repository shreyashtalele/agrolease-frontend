import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { bookingsApi } from "@/api/bookings";
import { notificationsApi } from "@/api/notifications";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { formatCurrency, formatDate } from "@/utils/formatters";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBookings: 0,
    pending: 0,
    completed: 0,
    totalSpent: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load bookings
      const bookingsRes = await bookingsApi.list({ type: "renter", limit: 5 });
      const bookings = bookingsRes.data.data || [];
      setRecentBookings(bookings);

      // Calculate stats
      const active = bookings.filter(
        (b: any) => b.status === "confirmed" || b.status === "active",
      );
      const pending = bookings.filter((b: any) => b.status === "pending");
      const completed = bookings.filter((b: any) => b.status === "completed");
      const total = bookings.reduce(
        (sum: number, b: any) => sum + (b.totalPrice || 0),
        0,
      );

      setStats({
        activeBookings: active.length,
        pending: pending.length,
        completed: completed.length,
        totalSpent: total,
      });

      // Load notifications count
      const notifRes = await notificationsApi.getUnreadCount();
      setUnreadCount(notifRes.data.count || 0);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isProvider = user?.role === "provider";
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
            , {user?.firstName || "User"} 👋
          </h1>
          <p className="text-sm text-neutral-500">
            Here's what's happening with your equipment
          </p>
        </div>
        <Link to="/equipment">
          <Button variant="primary">Browse Equipment</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Active Bookings
          </p>
          <p className="text-2xl font-bold text-primary-500 mt-1">
            {stats.activeBookings}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Pending
          </p>
          <p className="text-2xl font-bold text-warning-500 mt-1">
            {stats.pending}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Completed
          </p>
          <p className="text-2xl font-bold text-success-500 mt-1">
            {stats.completed}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Total Spent
          </p>
          <p className="text-2xl font-bold text-neutral-800 mt-1">
            {formatCurrency(stats.totalSpent)}
          </p>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              Recent Bookings
            </h2>
            <Link
              to="/bookings"
              className="text-sm text-primary-500 hover:text-primary-600 transition-colors font-medium"
            >
              View all →
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-neutral-500">No bookings yet</p>
              <Link to="/equipment">
                <Button variant="primary" className="mt-4">
                  Browse Equipment
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentBookings.slice(0, 5).map((booking) => (
                <Card
                  key={booking._id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-neutral-800">
                        {booking.equipmentId?.title || "Equipment"}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {formatDate(booking.bookingDateStart)} -{" "}
                        {formatDate(booking.bookingDateEnd)}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {formatCurrency(booking.totalPrice)}
                      </p>
                    </div>
                    <div>{getStatusBadge(booking.status)}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Notifications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                Notifications
              </h2>
              <Link
                to="/notifications"
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                View all
              </Link>
            </div>

            <Card className="p-4">
              {unreadCount === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-4">
                  No new notifications
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-lg">
                    🔔
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">
                      {unreadCount} unread{" "}
                      {unreadCount === 1 ? "notification" : "notifications"}
                    </p>
                    <Link
                      to="/notifications"
                      className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      Read now →
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">
              Quick Actions
            </h2>
            <Card className="p-4 bg-primary-50 border-primary-200">
              <div className="space-y-2">
                <Link to="/equipment">
                  <Button variant="primary" size="sm" fullWidth>
                    📅 New Booking
                  </Button>
                </Link>
                <Link to="/bookings">
                  <Button variant="outline" size="sm" fullWidth>
                    📋 My Bookings
                  </Button>
                </Link>
                {isProvider && (
                  <Link to="/listings">
                    <Button variant="outline" size="sm" fullWidth>
                      📦 My Listings
                    </Button>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="danger" size="sm" fullWidth>
                      ⚙️ Admin Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
