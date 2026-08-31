import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

export const Breadcrumbs: React.FC = () => {
  const { getBreadcrumbs } = useNavigation();
  const breadcrumbs = getBreadcrumbs();

  return (
    <nav
      className="flex items-center gap-1 text-sm text-neutral-500"
      aria-label="Breadcrumb"
    >
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-primary-500 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.to}>
          <ChevronRight className="w-4 h-4 text-neutral-300" />
          {crumb.isLast ? (
            <span className="font-medium text-neutral-700">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.to}
              className="hover:text-primary-500 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
