import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { notificationsApi } from "@/api/notifications";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      // Silent fail
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-500">
            🌾 AgroLease
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="text-neutral-500 hover:text-primary-500 transition-colors duration-200 relative group"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Notifications
                </span>
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-2 group cursor-pointer">
                <Avatar
                  size="sm"
                  fallback={`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
                  className="group-hover:ring-2 group-hover:ring-primary-300 transition-all duration-200"
                />
                <span className="text-sm font-medium text-neutral-700 hidden sm:block group-hover:text-primary-600 transition-colors duration-200">
                  {user.firstName}
                </span>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
