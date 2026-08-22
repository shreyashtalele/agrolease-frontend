import React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full
    font-medium
    bg-primary-100 text-primary-700
    overflow-hidden
    flex-shrink-0
    ${sizeClasses[size]}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  const fallbackText = fallback || alt?.charAt(0).toUpperCase() || "?";

  return (
    <div className={baseClasses} {...props}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="select-none">{fallbackText}</span>
      )}
    </div>
  );
};
