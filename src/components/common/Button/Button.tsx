import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  children,
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md hover:-translate-y-0.5 focus:ring-primary-300",
    secondary:
      "bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200 hover:shadow-sm focus:ring-neutral-300",
    outline:
      "bg-transparent text-primary-600 border-2 border-primary-500 hover:bg-primary-50 hover:border-primary-600 focus:ring-primary-300",
    ghost:
      "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 focus:ring-neutral-300",
    danger:
      "bg-error-500 text-white hover:bg-error-700 hover:shadow-md hover:-translate-y-0.5 focus:ring-error-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 md:px-6 py-2 md:py-2.5 text-base",
    lg: "px-6 md:px-8 py-3 md:py-3.5 text-lg",
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner text-current" aria-hidden="true" />}
      <span className={loading ? "invisible" : ""}>{children}</span>
    </button>
  );
};
