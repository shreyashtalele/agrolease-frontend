import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Tractor,
  Calendar,
  Package,
  Settings,
  Bell,
  CreditCard,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles?: ("farmer" | "provider" | "admin")[];
}

export const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const userRole = user?.role || "farmer";

  const navItems: NavItem[] = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      roles: ["farmer", "provider", "admin"],
    },
    {
      to: "/equipment",
      icon: <Tractor className="w-5 h-5" />,
      label: "Browse Equipment",
      roles: ["farmer", "provider", "admin"],
    },
    {
      to: "/bookings",
      icon: <Calendar className="w-5 h-5" />,
      label: "My Bookings",
      roles: ["farmer", "provider", "admin"],
    },
    {
      to: "/listings",
      icon: <Package className="w-5 h-5" />,
      label: "My Listings",
      roles: ["provider", "admin"],
    },
    {
      to: "/admin",
      icon: <Settings className="w-5 h-5" />,
      label: "Admin Dashboard",
      roles: ["admin"],
    },
    {
      to: "/notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      roles: ["farmer", "provider", "admin"],
    },
    {
      to: "/payments",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payment History",
      roles: ["farmer", "provider", "admin"],
    },
  ];

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole as any),
  );

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-neutral-200 hover:bg-neutral-50 transition-colors"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-neutral-700" />
        ) : (
          <Menu className="w-6 h-6 text-neutral-700" />
        )}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          w-64 h-full bg-white border-r border-neutral-200
          transition-transform duration-300 ease-in-out
          flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-neutral-200 px-4">
          <Link
            to="/dashboard"
            className="text-xl font-bold text-primary-500 flex items-center gap-2"
            onClick={() => setIsMobileOpen(false)}
          >
            🌾 AgroLease
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  isActive(item.to)
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                }
              `}
              onClick={() => setIsMobileOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-neutral-200 p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
              {user?.firstName?.[0] || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-neutral-500 capitalize">{userRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-error-600 hover:bg-error-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
