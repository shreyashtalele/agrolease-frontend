import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      const interval = setInterval(loadUnreadCount, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      // Silent fail - don't show toast for background polling
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
                className="text-neutral-400 hover:text-neutral-600 transition-colors relative"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Avatar */}
              <div className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  fallback={`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
                />
                <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                  {user.firstName}
                </span>
              </div>

              {/* Logout */}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
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
