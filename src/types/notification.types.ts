export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "system" | "admin";
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationFilters {
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}
