import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/common/Button";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

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
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  3
                </span>
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
