import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface NavItem {
  to: string;
  icon: string;
  label: string;
  roles?: ("farmer" | "provider" | "admin")[];
}

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const userRole = user?.role || "farmer";

  const navItems: NavItem[] = [
    {
      to: "/dashboard",
      icon: "📊",
      label: "Dashboard",
      roles: ["farmer", "provider", "admin"],
    },
    {
      to: "/equipment",
      icon: "🚜",
      label: "Browse Equipment",
      roles: ["farmer", "provider", "admin"],
    },
    {
      to: "/bookings",
      icon: "📋",
      label: "My Bookings",
      roles: ["farmer", "provider", "admin"],
    },
    {
      to: "/listings",
      icon: "📦",
      label: "My Listings",
      roles: ["provider", "admin"],
    },
    { to: "/admin", icon: "⚙️", label: "Admin Dashboard", roles: ["admin"] },
  ];

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole as any),
  );

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-full min-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                }
              `
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
