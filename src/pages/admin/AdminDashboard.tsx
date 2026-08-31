import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Package,
  List,
  Settings,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  FileText,
  User,
  DollarSign,
  Calendar,
  Shield,
} from "lucide-react";
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
import { BackButton } from "@/components/shared/BackButton";

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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    {
      id: "equipment",
      label: "Equipment",
      icon: <Package className="w-4 h-4" />,
    },
    { id: "bookings", label: "Bookings", icon: <List className="w-4 h-4" /> },
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

      const dashboardData = (statsRes.data as any)?.data || statsRes.data;

      setStats({
        totalUsers: dashboardData?.users?.total || 0,
        activeUsers: dashboardData?.users?.active || 0,
        totalEquipment: dashboardData?.equipment?.total || 0,
        pendingListings: dashboardData?.equipment?.pendingVerification || 0,
        totalBookings: dashboardData?.bookings?.total || 0,
        pendingBookings: dashboardData?.bookings?.pending || 0,
        completedBookings: dashboardData?.bookings?.completed || 0,
        totalRevenue: dashboardData?.revenue?.total || 0,
      });

      setUsers(usersRes.data?.data || []);
      setEquipment(equipmentRes.data?.data || []);
      setBookings(bookingsRes.data?.data || []);
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
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="error" withDot>
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" withDot>
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="success" withDot>
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
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
      {/* Navigation: Back Button + Page Header */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPath="/dashboard" />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileText className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary-500" />
          Admin Dashboard
        </h1>
        <p className="text-sm text-neutral-500">
          Platform overview and management
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-white rounded-lg border border-neutral-200 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2
              ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }
            `}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary-500" />
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Total Users
                </p>
              </div>
              <p className="text-2xl font-bold text-primary-500 mt-1">
                {stats.totalUsers || 0}
              </p>
              <p className="text-xs text-success-600 mt-1">
                ↑ {stats.activeUsers || 0} active
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-neutral-700" />
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Equipment
                </p>
              </div>
              <p className="text-2xl font-bold text-neutral-800 mt-1">
                {stats.totalEquipment || 0}
              </p>
              <p className="text-xs text-warning-600 mt-1">
                ⏳ {stats.pendingListings || 0} pending verification
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <List className="w-4 h-4 text-neutral-700" />
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Bookings
                </p>
              </div>
              <p className="text-2xl font-bold text-neutral-800 mt-1">
                {stats.totalBookings || 0}
              </p>
              <p className="text-xs text-warning-600 mt-1">
                ⏳ {stats.pendingBookings || 0} pending
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-success-600" />
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Total Revenue
                </p>
              </div>
              <p className="text-2xl font-bold text-success-600 mt-1">
                {formatCurrency(stats.totalRevenue || 0)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {stats.completedBookings || 0} completed
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
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
              <h3 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning-500" />
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
            <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              All Users
            </h3>
            <div className="flex gap-2">
              <Input placeholder="Search users..." className="max-w-xs" />
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
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
            <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-500" />
              All Equipment
            </h3>
            <div className="flex gap-2">
              <Input placeholder="Search equipment..." className="max-w-xs" />
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
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
            <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
              <List className="w-5 h-5 text-primary-500" />
              All Bookings
            </h3>
            <div className="flex gap-2">
              <Input placeholder="Search bookings..." className="max-w-xs" />
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
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
                <Package className="w-6 h-6 text-primary-600" />
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

export default AdminDashboard;
