export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalEquipment: number;
  pendingListings: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: "farmer" | "provider" | "admin";
  isActive?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "farmer" | "provider" | "admin";
  phoneNumber: string;
  isVerified: boolean;
  isActive: boolean;
  bookings: number;
  joined: string;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
  reason?: string;
}

export interface RejectEquipmentRequest {
  reason: string;
}

export interface AuditLog {
  _id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  timestamp: string;
}
