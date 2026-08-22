import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  withDot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  withDot = false,
  children,
  className = "",
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center gap-1.5
    px-2.5 py-0.5
    rounded-full
    text-xs font-medium
  `;

  const variantClasses = {
    default: "bg-neutral-100 text-neutral-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-success-50 text-success-700",
    warning: "bg-warning-50 text-warning-700",
    error: "bg-error-50 text-error-700",
    info: "bg-info-50 text-info-700",
  };

  const dotColors = {
    default: "bg-neutral-500",
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500",
    info: "bg-info-500",
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <span className={combinedClasses} {...props}>
      {withDot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full
            ${dotColors[variant]}
          `}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
