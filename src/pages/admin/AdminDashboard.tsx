import { useState, useEffect } from "react";
import { adminApi } from "@/api/admin";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency, formatDate } from "@/utils/formatters";

type Tab = "overview" | "users" | "equipment" | "bookings";

export const AdminDashboard = () => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEquipment: 0,
    pendingListings: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "📊 Overview" },
    { id: "users", label: "👥 Users" },
    { id: "equipment", label: "📦 Equipment" },
    { id: "bookings", label: "📋 Bookings" },
  ];

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, equipmentRes, bookingsRes] = await Promise.all(
        [
          adminApi.getDashboardStats(),
          adminApi.listUsers({ limit: 10 }),
          adminApi.listEquipment({ limit: 10 }),
          adminApi.listBookings({ limit: 10 }),
        ],
      );
      setStats(statsRes.data);
      setUsers(usersRes.data.data || []);
      setEquipment(equipmentRes.data.data || []);
      setBookings(bookingsRes.data.data || []);
    } catch (err) {
      toastError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="error">Admin</Badge>;
      case "provider":
        return <Badge variant="primary">Provider</Badge>;
      case "farmer":
        return <Badge variant="info">Farmer</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="success" withDot>
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="error" withDot>
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" withDot>
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="success" withDot>
            Confirmed
          </Badge>
        );
      case "completed":
        return <Badge variant="default">Completed</Badge>;
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
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleUserStatusToggle = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    setIsActionLoading(true);
    try {
      await adminApi.updateUserStatus(userId, {
        isActive: !currentStatus,
        reason: currentStatus ? "Deactivated by admin" : "Activated by admin",
      });
      success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`,
      );
      loadDashboardData();
    } catch (err) {
      toastError("Failed to update user status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleVerifyEquipment = async (id: string) => {
    setIsActionLoading(true);
    try {
      await adminApi.verifyEquipment(id);
      success("Equipment verified successfully");
      setShowEquipmentModal(false);
      setSelectedEquipment(null);
      loadDashboardData();
    } catch (err) {
      toastError("Failed to verify equipment");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectEquipment = async (id: string) => {
    setIsActionLoading(true);
    try {
      await adminApi.rejectEquipment(id, { reason: "Rejected by admin" });
      success("Equipment rejected");
      setShowEquipmentModal(false);
      setSelectedEquipment(null);
      loadDashboardData();
    } catch (err) {
      toastError("Failed to reject equipment");
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">
            Admin Dashboard
          </h1>
          <p className="text-sm text-neutral-500">
            Platform overview and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            📊 Export Report
          </Button>
        </div>
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
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Total Users
              </p>
              <p className="text-2xl font-bold text-primary-500 mt-1">
                {stats.totalUsers}
              </p>
              <p className="text-xs text-success-600 mt-1">
                ↑ {stats.activeUsers} active
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Equipment
              </p>
              <p className="text-2xl font-bold text-neutral-800 mt-1">
                {stats.totalEquipment}
              </p>
              <p className="text-xs text-warning-600 mt-1">
                ⏳ {stats.pendingListings} pending verification
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Bookings
              </p>
              <p className="text-2xl font-bold text-neutral-800 mt-1">
                {stats.totalBookings}
              </p>
              <p className="text-xs text-warning-600 mt-1">
                ⏳ {stats.pendingBookings} pending
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {stats.completedBookings} completed
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">
                Recent Users
              </h3>
              <div className="space-y-2">
                {users.slice(0, 3).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-100 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        fallback={`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
                      />
                      <div>
                        <p className="font-medium text-neutral-800 text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                    {getRoleBadge(user.role)}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-800 mb-3">
                Pending Listings
              </h3>
              <div className="space-y-2">
                {equipment
                  .filter((e) => e.status === "pending")
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-100 hover:shadow-sm transition-shadow"
                    >
                      <div>
                        <p className="font-medium text-neutral-800 text-sm">
                          {item.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {item.owner?.firstName} {item.owner?.lastName} •{" "}
                          {item.category}
                        </p>
                      </div>
                      <Badge variant="warning" withDot>
                        Pending
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="font-semibold text-neutral-800">All Users</h3>
            <div className="flex gap-2">
              <Input placeholder="Search users..." className="max-w-xs" />
              <Button variant="primary" size="sm">
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    User
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Role
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Joined
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          size="sm"
                          fallback={`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
                        />
                        <div>
                          <p className="font-medium text-neutral-800">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(user.isActive ? "active" : "inactive")}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleUserStatusToggle(user.id, user.isActive)
                          }
                          loading={isActionLoading}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Equipment Tab */}
      {activeTab === "equipment" && (
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="font-semibold text-neutral-800">All Equipment</h3>
            <div className="flex gap-2">
              <Input placeholder="Search equipment..." className="max-w-xs" />
              <Button variant="primary" size="sm">
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Equipment
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Owner
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Price
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-neutral-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {item.category}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {item.owner?.firstName} {item.owner?.lastName}
                    </td>
                    <td className="py-3 px-4 font-medium text-primary-600">
                      {formatCurrency(item.rentalPricePerDay)}/day
                    </td>
                    <td className="py-3 px-4">
                      {item.status === "pending" ? (
                        <Badge variant="warning" withDot>
                          Pending
                        </Badge>
                      ) : item.status === "available" ? (
                        <Badge variant="success" withDot>
                          Verified
                        </Badge>
                      ) : (
                        getStatusBadge(item.status)
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {item.status === "pending" && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedEquipment(item);
                                setShowEquipmentModal(true);
                              }}
                            >
                              Verify
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRejectEquipment(item._id)}
                              loading={isActionLoading}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <Card className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="font-semibold text-neutral-800">All Bookings</h3>
            <div className="flex gap-2">
              <Input placeholder="Search bookings..." className="max-w-xs" />
              <Button variant="primary" size="sm">
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left">
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Equipment
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    User
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Amount
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="py-3 px-4 font-medium text-neutral-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-neutral-800">
                      {booking.equipmentId?.title || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {booking.renterId?.firstName} {booking.renterId?.lastName}
                    </td>
                    <td className="py-3 px-4 font-medium text-primary-600">
                      {formatCurrency(booking.totalPrice)}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* User Detail Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        title="User Details"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowUserModal(false);
                setSelectedUser(null);
              }}
            >
              Close
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                if (selectedUser) {
                  handleUserStatusToggle(
                    selectedUser.id,
                    selectedUser.isActive,
                  );
                  setShowUserModal(false);
                }
              }}
              loading={isActionLoading}
            >
              {selectedUser?.isActive ? "Deactivate User" : "Activate User"}
            </Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar
                size="xl"
                fallback={`${selectedUser.firstName?.[0] || ""}${selectedUser.lastName?.[0] || ""}`}
              />
              <div>
                <p className="text-xl font-semibold text-neutral-800">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-sm text-neutral-500">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(
                    selectedUser.isActive ? "active" : "inactive",
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-50 rounded-lg p-3 text-center">
                <p className="text-xs text-neutral-400">Joined</p>
                <p className="font-medium text-neutral-800">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3 text-center">
                <p className="text-xs text-neutral-400">Bookings</p>
                <p className="font-medium text-neutral-800">
                  {selectedUser.bookings || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Equipment Verify Modal */}
      <Modal
        isOpen={showEquipmentModal}
        onClose={() => {
          setShowEquipmentModal(false);
          setSelectedEquipment(null);
        }}
        title="Verify Equipment"
        maxWidth="md"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowEquipmentModal(false);
                setSelectedEquipment(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                if (selectedEquipment) {
                  handleRejectEquipment(selectedEquipment._id);
                }
              }}
              loading={isActionLoading}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                if (selectedEquipment) {
                  handleVerifyEquipment(selectedEquipment._id);
                }
              }}
              loading={isActionLoading}
            >
              ✅ Verify
            </Button>
          </>
        }
      >
        {selectedEquipment && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                🚜
              </div>
              <div>
                <p className="font-medium text-neutral-800">
                  {selectedEquipment.title}
                </p>
                <p className="text-sm text-neutral-500">
                  {selectedEquipment.owner?.firstName}{" "}
                  {selectedEquipment.owner?.lastName} •{" "}
                  {selectedEquipment.category}
                </p>
              </div>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Price</span>
                <span className="font-medium text-neutral-800">
                  {formatCurrency(selectedEquipment.rentalPricePerDay)}/day
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Submitted</span>
                <span className="font-medium text-neutral-800">
                  {formatDate(selectedEquipment.createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
